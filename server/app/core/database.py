from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
import os
# Build the final database URL
db_url = settings.DATABASE_URL
auth_token = settings.TURSO_AUTH_TOKEN

# Handle all the URL format variants cleanly:
# - "libsql://..."         → convert to "sqlite+libsql://..."
# - "sqlite+libsql://..."  → already correct, just inject token
# - "sqlite:///..."        → plain local SQLite, use as-is
if db_url.startswith("libsql://"):
    db_url = "sqlite+" + db_url

# Inject the auth token into the URL if using Turso and token is available
if db_url.startswith("sqlite+libsql://") and auth_token and "authToken=" not in db_url:
    separator = "&" if "?" in db_url else "/?"
    db_url = f"{db_url}{separator}authToken={auth_token}&secure=true"

print(f"DEBUG: Connecting to {db_url.split('authToken=')[0]} (authToken length: {len(auth_token) if auth_token else 0})")

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False},
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
