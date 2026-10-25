import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/routehire_python_db")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client.get_database()
    print(f"[Python MongoDB] Connected to: {db.name}")
except Exception as e:
    print(f"[Python MongoDB Notice] Connection warning: {e}")
    client = None
    db = None

def get_db():
    return db
