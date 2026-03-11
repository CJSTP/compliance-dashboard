from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base


class RiskLevel(str, enum.Enum):
    """Risk levels for compliance"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ComplianceStatus(str, enum.Enum):
    """Compliance status"""
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    PENDING_REVIEW = "pending_review"
    UNDER_MONITORING = "under_monitoring"


class Jurisdiction(Base):
    """Regulatory jurisdictions"""
    __tablename__ = "jurisdictions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    code = Column(String(10), unique=True, nullable=False)
    region = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    compliance_areas = relationship("ComplianceArea", back_populates="jurisdiction")


class ComplianceArea(Base):
    """Compliance areas (e.g., KYC, AML, Asset Custody)"""
    __tablename__ = "compliance_areas"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    jurisdiction_id = Column(Integer, ForeignKey("jurisdictions.id"))
    status = Column(Enum(ComplianceStatus), default=ComplianceStatus.PENDING_REVIEW)
    last_review_date = Column(DateTime)
    next_review_date = Column(DateTime)
    responsible_team = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    jurisdiction = relationship("Jurisdiction", back_populates="compliance_areas")
    risk_assessments = relationship("RiskAssessment", back_populates="compliance_area")


class RiskAssessment(Base):
    """Risk assessments for compliance areas"""
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    compliance_area_id = Column(Integer, ForeignKey("compliance_areas.id"))
    risk_level = Column(Enum(RiskLevel), nullable=False)
    risk_description = Column(Text)
    mitigation_strategy = Column(Text)
    assessed_by = Column(String(255))
    assessed_date = Column(DateTime, default=datetime.utcnow)
    next_assessment_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    compliance_area = relationship("ComplianceArea", back_populates="risk_assessments")


class PositionLimit(Base):
    """Position limits and thresholds"""
    __tablename__ = "position_limits"
    
    id = Column(Integer, primary_key=True, index=True)
    asset_symbol = Column(String(50), nullable=False)
    jurisdiction_id = Column(Integer, ForeignKey("jurisdictions.id"))
    max_position_usd = Column(Float, nullable=False)
    current_position_usd = Column(Float, default=0.0)
    limit_percentage = Column(Float)  # As percentage of total assets
    warning_threshold = Column(Float)  # Percentage of max_position at which to warn
    current_utilization = Column(Float, default=0.0)  # Current % of limit used
    is_active = Column(Boolean, default=True)
    compliance_status = Column(Enum(ComplianceStatus), default=ComplianceStatus.COMPLIANT)
    last_checked = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AuditLog(Base):
    """Audit logs for compliance activities"""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action = Column(String(255), nullable=False)
    entity_type = Column(String(100))  # e.g., "compliance_area", "position_limit"
    entity_id = Column(Integer)
    user = Column(String(255))
    details = Column(Text)
    severity = Column(Enum(RiskLevel), default=RiskLevel.LOW)
    created_at = Column(DateTime, default=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ── MTL License Tracker ──────────────────────────────────────────────────────

class MTLStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    PENDING = "pending"
    SURRENDERED = "surrendered"
    EXEMPTED = "exempted"


class MTLLicense(Base):
    """Money Transmitter License records by state"""
    __tablename__ = "mtl_licenses"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(100), nullable=False)
    state_code = Column(String(10), nullable=False)
    license_number = Column(String(100))
    regulator = Column(String(255))          # e.g. "CA DFPI", "NYDFS"
    status = Column(Enum(MTLStatus), nullable=False, default=MTLStatus.PENDING)
    issue_date = Column(DateTime)
    expiry_date = Column(DateTime)
    renewal_due_date = Column(DateTime)
    application_date = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ── Remedial Actions Board ────────────────────────────────────────────────────

class ActionSource(str, enum.Enum):
    EXAM = "exam"
    SELF_IDENTIFIED = "self_identified"
    AUDIT = "audit"
    REGULATORY_INQUIRY = "regulatory_inquiry"
    COMPLAINT = "complaint"


class ActionStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"
    CLOSED = "closed"


class RemedialAction(Base):
    """Regulatory findings and remediation tracking"""
    __tablename__ = "remedial_actions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    source = Column(Enum(ActionSource), nullable=False)
    priority = Column(Enum(RiskLevel), nullable=False, default=RiskLevel.MEDIUM)
    status = Column(Enum(ActionStatus), nullable=False, default=ActionStatus.OPEN)
    owner = Column(String(255))
    regulator = Column(String(255))          # If externally identified
    related_area = Column(String(255))       # e.g. "AML", "KYC", "MTL"
    due_date = Column(DateTime)
    completion_date = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ── BSA/AML Program Indicators ────────────────────────────────────────────────

class BSAIndicatorStatus(str, enum.Enum):
    CURRENT = "current"
    AT_RISK = "at_risk"
    DEFICIENT = "deficient"
    NOT_APPLICABLE = "not_applicable"


class BSAProgramArea(str, enum.Enum):
    SAR_FILING = "sar_filing"
    CTR_FILING = "ctr_filing"
    OFAC_SCREENING = "ofac_screening"
    KYC_CIP = "kyc_cip"
    TRANSACTION_MONITORING = "transaction_monitoring"
    CUSTOMER_DUE_DILIGENCE = "customer_due_diligence"
    ENHANCED_DUE_DILIGENCE = "enhanced_due_diligence"
    RECORD_RETENTION = "record_retention"
    TRAINING = "training"
    INDEPENDENT_TESTING = "independent_testing"


class BSAAMLIndicator(Base):
    """BSA/AML program health indicators"""
    __tablename__ = "bsa_aml_indicators"

    id = Column(Integer, primary_key=True, index=True)
    program_area = Column(Enum(BSAProgramArea), nullable=False)
    metric_name = Column(String(255), nullable=False)
    metric_value = Column(String(255))       # e.g. "98.2%", "14 days avg"
    threshold = Column(String(255))          # e.g. "≥ 95%", "≤ 30 days"
    status = Column(Enum(BSAIndicatorStatus), nullable=False, default=BSAIndicatorStatus.CURRENT)
    responsible_team = Column(String(255))
    last_review_date = Column(DateTime)
    next_review_date = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
