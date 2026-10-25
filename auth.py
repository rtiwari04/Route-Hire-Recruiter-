from fastapi import APIRouter, HTTPException, Depends, Header
from database import get_db
from models.user import UserRegisterDriver, UserRegisterOperator, UserLogin
from services.auth_service import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register/driver")
def register_driver(data: UserRegisterDriver):
    db = get_db()
    if db is not None:
        if db.users.find_one({"email": data.email}):
            raise HTTPException(status_code=400, detail="User with this email already exists")

        user_doc = {
            "name": data.name,
            "email": data.email,
            "phone": data.phone,
            "password": hash_password(data.password),
            "role": "driver",
            "status": "PENDING_VERIFICATION"
        }
        res = db.users.insert_one(user_doc)
        user_id = str(res.inserted_id)

        driver_doc = {
            "user_id": user_id,
            "name": data.name,
            "mobile": data.phone,
            "email": data.email,
            "city": data.city,
            "state": data.state,
            "licenceNumber": data.licenceNumber,
            "experience": data.totalExperience,
            "verificationStatus": "PENDING_VERIFICATION"
        }
        db.drivers.insert_one(driver_doc)

        token = create_access_token({"id": user_id, "role": "driver"})
        return {"success": True, "token": token, "user": {"name": data.name, "email": data.email, "role": "driver"}}

    return {"success": True, "message": "Driver registered (Demo Mode)"}

@router.post("/register/operator")
def register_operator(data: UserRegisterOperator):
    db = get_db()
    if db is not None:
        if db.users.find_one({"email": data.email}):
            raise HTTPException(status_code=400, detail="Operator email already registered")

        user_doc = {
            "name": data.companyName,
            "email": data.email,
            "phone": data.phone,
            "password": hash_password(data.password),
            "role": "operator",
            "status": "PENDING_VERIFICATION"
        }
        res = db.users.insert_one(user_doc)
        user_id = str(res.inserted_id)

        token = create_access_token({"id": user_id, "role": "operator"})
        return {"success": True, "token": token, "user": {"name": data.companyName, "email": data.email, "role": "operator"}}

    return {"success": True, "message": "Operator registered (Demo Mode)"}

@router.post("/login")
def login(credentials: UserLogin):
    db = get_db()
    if db is not None:
        user = db.users.find_one({"email": credentials.email})
        if not user or not verify_password(credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"id": str(user["_id"]), "role": user["role"]})
        return {
            "success": True,
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "status": user["status"]
            }
        }

    # Demo Fallback
    token = create_access_token({"id": "demo-id", "role": credentials.role})
    return {
        "success": True,
        "token": token,
        "user": {"name": "Demo User", "email": credentials.email, "role": credentials.role, "status": "VERIFIED"}
    }
