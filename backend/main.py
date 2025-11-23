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

# Ensure users.json exists and is a valid JSON array
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
    allow_origins=["*"],  # during dev; restrict for production
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


def explain_reason_and_action(prob, ratio, credit_score, debt_ratio, existing_loans, age):
    


    if ratio > 2:
        reason = "High loan-to-income ratio."
        action = "Verify repayment capacity."
    elif credit_score < 600:
        reason = "Low credit score."
        action = "Collect more financial proof."
    elif debt_ratio > 50:
        reason = "High debt-to-income ratio."
        action = "Suggest debt restructuring."
    elif existing_loans >= 3:
        reason = "Too many existing loans."
        action = "Check active loan history."
    elif ratio < 0.8:
        reason = "Healthy loan-to-income ratio."
        action = "Proceed normally."
    elif credit_score > 750:
        reason = "Strong credit score."
        action = "Eligible for better terms."
    else:
        reason = "Average borrower profile."
        action = "Monitor repayment regularly."

    
    if age < 21:
        reason = "Young borrower."
        action = "Verify stable income."
    elif age > 60:
        reason = "High-age borrower."
        action = "Check retirement income."

    return reason, action


@app.post("/predict/")
def predict(data: PredictRequest):

    # --- heuristic scoring ---
    prob = 0.5
    reasons = []      # <-- collect reasons
    actions = []      # <-- collect actions

    # Loan-to-income ratio
    ratio = data.loan_amount / (data.income + 1)
    if ratio > 2:
        prob += 0.25
        reasons.append("Very high loan amount compared to income.")
        actions.append("Reduce loan amount or increase income proof.")
    elif ratio > 1.5:
        prob += 0.15
        reasons.append("High loan burden compared to income.")
        actions.append("Provide additional income documents.")
    elif ratio < 0.8:
        prob -= 0.12
        reasons.append("Healthy loan-to-income ratio.")

    # Credit score
    if data.credit_score < 600:
        prob += 0.25
        reasons.append("Low credit score.")
        actions.append("Improve credit score before approval.")
    elif data.credit_score < 700:
        prob += 0.10
        reasons.append("Average credit score.")
        actions.append("Request recent credit report.")
    elif data.credit_score > 750:
        prob -= 0.20
        reasons.append("Strong credit score.")

    # DTI ratio
    if data.debt_to_income_ratio > 50:
        prob += 0.18
        reasons.append("High debt-to-income ratio.")
        actions.append("Reduce monthly liabilities.")
    elif data.debt_to_income_ratio > 35:
        prob += 0.10
        reasons.append("Moderate debt-to-income ratio.")
    elif data.debt_to_income_ratio < 25:
        prob -= 0.10
        reasons.append("Low debt burden.")

    # Existing loans
    if data.existing_loans >= 4:
        prob += 0.18
        reasons.append("Too many existing loans.")
        actions.append("Close at least one existing loan.")
    elif data.existing_loans == 3:
        prob += 0.10
        reasons.append("Multiple active loans.")
    elif data.existing_loans == 0:
        prob -= 0.05
        reasons.append("No existing loan burden.")

    # Age factor
    if data.age < 21:
        prob += 0.10
        reasons.append("Very young borrower with limited history.")
        actions.append("Request guarantor.")
    elif data.age > 55:
        prob += 0.05
        reasons.append("Older age range.")
    else:
        reasons.append("Stable age range.")

    # finalize probability
    prob = max(0.02, min(0.98, prob + random.uniform(-0.02, 0.02)))
    percentage = round(prob * 100, 2)

    # assign risk
    if prob > 0.7:
        prediction = "High Risk"
        emoji = "❌"
        final_action = "Call borrower immediately and request updated financial documents."
    elif prob > 0.4:
        prediction = "Moderate Risk"
        emoji = "❗"
        final_action = "Review borrower documents and verify income stability."
    else:
        prediction = "Low Risk"
        emoji = "☑️"
        final_action = "Proceed with approval after standard checks."

    # Prefer the strongest reason
    main_reason = reasons[0] if reasons else "No major issues."

    # If a specific action was triggered, use it
    if actions:
        recommended_action = actions[0]
    else:
        recommended_action = final_action

    return {
        "name": data.name,
        "prediction": prediction,
        "percentage": percentage,
        "emoji": emoji,
        "reason": main_reason,
        "action": recommended_action
    }


@app.post("/batch/")
async def batch_upload(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")

    lines = [l for l in text.strip().splitlines() if l.strip()]
    if len(lines) <= 1:
        return {"ok": False, "message": "CSV seems empty or invalid."}

    results = []

    # Skip header → process rows
    for i, line in enumerate(lines[1:], start=1):
        parts = [p.strip() for p in line.split(",")]

        # If CSV has at least 3 columns, treat 1st as name
        name = parts[0] if len(parts) > 0 else f"Row {i}"

        # Generate simulated probability
        prob = round(random.uniform(0.05, 0.95), 2)
        percent = round(prob * 100, 2)

        # Determine risk
        if prob > 0.7:
            prediction = "High Risk"
            emoji = "❌"
            reason = "High-risk borrower."
            action = "Verify repayment capacity."
        elif prob > 0.4:
            prediction = "Moderate Risk"
            emoji = "⚠️"
            reason = "Medium borrower stability."
            action = "Request additional documents."
        else:
            prediction = "Low Risk"
            emoji = "☑️"
            reason = "Stable borrower profile."
            action = "Proceed with approval."

        results.append({
            "row": i,
            "name": name,
            "prediction": prediction,
            "percentage": percent,
            "reason": reason,
            "action": action,
            "emoji": emoji
        })

    return {"ok": True, "count": len(results), "results": results}


    
