from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import (
    ComplianceAreaCreate,
    ComplianceAreaUpdate,
    ComplianceAreaResponse,
    RiskAssessmentCreate,
    RiskAssessmentResponse,
)
from app.services import ComplianceService

router = APIRouter(prefix="/api/compliance", tags=["Compliance"])


@router.post("/areas", response_model=ComplianceAreaResponse)
def create_compliance_area(
    data: ComplianceAreaCreate,
    db: Session = Depends(get_db)
):
    """Create a new compliance area"""
    return ComplianceService.create_compliance_area(db, data)


@router.get("/areas", response_model=List[ComplianceAreaResponse])
def list_compliance_areas(
    status: str = None,
    db: Session = Depends(get_db)
):
    """List all compliance areas"""
    return ComplianceService.get_compliance_areas(db, status)


@router.get("/areas/{area_id}", response_model=ComplianceAreaResponse)
def get_compliance_area(
    area_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific compliance area"""
    area = ComplianceService.get_compliance_area(db, area_id)
    if not area:
        raise HTTPException(status_code=404, detail="Compliance area not found")
    return area


@router.put("/areas/{area_id}", response_model=ComplianceAreaResponse)
def update_compliance_area(
    area_id: int,
    data: ComplianceAreaUpdate,
    db: Session = Depends(get_db)
):
    """Update a compliance area"""
    area = ComplianceService.update_compliance_area(db, area_id, data)
    if not area:
        raise HTTPException(status_code=404, detail="Compliance area not found")
    return area


@router.get("/areas/overdue-reviews", response_model=List[ComplianceAreaResponse])
def get_overdue_reviews(db: Session = Depends(get_db)):
    """Get compliance areas with overdue reviews"""
    return ComplianceService.get_overdue_reviews(db)


@router.post("/risk-assessments", response_model=RiskAssessmentResponse)
def create_risk_assessment(
    data: RiskAssessmentCreate,
    db: Session = Depends(get_db)
):
    """Create a new risk assessment"""
    return ComplianceService.create_risk_assessment(db, data)


@router.get("/risk-assessments/area/{area_id}", response_model=List[RiskAssessmentResponse])
def get_risk_assessments_by_area(
    area_id: int,
    db: Session = Depends(get_db)
):
    """Get risk assessments for a specific compliance area"""
    return ComplianceService.get_risk_assessments_by_area(db, area_id)


@router.get("/risk-assessments/high-risk", response_model=List[RiskAssessmentResponse])
def get_high_risk_items(db: Session = Depends(get_db)):
    """Get all high-risk assessment items"""
    return ComplianceService.get_high_risk_items(db)
