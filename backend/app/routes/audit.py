from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import AuditLogCreate, AuditLogResponse
from app.models import AuditLog

router = APIRouter(prefix="/api/audit", tags=["Audit"])


@router.post("/logs", response_model=AuditLogResponse)
def create_audit_log(
    data: AuditLogCreate,
    db: Session = Depends(get_db)
):
    """Create an audit log entry"""
    db_log = AuditLog(**data.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@router.get("/logs", response_model=List[AuditLogResponse])
def list_audit_logs(
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """List audit logs"""
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()


@router.get("/logs/entity/{entity_type}/{entity_id}", response_model=List[AuditLogResponse])
def get_entity_audit_logs(
    entity_type: str,
    entity_id: int,
    db: Session = Depends(get_db)
):
    """Get audit logs for a specific entity"""
    return db.query(AuditLog).filter(
        AuditLog.entity_type == entity_type,
        AuditLog.entity_id == entity_id
    ).order_by(AuditLog.timestamp.desc()).all()
