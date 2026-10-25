from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRegisterDriver(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    city: str
    state: Optional[str] = "Maharashtra"
    licenceNumber: str
    totalExperience: Optional[int] = 1

class UserRegisterOperator(BaseModel):
    companyName: str
    contactPerson: str
    email: EmailStr
    phone: str
    password: str
    city: str
    state: Optional[str] = "Maharashtra"

class UserLogin(BaseModel):
    email: str
    password: str
    role: Optional[str] = "driver"

class JobCreate(BaseModel):
    title: str
    location: str
    routes: List[str]
    salaryMin: int
    salaryMax: int
    minExperience: Optional[int] = 2
    vacancies: Optional[int] = 5
    description: str

class ApplicationStatusUpdate(BaseModel):
    status: str
    reason: Optional[str] = ""

class DriverRejectRequest(BaseModel):
    reason: Optional[str] = "Documentation mismatch"
