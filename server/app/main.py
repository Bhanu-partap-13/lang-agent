from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import users, lessons
from app.core.database import Base, engine

# Make sure tables exist (using SQLAlchemy create_all)
# In production, use Alembic, but for this clone we connect to the SQLite DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agentic AI - Duolingo Clone API", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(users.router, prefix="/api/v1")
app.include_router(lessons.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Duolingo Clone API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}