from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# DATABASE CONFIGURATION

DATABASE_URL = "sqlite:///../logs/predictions.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# DATABASE MODELS

class User(Base):
    """Model for storing user accounts"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class PredictionLog(Base):
    """Model for storing prediction logs"""
    __tablename__ = "prediction_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    borrower_id = Column(String, index=True)
    loan_amount = Column(Float)
    credit_score = Column(Integer)
    default_probability = Column(Float)
    risk_band = Column(String)
    recommendation = Column(String)
    confidence = Column(String)
    model_version = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

# PYDANTIC SCHEMAS

class UserRegister(BaseModel):
    """Schema for user registration"""
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str

class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    """Schema for user data response"""
    id: int
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# AUTHENTICATION LOGIC

SECRET_KEY = "your-secret-key-change-this-in-production-make-it-long-and-random-123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password, hashed_password):
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hash a password for storing"""
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get the current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user