from sqlalchemy.orm import Session
from datetime import datetime
from app.models import PositionLimit, AuditLog
from app.models.compliance import ComplianceStatus, RiskLevel
from app.schemas import PositionLimitCreate, PositionLimitUpdate


class PositionLimitService:
    """Service for managing position limits"""
    
    @staticmethod
    def create_position_limit(db: Session, data: PositionLimitCreate) -> PositionLimit:
        """Create a new position limit"""
        db_limit = PositionLimit(
            asset_symbol=data.asset_symbol,
            jurisdiction_id=data.jurisdiction_id,
            max_position_usd=data.max_position_usd,
            limit_percentage=data.limit_percentage,
            warning_threshold=data.warning_threshold or 80.0,
            current_utilization=0.0,
            compliance_status=ComplianceStatus.COMPLIANT
        )
        db.add(db_limit)
        db.commit()
        db.refresh(db_limit)
        
        PositionLimitService._log_audit(
            db,
            action="CREATE",
            entity_type="position_limit",
            entity_id=db_limit.id,
            details=f"Created position limit for {data.asset_symbol}: ${data.max_position_usd:,.2f}"
        )
        
        return db_limit
    
    @staticmethod
    def update_position_limit(db: Session, limit_id: int, data: PositionLimitUpdate) -> PositionLimit:
        """Update a position limit"""
        db_limit = db.query(PositionLimit).filter(PositionLimit.id == limit_id).first()
        if not db_limit:
            return None
        
        update_data = data.dict(exclude_unset=True)
        
        # Update fields
        for key, value in update_data.items():
            setattr(db_limit, key, value)
        
        # Recalculate utilization if current position changed
        if 'current_position_usd' in update_data:
            db_limit.current_utilization = (db_limit.current_position_usd / db_limit.max_position_usd * 100) if db_limit.max_position_usd > 0 else 0.0
            
            # Update compliance status based on utilization
            if db_limit.current_utilization > 100:
                db_limit.compliance_status = ComplianceStatus.NON_COMPLIANT
            elif db_limit.current_utilization > db_limit.warning_threshold:
                db_limit.compliance_status = ComplianceStatus.UNDER_MONITORING
            else:
                db_limit.compliance_status = ComplianceStatus.COMPLIANT
        
        db_limit.last_checked = datetime.utcnow()
        db_limit.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_limit)
        
        PositionLimitService._log_audit(
            db,
            action="UPDATE",
            entity_type="position_limit",
            entity_id=limit_id,
            details=f"Updated position limit for {db_limit.asset_symbol}"
        )
        
        return db_limit
    
    @staticmethod
    def get_position_limits(db: Session, is_active: bool = None) -> list:
        """Get all position limits, optionally filtered"""
        query = db.query(PositionLimit)
        if is_active is not None:
            query = query.filter(PositionLimit.is_active == is_active)
        return query.all()
    
    @staticmethod
    def get_position_limit(db: Session, limit_id: int) -> PositionLimit:
        """Get a specific position limit"""
        return db.query(PositionLimit).filter(PositionLimit.id == limit_id).first()
    
    @staticmethod
    def get_position_limit_by_symbol(db: Session, symbol: str) -> PositionLimit:
        """Get position limit by asset symbol"""
        return db.query(PositionLimit).filter(PositionLimit.asset_symbol == symbol).first()
    
    @staticmethod
    def get_at_risk_positions(db: Session) -> list:
        """Get positions that are at or exceeding warning threshold"""
        return db.query(PositionLimit).filter(
            PositionLimit.current_utilization >= 80.0,
            PositionLimit.is_active == True
        ).all()
    
    @staticmethod
    def get_non_compliant_positions(db: Session) -> list:
        """Get non-compliant positions"""
        return db.query(PositionLimit).filter(
            PositionLimit.compliance_status == ComplianceStatus.NON_COMPLIANT
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
