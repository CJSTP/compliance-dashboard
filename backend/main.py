from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import Base, engine, SessionLocal
from app.routes import compliance, positions, audit
from app.routes import mtl, remedial, bsa

# Create tables
Base.metadata.create_all(bind=engine)


def seed_if_empty():
    """Seed the database with sample data if it's empty."""
    from app.models import Jurisdiction
    db = SessionLocal()
    try:
        if db.query(Jurisdiction).count() == 0:
            from init_db import init_db
            db.close()
            init_db()
        else:
            db.close()
    except Exception:
        db.close()

# Initialize FastAPI app
app = FastAPI(
    title="Regulatory Compliance Dashboard API",
    description="API for tracking crypto exchange regulatory compliance",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

seed_if_empty()

# Include routers
app.include_router(compliance.router)
app.include_router(positions.router)
app.include_router(audit.router)
app.include_router(mtl.router)
app.include_router(remedial.router)
app.include_router(bsa.router)


@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Regulatory Compliance Dashboard API",
        "version": "1.0.0",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
