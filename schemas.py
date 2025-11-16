from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

class PredictSingle(BaseModel):
    input_data: Dict[str, Any]

class PredictBatch(BaseModel):
    borrowers: List[Dict[str, Any]]
