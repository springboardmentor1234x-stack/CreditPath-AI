import pandas as pd
import numpy as np
import re
import joblib
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from datetime import timedelta
from app import models, schemas, security
from app.database import engine, get_db

# --- 1. Create the database tables ---
models.Base.metadata.create_all(bind=engine)

# --- 2. Load the ML model ---
try:
    model = joblib.load('app/loan_model.joblib')
    median_values = pd.read_json('app/median_values.json', typ='series')
    model_columns = joblib.load('app/model_columns.joblib')
    print("Model and tools loaded successfully.")
except FileNotFoundError:
    print("ERROR: Model files not found. Make sure they are in the 'app/' folder.")
    model = None

# --- 3. Define the FastAPI app ---
app = FastAPI(
    title="CreditPath-AI API",
    description="API for loan default prediction and user authentication.",
    version="2.0"
)

# --- 4. CORS ---
origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- 5. OAuth2 Scheme ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# AUTH HELPER FUNCTIONS


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Dependency to get the current user from a token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = security.decode_access_token(token)
    if token_data is None:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

#AUTHENTICATION ENDPOINTS (v2.0)


@app.post("/signup", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user."""
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        fullname=user.fullname,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Logs in a user and returns a JWT access token."""
    # 1. Find the user by email (username from the form)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    # 2. Check if user exists and password is correct
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Create the access token
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Test endpoint to check if a user is logged in."""
    return current_user


# ML PREDICTION ENDPOINT


@app.post("/predict_batch")
def predict_default_batch(
    loan_requests: List[schemas.LoanRequest], 
    current_user: models.User = Depends(get_current_user)
):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    predictions = []
    for loan_request in loan_requests:
        input_data = loan_request.model_dump()
        processed_data = engineer_features(input_data)
        prediction_proba = model.predict_proba(processed_data)[0][1]
        action, recommendation, status_key = map_probability_to_action(prediction_proba)
        predictions.append({
            "status": status_key,
            "action": action,
            "recommendation": recommendation,
            "probability_of_default": float(prediction_proba)
        })
    return predictions

# --- 6. Feature Engineering Function ---
def engineer_features(data):
    X = pd.DataFrame([data])
    X['term'] = X['term'].str.replace(' months', '').astype(float)
    X['revol_util'] = X['revol_util'].astype(str).str.replace(r'[“%”]', '', regex=True).str.strip()
    X['revol_util'] = pd.to_numeric(X['revol_util'], errors='coerce')
    def clean_emp_length(text):
        if pd.isnull(text) or text == 'n/a': return np.nan
        if '< 1 year' in text: return 0.5
        if '10+ years' in text: return 10
        match = re.search(r'(\d+)', text)
        if match: return float(match.group(1))
        return np.nan
    X['emp_length'] = X['emp_length'].apply(clean_emp_length)
    today = pd.to_datetime('today')
    earliest_cr_line_dt = pd.to_datetime(X['earliest_cr_line'], format='%b-%y', errors='coerce')
    earliest_cr_line_dt = earliest_cr_line_dt.apply(lambda x: x - pd.DateOffset(years=100) if x > today else x)
    X['credit_history_length_months'] = (today.year * 12 + today.month) - (earliest_cr_line_dt.dt.year * 12 + earliest_cr_line_dt.dt.month)
    X['credit_history_length_months'] = X['credit_history_length_months'].replace(0, 1)
    X['annual_inc'] = X['annual_inc'].replace(0, np.nan)
    X['loan_to_income_ratio'] = X['loan_amnt'] / X['annual_inc']
    X['revol_bal_per_acc'] = np.where(X['open_acc'] > 0, X['revol_bal'] / X['open_acc'], 0)
    X['acc_open_freq'] = np.where(X['credit_history_length_months'] > 0, X['total_acc'] / X['credit_history_length_months'], 0)
    X['loan_to_term'] = X['loan_amnt'] / X['term']
    X['dti_x_int_rate'] = X['dti'] * X['int_rate']
    X['inq_dti_interaction'] = X['inq_last_6mths'] * X['dti']
    X['term_x_int_rate'] = X['term'] * X['int_rate']
    X['acc_utilization'] = np.where(X['total_acc'] > 0, X['open_acc'] / X['total_acc'], 0)
    X['loan_burden_ratio'] = X['installment'] / (X['annual_inc'] + 1e-6)
    X['risk_weighted_debt_load'] = (X['dti'] * X['int_rate']) / (X['annual_inc'] + 1e-6)
    X['credit_seeking_pressure'] = X['inq_last_6mths'] * X['acc_utilization']
    X['revol_util_x_int_rate'] = X['revol_util'] * X['int_rate']
    X_processed = pd.get_dummies(X, drop_first=True)
    X_final = pd.DataFrame(0.0, index=[0], columns=model_columns)
    X_final.update(X_processed)
    X_final = X_final.fillna(median_values)
    X_final.columns = X_final.columns.str.replace('[^A-Za-z0-9_]+', '_', regex=True)
    X_final = X_final.astype(float)
    return X_final

# --- 7. Mapping Function ---
def map_probability_to_action(probability: float):
    if probability < 0.30: return "Approve", "Auto-approve. Applicant is low risk.", "approve"
    elif probability < 0.70: return "Review", "Send for manual review. Applicant is medium risk.", "review"
    else: return "Deny", "Auto-deny. Applicant is high risk.", "deny"
# --- 8. MOUNT STATIC FILES (THE FRONTEND) ---
app.mount("/", StaticFiles(directory="static", html = True), name="static")