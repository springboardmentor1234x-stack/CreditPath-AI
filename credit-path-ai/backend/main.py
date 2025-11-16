from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import List, Optional, Dict
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
import logging
import os
from logging.handlers import RotatingFileHandler
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from auth import (
    Base, engine, get_db, 
    User, PredictionLog,
    UserRegister, UserLogin, Token,
    get_password_hash, verify_password, create_access_token, get_current_user
)
from sqlalchemy.orm import Session

# LOGGING CONFIGURATION

def setup_logging():
    """Configure logging for the application"""
    log_dir = "../logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    log_file = os.path.join(log_dir, "predictions.log")
    
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_format = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(console_format)
    
    file_handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5)
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(console_format)
    
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger

logger = setup_logging()

# PYDANTIC MODELS

class LoanApplication(BaseModel):
    """Pydantic model for loan application input validation"""
    
    # Numeric features
    loan_amount: float = Field(..., gt=0, description="Loan amount in dollars")
    term: float = Field(..., gt=0, le=600, description="Loan term in months")
    property_value: float = Field(..., gt=0, description="Property value in dollars")
    income: float = Field(..., ge=0, description="Annual income in dollars")
    credit_score: int = Field(..., ge=300, le=900, description="Credit score")
    ltv: float = Field(..., ge=0, le=150, description="Loan-to-value ratio")
    dtir1: float = Field(..., ge=0, le=100, description="Debt-to-income ratio")
    
    # Categorical features
    gender: str
    loan_type: str
    loan_purpose: str
    credit_worthiness: str
    open_credit: str
    business_or_commercial: str
    neg_ammortization: str
    interest_only: str
    lump_sum_payment: str
    construction_type: str
    occupancy_type: str
    total_units: str
    credit_type: str
    co_applicant_credit_type: str = Field(..., alias="co-applicant_credit_type")
    age: str
    region: str
    
    # Engineered features (optional)
    dsbr: Optional[float] = None
    loan_to_income: Optional[float] = None
    csri: Optional[float] = None
    ltv_stress: Optional[float] = None
    property_loan_ratio: Optional[float] = None
    
    @field_validator('credit_score')
    @classmethod
    def validate_credit_score(cls, v):
        if v < 300 or v > 900:
            raise ValueError('Credit score must be between 300 and 900')
        return v
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "loan_amount": 200000,
                "term": 360,
                "property_value": 450000,
                "income": 120000,
                "credit_score": 780,
                "ltv": 45,
                "dtir1": 28,
                "gender": "Male",
                "loan_type": "type1",
                "loan_purpose": "p1",
                "credit_worthiness": "l1",
                "open_credit": "nopc",
                "business_or_commercial": "nob/c",
                "neg_ammortization": "not_neg",
                "interest_only": "not_int",
                "lump_sum_payment": "not_lpsm",
                "construction_type": "sb",
                "occupancy_type": "pr",
                "total_units": "1U",
                "credit_type": "EXP",
                "co-applicant_credit_type": "CIB",
                "age": "35-44",
                "region": "south"
            }
        }
    )

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    borrower_id: Optional[str] = None
    default_probability: float
    risk_band: str
    recommendation: str
    confidence: str
    timestamp: str
    model_version: str
    
    model_config = ConfigDict(
        protected_namespaces=()  # Fix for model_version warning
    )

class BatchPredictionResponse(BaseModel):
    """Response model for batch predictions"""
    predictions: List[PredictionResponse]
    summary: Dict
    total_records: int

# ============================================================================
# PREDICTION CLASS
# ============================================================================

