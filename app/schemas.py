from pydantic import BaseModel, EmailStr
from typing import Optional

# --- User Schemas ---
class UserCreate(BaseModel):
    fullname: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    fullname: str
    email: EmailStr
    class Config:
        from_attributes = True

# --- LoanRequest Schema ---
class LoanRequest(BaseModel):
    loan_amnt: Optional[float] = None
    term: Optional[str] = "36 months"
    int_rate: Optional[float] = None
    installment: Optional[float] = None
    emp_length: Optional[str] = "10+ years"
    home_ownership: Optional[str] = "RENT"
    annual_inc: Optional[float] = None
    verification_status: Optional[str] = "Not Verified"
    purpose: Optional[str] = "debt_consolidation"
    dti: Optional[float] = None
    delinq_2yrs: Optional[float] = 0.0
    earliest_cr_line: Optional[str] = "Jan-01"
    inq_last_6mths: Optional[float] = 0.0
    open_acc: Optional[float] = None
    pub_rec: Optional[float] = 0.0
    revol_bal: Optional[float] = None
    revol_util: Optional[str] = "0%"
    total_acc: Optional[float] = None