import numpy as np
from .models import Prediction

def compute_thresholds(db):
    probs = [p.probability for p in db.query(Prediction).all()]
    if not probs or len(probs) < 5:
        return 0.4, 0.75
    return float(np.percentile(probs, 40)), float(np.percentile(probs, 75))

def map_recommendation(prob, db):
    p40, p75 = compute_thresholds(db)
    if prob < p40:
        return "Standard Reminder", "Low"
    elif prob < p75:
        return "Personalized Call / Email", "Medium"
    else:
        return "Priority Collection / Restructure", "High"