class LoanDefaultPredictor:
    """Handles loan default predictions"""
    
    def __init__(self, model_package_path: str = None):
        """Initialize predictor with model package"""
        
        # Auto-detect model path
        if model_package_path is None:
            possible_paths = [
                "../models/credit_path_ai_model_package.pkl",
                "models/credit_path_ai_model_package.pkl",
                "./models/credit_path_ai_model_package.pkl",
                os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "credit_path_ai_model_package.pkl")
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    model_package_path = path
                    logger.info(f"Model found at: {path}")
                    break
            
            if model_package_path is None:
                raise FileNotFoundError(
                    "Model package not found! Please ensure 'credit_path_ai_model_package.pkl' "
                    "is in the models/ folder."
                )
        
        try:
            with open(model_package_path, "rb") as f:
                self.package = pickle.load(f)
            
            self.model = self.package['model']
            self.preprocessor = self.package['preprocessor']
            self.thresholds = self.package['thresholds']
            self.metadata = self.package['metadata']
            self.numeric_cols = self.package['numeric_columns']
            self.categorical_cols = self.package['categorical_columns']
            
            logger.info("Model package loaded successfully")
            logger.info(f"Model version: {self.metadata['model_info']['version']}")
            
        except Exception as e:
            logger.error(f"Failed to load model package: {str(e)}")
            raise
    
    def _calculate_engineered_features(self, loan_data: Dict) -> Dict:
        """Calculate engineered features if not provided"""
        
        if 'dsbr' not in loan_data or loan_data['dsbr'] is None:
            try:
                monthly_payment = loan_data['loan_amount'] / loan_data['term']
                monthly_income = loan_data['income'] / 12
                loan_data['dsbr'] = monthly_payment / monthly_income if monthly_income > 0 else 0
            except:
                loan_data['dsbr'] = 0
        
        if 'loan_to_income' not in loan_data or loan_data['loan_to_income'] is None:
            try:
                loan_data['loan_to_income'] = loan_data['loan_amount'] / loan_data['income'] if loan_data['income'] > 0 else 0
            except:
                loan_data['loan_to_income'] = 0
        
        if 'csri' not in loan_data or loan_data['csri'] is None:
            try:
                loan_data['csri'] = 1 / loan_data['credit_score'] if loan_data['credit_score'] > 0 else 0
            except:
                loan_data['csri'] = 0
        
        if 'ltv_stress' not in loan_data or loan_data['ltv_stress'] is None:
            try:
                loan_data['ltv_stress'] = loan_data['ltv'] / 100
            except:
                loan_data['ltv_stress'] = 0
        
        if 'property_loan_ratio' not in loan_data or loan_data['property_loan_ratio'] is None:
            try:
                loan_data['property_loan_ratio'] = loan_data['property_value'] / loan_data['loan_amount'] if loan_data['loan_amount'] > 0 else 0
            except:
                loan_data['property_loan_ratio'] = 0
        
        return loan_data
    
    def predict_single(self, loan_data: Dict, borrower_id: str = None) -> Dict:
        """Predict for a single loan application"""
        
        try:
            loan_data = self._calculate_engineered_features(loan_data)
            loan_df = pd.DataFrame([loan_data])
            
            for col in self.numeric_cols + self.categorical_cols:
                if col not in loan_df.columns:
                    loan_df[col] = 0
            
            loan_df = loan_df[self.numeric_cols + self.categorical_cols]
            X_processed = self.preprocessor.transform(loan_df)
            probability = float(self.model.predict_proba(X_processed)[0, 1])
            
            t_low = self.thresholds['low_threshold']
            t_high = self.thresholds['high_threshold']
            
            if probability <= t_low:
                risk_band = "Low"
                recommendation = "Approve - Standard processing"
            elif probability <= t_high:
                risk_band = "Medium"
                recommendation = "Review - Enhanced verification required"
            else:
                risk_band = "High"
                recommendation = "Caution - Detailed manual review or reject"
            
            confidence = "High" if (probability <= 0.3 or probability >= 0.7) else "Medium"
            
            result = {
                'borrower_id': borrower_id,
                'default_probability': round(probability, 4),
                'risk_band': risk_band,
                'recommendation': recommendation,
                'confidence': confidence,
                'timestamp': datetime.now().isoformat(),
                'model_version': self.metadata['model_info']['version']
            }
            
            logger.info(f"Prediction successful - Risk: {risk_band}, Probability: {probability:.4f}")
            return result
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise
    
    def predict_batch(self, loans_data: List[Dict]) -> Dict:
        """Predict for multiple loan applications"""
        
        try:
            predictions = []
            
            for idx, loan_data in enumerate(loans_data):
                borrower_id = loan_data.get('borrower_id', f'borrower_{idx+1}')
                prediction = self.predict_single(loan_data, borrower_id)
                predictions.append(prediction)
            
            probabilities = [p['default_probability'] for p in predictions]
            risk_bands = [p['risk_band'] for p in predictions]
            
            summary = {
                'total_applications': len(predictions),
                'average_probability': round(np.mean(probabilities), 4),
                'min_probability': round(np.min(probabilities), 4),
                'max_probability': round(np.max(probabilities), 4),
                'risk_distribution': {
                    'Low': risk_bands.count('Low'),
                    'Medium': risk_bands.count('Medium'),
                    'High': risk_bands.count('High')
                }
            }
            
            logger.info(f"Batch prediction successful - {len(predictions)} applications processed")
            
            return {
                'predictions': predictions,
                'summary': summary,
                'total_records': len(predictions)
            }
            
        except Exception as e:
            logger.error(f"Batch prediction failed: {str(e)}")
            raise

