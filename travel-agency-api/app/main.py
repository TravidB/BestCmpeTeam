import hashlib
import secrets

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import Base, engine
import app.models  # Triggers model registration so Base knows all tables

from app.api.v1.router import api_router

app = FastAPI(title="Travel Agency API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_EMAIL = "admin@travelease.com"
ADMIN_PASSWORD = "Admin@2026!"


def _hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return f"{salt}:{key.hex()}"


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    # Add new columns to existing DBs without breaking fresh installs
    with engine.connect() as conn:
        for sql in [
            "ALTER TABLE users ADD COLUMN Password_Hash TEXT",
            "ALTER TABLE users ADD COLUMN Is_Admin BOOLEAN NOT NULL DEFAULT 0",
        ]:
            try:
                conn.execute(text(sql))
                conn.commit()
            except Exception:
                pass  # Column already exists

        # Create lookup tables used by booking validation (not managed by ORM)
        for create_sql in [
            """CREATE TABLE IF NOT EXISTS Airline_Master (
                Airline_Code TEXT PRIMARY KEY,
                Airline_Name TEXT
            )""",
            """CREATE TABLE IF NOT EXISTS Airport_Master (
                Airport_Code TEXT PRIMARY KEY,
                Airport_Name TEXT,
                City TEXT,
                Country TEXT
            )""",
            """CREATE TABLE IF NOT EXISTS Hotel_Master (
                Hotel_Code INTEGER PRIMARY KEY,
                Hotel_Name TEXT,
                City TEXT,
                Country TEXT
            )""",
        ]:
            conn.execute(text(create_sql))
        conn.commit()

        # Seed default admin if none exists
        result = conn.execute(
            text("SELECT COUNT(*) FROM users WHERE Is_Admin = 1")
        ).scalar()
        if result == 0:
            conn.execute(
                text(
                    "INSERT INTO users (First_Name, Last_Name, Email, Phone_Number, Password_Hash, Is_Admin) "
                    "VALUES (:fn, :ln, :email, :phone, :pw, 1)"
                ),
                {
                    "fn": "Admin",
                    "ln": "User",
                    "email": ADMIN_EMAIL,
                    "phone": "",
                    "pw": _hash_password(ADMIN_PASSWORD),
                },
            )
            conn.commit()
            print(f"[startup] Admin user created → {ADMIN_EMAIL} / {ADMIN_PASSWORD}")


app.include_router(api_router, prefix="/api/v1")

