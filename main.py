# backend/main.py
import os
import json
import hashlib
import random
from typing import Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
USERS_FILE = os.path.join(BASE_DIR, "users.json")
MODEL_PATH = os.path.join(MODELS_DIR, "xgb_model.pkl")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# Ensure users.json exists and is valid JSON array
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)

# If file exists but empty or invalid, repair it
try:
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        content = f.read().strip()
    if not content:
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)
    else:
        # try load to ensure valid JSON array
        d = json.loads(content)
        if not isinstance(d, list):
            with open(USERS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)
except Exception:
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)

app = FastAPI(title="Credit Path AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during dev; restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# helper functions
def load_users() -> List[dict]:
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, list):
                return []
            return data
    except Exception:
        return []


def save_users(users: List[dict]):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def find_user_by_email(email: str) -> Optional[dict]:
    users = load_users()
    for u in users:
        if u.get("email") == email.lower():
            return u
    return None


# Pydantic models
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PredictRequest(BaseModel):
    name: Optional[str] = "Unknown"
    age: int
    income: float
    loan_amount: float
    credit_score: float
    debt_to_income_ratio: float
    existing_loans: int


# Attempt to load model (optional). If no model, use heuristic.
model = None
try:
    import joblib

    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Loaded ML model from", MODEL_PATH)
    else:
        print("No ML model found at", MODEL_PATH, "- using heuristic.")
except Exception as e:
    print("Model load error (will use heuristic):", e)
    model = None


# endpoints
@app.get("/")
def root():
    return {"message": "Credit Path AI API"}


@app.post("/register")
def register(req: RegisterRequest):
    email = req.email.lower()
    users = load_users()
    if any(u["email"] == email for u in users):
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = {
        "id": len(users) + 1,
        "name": req.name,
        "email": email,
        "password": hash_password(req.password),
    }
    users.append(new_user)
    save_users(users)
    return {"ok": True, "message": "Registered"}


@app.post("/login")
def login(req: LoginRequest):
    email = req.email.lower()
    user = find_user_by_email(email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if user.get("password") != hash_password(req.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = hashlib.sha1(f"{user['email']}{random.random()}".encode()).hexdigest()
    return {"ok": True, "token": token, "name": user.get("name", "")}


@app.get("/users/count")
def users_count():
    users = load_users()
    return {"count": len(users)}


@app.post("/predict/")
def predict(data: PredictRequest):
    # --- heuristic scoring ---
    prob = 0.5

    ratio = data.loan_amount / (data.income + 1)
    if ratio > 2:
        prob += 0.25
    elif ratio > 1.5:
        prob += 0.15
    elif ratio < 0.8:
        prob -= 0.12

    if data.credit_score < 600:
        prob += 0.25
    elif data.credit_score > 750:
        prob -= 0.2

    if data.debt_to_income_ratio > 50:
        prob += 0.18
    elif data.debt_to_income_ratio < 25:
        prob -= 0.1

    if data.existing_loans >= 3:
        prob += 0.12

    prob = max(0.02, min(0.98, prob + random.uniform(-0.02, 0.02)))
    percentage = round(prob * 100, 2)

    # Determine prediction & emoji
    if prob > 0.7:
        prediction = "High Risk"
        emoji = "❌"
    elif prob > 0.4:
        prediction = "Moderate Risk"
        emoji = "❗"
    else:
        prediction = "Low Risk"
        emoji = "☑️"

    return {
        "name": data.name,
        "prediction": prediction,
        "percentage": percentage,
        "emoji": emoji,
    }


@app.post("/batch/")
async def batch_upload(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")

    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if not lines:
        return {"ok": False, "message": "Empty file"}

    header = lines[0].split(",")
    required_cols = {
        "Customer_ID": None,
        "Age": None,
        "Annual_Income": None,
        "Loan_Amount": None,
        "Credit_Score": None,
        "Debt_to_Income_Ratio": None,
        "Existing_Loans_Count": None
    }

    # map headers
    for key in required_cols:
        if key not in header:
            return {"ok": False, "message": f"Missing column: {key}"}
        required_cols[key] = header.index(key)

    results = []

    for line in lines[1:]:
        parts = [p.strip() for p in line.split(",")]

        try:
            name = parts[required_cols["Customer_ID"]]
            age = int(parts[required_cols["Age"]])
            income = float(parts[required_cols["Annual_Income"]])
            loan_amount = float(parts[required_cols["Loan_Amount"]])
            credit_score = float(parts[required_cols["Credit_Score"]])
            dti = float(parts[required_cols["Debt_to_Income_Ratio"]])
            existing = int(parts[required_cols["Existing_Loans_Count"]])
        except:
            continue  # skip bad row

        # ---------- apply same heuristic as single prediction ----------
        prob = 0.5

        ratio = loan_amount / (income + 1)
        if ratio > 2:
            prob += 0.25
        elif ratio > 1.5:
            prob += 0.15
        elif ratio < 0.8:
            prob -= 0.12

        if credit_score < 600:
            prob += 0.25
        elif credit_score > 750:
            prob -= 0.2

        if dti > 50:
            prob += 0.18
        elif dti < 25:
            prob -= 0.1

        if existing >= 3:
            prob += 0.12

        prob = max(0.02, min(0.98, prob + random.uniform(-0.02, 0.02)))
        percentage = round(prob * 100, 2)

        if prob > 0.7:
            prediction = "High Risk"
            emoji = "❌"
        elif prob > 0.4:
            prediction = "Moderate Risk"
            emoji = "❗"
        else:
            prediction = "Low Risk"
            emoji = "☑️"

        results.append({
            "name": name,
            "prediction": prediction,
            "percentage": percentage,
            "emoji": emoji
        })

    return {
        "ok": True,
        "count": len(results),
        "results": results
    }