# ============================================================================
# FASTAPI APPLICATION
# ============================================================================

app = FastAPI(
    title="Credit Path AI - Loan Default Prediction API",
    description="API for predicting loan default probability and risk assessment",
    version="1.0.0"
)
# Create database tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
try:
    predictor = LoanDefaultPredictor()
    logger.info("Loan Default Predictor initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize predictor: {str(e)}")
    raise

@app.on_event("startup")
async def startup_event():
    logger.info("Credit Path AI API starting up...")
    logger.info(f"Model version: {predictor.metadata['model_info']['version']}")
    logger.info(f"Model ROC AUC: {predictor.metadata['performance_metrics']['test_roc_auc']:.4f}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Credit Path AI API shutting down...")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Credit Path AI - Loan Default Prediction API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "predict_batch": "/predict/batch",
            "model_info": "/model/info",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": predictor is not None,
        "model_version": predictor.metadata['model_info']['version']
    }

@app.get("/model/info")
async def model_info():
    """Get model information"""
    return {
        "model_info": predictor.metadata['model_info'],
        "performance_metrics": predictor.metadata['performance_metrics'],
        "risk_band_thresholds": predictor.metadata['risk_band_thresholds'],
        "risk_band_performance": predictor.metadata['risk_band_performance']
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_single(
    application: LoanApplication,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Predict default probability for a single loan application"""
    try:
        logger.info(f"Received prediction request for loan amount: ${application.loan_amount:,.2f}")
        
        loan_data = application.model_dump(by_alias=True)
        result = predictor.predict_single(loan_data)
        
        try:
            log_entry = PredictionLog(
                borrower_id=result.get('borrower_id'),
                loan_amount=application.loan_amount,
                credit_score=application.credit_score,
                default_probability=result['default_probability'],
                risk_band=result['risk_band'],
                recommendation=result['recommendation'],
                confidence=result['confidence'],
                model_version=result['model_version']
            )
            db.add(log_entry)
            db.commit()
        except Exception as db_error:
            logger.warning(f"Failed to log to database: {str(db_error)}")
        
        logger.info(f"Prediction completed - Risk: {result['risk_band']}, Probability: {result['default_probability']}")
        
        return result
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(
    applications: List[LoanApplication],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Predict default probability for multiple loan applications"""
    try:
        logger.info(f"Received batch prediction request for {len(applications)} applications")
        
        loans_data = [app.model_dump(by_alias=True) for app in applications]
        result = predictor.predict_batch(loans_data)
        
        logger.info(f"Batch prediction completed - {result['total_records']} applications processed")
        logger.info(f"Risk distribution: {result['summary']['risk_distribution']}")
        
        return result
        
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# AUTHENTICATION ENDPOINTS

@app.post("/register")
async def register(user: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"New user registered: {user.username}")
    return {"message": "User registered successfully", "username": user.username}

@app.post("/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    db_user = db.query(User).filter(User.username == user.username).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": db_user.username})
    
    logger.info(f"User logged in: {user.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=dict)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)