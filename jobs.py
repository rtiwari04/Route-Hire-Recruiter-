from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from database import get_db
from models.user import JobCreate

from services.email_service import send_application_confirmation_email

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.get("/")
def get_jobs(query: Optional[str] = None, location: Optional[str] = None, minExp: Optional[int] = None):
    db = get_db()
    if db is not None:
        filter_query = {}
        if location:
            filter_query["location"] = {"$regex": location, "$options": "i"}
        if minExp:
            filter_query["minExperience"] = {"$lte": minExp}

        jobs = list(db.jobs.find(filter_query))
        for j in jobs:
            j["_id"] = str(j["_id"])

        if query:
            q = query.lower()
            jobs = [j for j in jobs if q in j["title"].lower() or q in j["operatorName"].lower()]

        return {"success": True, "count": len(jobs), "jobs": jobs}

    # Demo Fallback Jobs
    return {
        "success": True,
        "count": 2,
        "jobs": [
            {
                "id": "job-101",
                "title": "Professional Bus Driver",
                "operatorName": "Laxmi Holidays Travels",
                "location": "Nagpur, Maharashtra",
                "routes": ["Nagpur → Mumbai", "Nagpur → Pune", "Nagpur → Hyderabad"],
                "salaryMin": 30000,
                "salaryMax": 35000,
                "salaryFormatted": "₹30,000 – ₹35,000 / Month",
                "minExperience": 3,
                "vacancies": 10,
                "joining": "Immediate"
            }
        ]
    }

@router.get("/{job_id}")
def get_job_by_id(job_id: str):
    db = get_db()
    if db is not None:
        job = db.jobs.find_one({"_id": job_id}) or db.jobs.find_one({"id": job_id})
        if job:
            job["_id"] = str(job["_id"])
            return {"success": True, "job": job}

    return {
        "success": True,
        "job": {
            "id": job_id,
            "title": "Professional Bus Driver",
            "operatorName": "Laxmi Holidays Travels",
            "location": "Nagpur, Maharashtra",
            "routes": ["Nagpur → Mumbai"],
            "salaryFormatted": "₹30,000 – ₹35,000 / Month",
            "minExperience": 3,
            "vacancies": 10
        }
    }

@router.post("/")
def create_job(data: JobCreate):
    db = get_db()
    job_doc = {
        "title": data.title,
        "operatorName": "Laxmi Holidays Travels",
        "location": data.location,
        "routes": data.routes,
        "salaryMin": data.salaryMin,
        "salaryMax": data.salaryMax,
        "salaryFormatted": f"₹{data.salaryMin:,} – ₹{data.salaryMax:,} / Month",
        "minExperience": data.minExperience,
        "vacancies": data.vacancies,
        "description": data.description
    }

    if db is not None:
        res = db.jobs.insert_one(job_doc)
        job_doc["_id"] = str(res.inserted_id)

    return {"success": True, "message": "Job created successfully", "job": job_doc}

@router.post("/{job_id}/apply")
def apply_job(job_id: str):
    db = get_db()
    if db is not None:
        app_doc = {
            "driverName": "Rajesh Kumar",
            "job_id": job_id,
            "jobTitle": "Professional Bus Driver",
            "operatorName": "Laxmi Holidays Travels",
            "route": "Nagpur → Mumbai",
            "status": "APPLIED"
        }
        db.applications.insert_one(app_doc)

    # Trigger Python Email Confirmation
    send_application_confirmation_email("Rajesh Kumar", "driver@demo.com", "Professional Bus Driver", "Laxmi Holidays Travels", "Nagpur, Maharashtra")

    return {"success": True, "message": "Application submitted & email confirmation dispatched"}
