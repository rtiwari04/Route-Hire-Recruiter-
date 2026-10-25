import os
from pymongo import MongoClient
from dotenv import load_dotenv
from services.auth_service import hash_password

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/routehire_python_db")

# Ensure uploads folder exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create sample placeholder document files in uploads/
dummy_files = ["DL-MH312012.pdf", "Medical-Fitness.pdf", "Police-Verification.pdf"]
for fname in dummy_files:
    fpath = os.path.join(UPLOAD_DIR, fname)
    if not os.path.exists(fpath):
        with open(fpath, "w") as f:
            f.write(f"%PDF-1.4 RouteHire Document Placeholder: {fname}")

def seed_database():
    print("[Python Seed] Connecting to MongoDB...")
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()

        # Clear existing collections
        db.users.delete_many({})
        db.drivers.delete_many({})
        db.operators.delete_many({})
        db.jobs.delete_many({})
        db.applications.delete_many({})
        db.documents.delete_many({})

        print("[Python Seed] Cleared old collection data.")

        # 1. Create Admin User (admin@routehire.com / Admin@123)
        admin_id = db.users.insert_one({
            "name": "RouteHire Super Admin",
            "email": "admin@routehire.com",
            "phone": "+91 99999 00000",
            "password": hash_password("Admin@123"),
            "role": "admin",
            "status": "VERIFIED"
        }).inserted_id
        print("  ✓ Admin User created: admin@routehire.com / Admin@123")

        # 2. Create Driver User & Profile (Rajesh Kumar)
        driver_user_id = db.users.insert_one({
            "name": "Rajesh Kumar",
            "email": "driver@demo.com",
            "phone": "+91 98765 43210",
            "password": hash_password("driver123"),
            "role": "driver",
            "status": "VERIFIED"
        }).inserted_id

        db.drivers.insert_one({
            "id": "drv-101",
            "user_id": str(driver_user_id),
            "name": "Rajesh Kumar",
            "mobile": "+91 98765 43210",
            "email": "driver@demo.com",
            "city": "Nagpur",
            "state": "Maharashtra",
            "licenceNumber": "MH-31-2012-0088921",
            "experience": 8,
            "verificationStatus": "PENDING_VERIFICATION",
            "routes": [
                {"origin": "Nagpur", "destination": "Hyderabad", "experienceYears": 6, "trips": 450},
                {"origin": "Nagpur", "destination": "Mumbai", "experienceYears": 5, "trips": 320}
            ]
        })
        print("  ✓ Driver Rajesh Kumar created.")

        # Seed Driver Documents into db.documents
        db.documents.insert_many([
            {
                "driverId": "drv-101",
                "documentType": "licence",
                "fileName": "DL-MH312012.pdf",
                "fileUrl": "/uploads/DL-MH312012.pdf",
                "status": "PENDING"
            },
            {
                "driverId": "drv-101",
                "documentType": "medical",
                "fileName": "Medical-Fitness.pdf",
                "fileUrl": "/uploads/Medical-Fitness.pdf",
                "status": "PENDING"
            },
            {
                "driverId": "drv-101",
                "documentType": "police",
                "fileName": "Police-Verification.pdf",
                "fileUrl": "/uploads/Police-Verification.pdf",
                "status": "PENDING"
            }
        ])
        print("  ✓ Sample Driver Verification Documents seeded.")

        # 3. Create Operator User & Profile (Laxmi Holidays Travels)
        operator_user_id = db.users.insert_one({
            "name": "Laxmi Holidays Travels",
            "email": "operator@demo.com",
            "phone": "+91 99999 99999",
            "password": hash_password("operator123"),
            "role": "operator",
            "status": "VERIFIED"
        }).inserted_id

        db.operators.insert_one({
            "id": "op-101",
            "user_id": str(operator_user_id),
            "companyName": "Laxmi Holidays Travels",
            "contactPerson": "Vikram Malhotra",
            "city": "Nagpur",
            "state": "Maharashtra"
        })
        print("  ✓ Operator Laxmi Holidays Travels created.")

        # 4. Create Jobs
        job_id = db.jobs.insert_one({
            "id": "job-101",
            "title": "Professional Bus Driver",
            "operatorName": "Laxmi Holidays Travels",
            "operatorLogo": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=150&q=80",
            "verifiedOperator": True,
            "location": "Nagpur, Maharashtra",
            "routes": ["Nagpur → Mumbai", "Nagpur → Pune", "Nagpur → Hyderabad"],
            "salaryMin": 30000,
            "salaryMax": 35000,
            "salaryFormatted": "₹30,000 – ₹35,000 / Month",
            "minExperience": 3,
            "vacancies": 10,
            "joining": "Immediate",
            "description": "Long-distance Volvo & sleeper bus driver recruitment requirement."
        }).inserted_id

        # 5. Create Application
        db.applications.insert_one({
            "id": "app-101",
            "driverName": "Rajesh Kumar",
            "job_id": str(job_id),
            "jobTitle": "Professional Bus Driver",
            "operatorName": "Laxmi Holidays Travels",
            "route": "Nagpur → Mumbai",
            "appliedDate": "2026-09-14",
            "status": "SHORTLISTED",
            "matchScore": 96
        })
        print("  ✓ Recruitment Job & Application created.")

        print("[Python Seed] Database Seeding Completed Successfully! 🎉")

    except Exception as e:
        print(f"[Python Seed Error]: {e}")

if __name__ == "__main__":
    seed_database()