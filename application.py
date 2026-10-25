from fastapi import APIRouter, HTTPException
from database import get_db
from models.user import ApplicationStatusUpdate
from services.email_service import send_shortlisted_email, send_rejection_email, send_selected_email

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.get("/my")
def get_my_applications():
    db = get_db()
    if db is not None:
        apps = list(db.applications.find())
        for a in apps:
            a["_id"] = str(a["_id"])
        return {"success": True, "count": len(apps), "applications": apps}

    return {
        "success": True,
        "count": 1,
        "applications": [
            {
                "id": "app-101",
                "jobTitle": "Professional Bus Driver",
                "operatorName": "Laxmi Holidays Travels",
                "route": "Nagpur → Mumbai",
                "appliedDate": "2026-09-14",
                "status": "SHORTLISTED",
                "matchScore": 96
            }
        ]
    }

@router.get("/operator")
def get_operator_applications():
    return get_my_applications()

@router.put("/{app_id}/status")
def update_application_status(app_id: str, data: ApplicationStatusUpdate):
    db = get_db()
    if db is not None:
        db.applications.update_one({"_id": app_id}, {"$set": {"status": data.status}})

    if data.status == "SHORTLISTED":
        send_shortlisted_email("Rajesh Kumar", "driver@demo.com", "Professional Bus Driver", "Laxmi Holidays Travels", "Nagpur → Mumbai", "₹30,000 - ₹35,000 / Month")
    elif data.status == "SELECTED":
        send_selected_email("Rajesh Kumar", "driver@demo.com", "Professional Bus Driver", "Laxmi Holidays Travels")
    elif data.status == "REJECTED":
        send_rejection_email("Rajesh Kumar", "driver@demo.com", data.reason or "Criteria mismatch")

    return {"success": True, "message": f"Application status updated to {data.status}"}
