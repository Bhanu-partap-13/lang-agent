from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

import os

# Create engine
db_url = settings.DATABASE_URL
auth_token = os.getenv("TURSO_AUTH_TOKEN")

# Automatically inject the auth token into the libsql URL if provided
if db_url.startswith("sqlite+libsql://") and auth_token and "authToken=" not in db_url:
    separator = "&" if "?" in db_url else "/?"
    db_url = f"{db_url}{separator}authToken={auth_token}&secure=true"

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    db_url, 
    connect_args=connect_args
)

# Session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
