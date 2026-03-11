from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, timedelta
from app.models import ComplianceArea, RiskAssessment, AuditLog
from app.models.compliance import ComplianceStatus, RiskLevel
from app.schemas import ComplianceAreaCreate, ComplianceAreaUpdate, RiskAssessmentCreate


class ComplianceService:
    """Service for managing compliance areas and assessments"""
    
    @staticmethod
    def create_compliance_area(db: Session, data: ComplianceAreaCreate) -> ComplianceArea:
        """Create a new compliance area"""
        db_area = ComplianceArea(
            name=data.name,
            description=data.description,
            jurisdiction_id=data.jurisdiction_id,
            responsible_team=data.responsible_team,
            status=ComplianceStatus.PENDING_REVIEW,
            next_review_date=datetime.utcnow() + timedelta(days=90)
        )
        db.add(db_area)
        db.commit()
        db.refresh(db_area)
        
        # Log the action
        ComplianceService._log_audit(
            db,
            action="CREATE",
            entity_type="compliance_area",
            entity_id=db_area.id,
            details=f"Created compliance area: {data.name}"
        )
        
        return db_area
    
    @staticmethod
    def update_compliance_area(db: Session, area_id: int, data: ComplianceAreaUpdate) -> ComplianceArea:
        """Update a compliance area"""
        db_area = db.query(ComplianceArea).filter(ComplianceArea.id == area_id).first()
        if not db_area:
            return None
        
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_area, key, value)
        
        db_area.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_area)
        
        ComplianceService._log_audit(
            db,
            action="UPDATE",
            entity_type="compliance_area",
            entity_id=area_id,
            details=f"Updated compliance area: {db_area.name}"
        )
        
        return db_area
    
    @staticmethod
    def get_compliance_areas(db: Session, status: str = None) -> list:
        """Get all compliance areas, optionally filtered by status"""
        query = db.query(ComplianceArea)
        if status:
            query = query.filter(ComplianceArea.status == status)
        return query.all()
    
    @staticmethod
    def get_compliance_area(db: Session, area_id: int) -> ComplianceArea:
        """Get a specific compliance area"""
        return db.query(ComplianceArea).filter(ComplianceArea.id == area_id).first()
    
    @staticmethod
    def get_overdue_reviews(db: Session) -> list:
        """Get compliance areas with overdue reviews"""
        now = datetime.utcnow()
        return db.query(ComplianceArea).filter(
            and_(
                ComplianceArea.next_review_date < now,
                ComplianceArea.status != ComplianceStatus.NON_COMPLIANT
            )
        ).all()
    
    @staticmethod
    def create_risk_assessment(db: Session, data: RiskAssessmentCreate) -> RiskAssessment:
        """Create a new risk assessment"""
        db_assessment = RiskAssessment(
            compliance_area_id=data.compliance_area_id,
            risk_level=data.risk_level,
            risk_description=data.risk_description,
            mitigation_strategy=data.mitigation_strategy,
            assessed_by=data.assessed_by,
            next_assessment_date=data.next_assessment_date or (datetime.utcnow() + timedelta(days=180))
        )
        db.add(db_assessment)
        db.commit()
        db.refresh(db_assessment)
        
        ComplianceService._log_audit(
            db,
            action="CREATE",
            entity_type="risk_assessment",
            entity_id=db_assessment.id,
            severity=data.risk_level,
            details=f"Created risk assessment with level: {data.risk_level}"
        )
        
        return db_assessment
    
    @staticmethod
    def get_risk_assessments_by_area(db: Session, area_id: int) -> list:
        """Get all risk assessments for a compliance area"""
        return db.query(RiskAssessment).filter(
            RiskAssessment.compliance_area_id == area_id
        ).all()
    
    @staticmethod
    def get_high_risk_items(db: Session) -> list:
        """Get all high-risk items"""
        return db.query(RiskAssessment).filter(
            or_(
                RiskAssessment.risk_level == RiskLevel.HIGH,
                RiskAssessment.risk_level == RiskLevel.CRITICAL
            )
        ).all()
    
    @staticmethod
    def _log_audit(db: Session, action: str, entity_type: str = None, entity_id: int = None, 
                   user: str = None, details: str = None, severity: str = RiskLevel.LOW):
        """Log an audit event"""
        audit_log = AuditLog(
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            user=user or "system",
            details=details,
            severity=severity,
            timestamp=datetime.utcnow()
        )
        db.add(audit_log)
        db.commit()
