import os, joblib, numpy as np

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "model.pkl")
_model = None

def load_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model

def score_instance(model, data: dict):
    arr = [
        data.get("income", 0),
        data.get("loan_amount", 0),
        data.get("interest_rate", 0),
        data.get("credit_score", 0),
        1 if str(data.get("employment_type","")).lower().startswith("s") else 0,
        data.get("employment_years", 0),
        data.get("age", 0),
        data.get("existing_loans", 0)
    ]
    X = np.array(arr, dtype=float).reshape(1, -1)
    if hasattr(model, "predict_proba"):
        return float(model.predict_proba(X)[0][1])
    if hasattr(model, "predict"):
        return float(model.predict(X)[0])
    return float(np.random.rand())
