from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .utils import load_model, score_instance
from .recommend import map_recommendation
from .database import get_db
from .models import Prediction
from .auth import get_current_user
from datetime import datetime
import json
from .schemas import PredictSingle, PredictBatch

router = APIRouter(prefix="/predict", tags=["Prediction"])

def predict_single_logic(input_data: dict, user, db: Session):
    model = load_model()
    prob = score_instance(model, input_data)
    recommendation, risk = map_recommendation(prob, db)
    pred = Prediction(
        user_id=user.id,
        timestamp=datetime.utcnow(),
        input_data=json.dumps(input_data),
        probability=prob,
        risk_level=risk,
        recommendation=recommendation
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    return {"probability": prob, "risk_level": risk, "recommendation": recommendation}

def predict_batch_logic(borrowers: list, user, db: Session):
    model = load_model()
    results = []
    probs = []
    for b in borrowers:
        prob = score_instance(model, b)
        probs.append(prob)
    for i, b in enumerate(borrowers):
        prob = probs[i]
        recommendation, risk = map_recommendation(prob, db)
        pred = Prediction(
            user_id=user.id,
            timestamp=datetime.utcnow(),
            input_data=json.dumps(b),
            probability=prob,
            risk_level=risk,
            recommendation=recommendation
        )
        db.add(pred)
        results.append({"input": b, "probability": prob, "risk_level": risk, "recommendation": recommendation})
    db.commit()
    summary = {"count": len(probs), "average_probability": sum(probs)/len(probs) if probs else 0, "max": max(probs) if probs else None, "min": min(probs) if probs else None}
    return {"results": results, "summary": summary}

def get_logs_logic(user, db: Session):
    qs = db.query(Prediction).filter(Prediction.user_id == user.id).order_by(Prediction.timestamp.desc()).all()
    out = []
    for p in qs:
        out.append({"id": p.id, "timestamp": p.timestamp.isoformat(), "input_data": p.input_data, "probability": p.probability, "risk_level": p.risk_level, "recommendation": p.recommendation})
    return out

@router.post("/single")
def predict_single_endpoint(body: PredictSingle, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return predict_single_logic(body.input_data, user, db)

@router.post("/batch")
def predict_batch_endpoint(body: PredictBatch, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return predict_batch_logic(body.borrowers, user, db)

@router.get("/logs")
def get_logs_endpoint(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return get_logs_logic(user, db)
