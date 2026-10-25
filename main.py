import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import auth, jobs, applications, admin, documents

app = FastAPI(
    title="RouteHire Python API",
    description="Full-Stack Driver Recruitment Platform Python Backend",
    version="1.0.0"
)

# Enable CORS for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Uploads Directory
upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Mount Routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(admin.router)
app.include_router(documents.router)

@app.get("/api/health")
def health_check():
    return {
        "success": True,
        "message": "RouteHire Python FastAPI Backend Running Smoothly 🚀",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
