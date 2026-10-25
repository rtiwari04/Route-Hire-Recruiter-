import os
import shutil
from uuid import uuid4
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from database import get_db

router = APIRouter(prefix="/api/documents", tags=["Documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".webp"}

@router.post("/upload")
async def upload_document(
    documentType: str = Form(...),
    file: UploadFile = File(...)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and Image files (JPG, PNG, WEBP) are allowed.")

    filename = f"{documentType}_{uuid4().hex[:8]}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save file on disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"/uploads/{filename}"

    db = get_db()
    doc_data = {
        "driverId": "drv-101",
        "documentType": documentType,
        "fileName": file.filename,
        "fileUrl": file_url,
        "status": "PENDING"
    }

    if db is not None:
        db.documents.update_one(
            {"driverId": "drv-101", "documentType": documentType},
            {"$set": doc_data},
            upsert=True
        )

    return {
        "success": True,
        "message": f"{documentType.upper()} uploaded successfully!",
        "document": doc_data
    }