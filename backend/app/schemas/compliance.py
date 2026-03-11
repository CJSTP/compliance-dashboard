from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ComplianceStatus(str, Enum):
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    PENDING_REVIEW = "pending_review"
    UNDER_MONITORING = "under_monitoring"


# Jurisdiction Schemas
class JurisdictionCreate(BaseModel):
    name: str
    code: str
    region: Optional[str] = None


class JurisdictionResponse(BaseModel):
    id: int
    name: str
    code: str
    region: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Compliance Area Schemas
class ComplianceAreaCreate(BaseModel):
    name: str
    description: Optional[str] = None
    jurisdiction_id: int
    responsible_team: Optional[str] = None


class ComplianceAreaUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ComplianceStatus] = None
    last_review_date: Optional[datetime] = None
    next_review_date: Optional[datetime] = None
    responsible_team: Optional[str] = None


class ComplianceAreaResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    jurisdiction_id: int
    status: ComplianceStatus
    last_review_date: Optional[datetime]
    next_review_date: Optional[datetime]
    responsible_team: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Risk Assessment Schemas
class RiskAssessmentCreate(BaseModel):
    compliance_area_id: int
    risk_level: RiskLevel
    risk_description: Optional[str] = None
    mitigation_strategy: Optional[str] = None
    assessed_by: Optional[str] = None
    next_assessment_date: Optional[datetime] = None


class RiskAssessmentResponse(BaseModel):
    id: int
    compliance_area_id: int
    risk_level: RiskLevel
    risk_description: Optional[str]
    mitigation_strategy: Optional[str]
    assessed_by: Optional[str]
    assessed_date: datetime
    next_assessment_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Position Limit Schemas
class PositionLimitCreate(BaseModel):
    asset_symbol: str
    jurisdiction_id: Optional[int] = None
    max_position_usd: float
    limit_percentage: Optional[float] = None
    warning_threshold: Optional[float] = 80.0


class PositionLimitUpdate(BaseModel):
    max_position_usd: Optional[float] = None
    current_position_usd: Optional[float] = None
    warning_threshold: Optional[float] = None
    is_active: Optional[bool] = None


class PositionLimitResponse(BaseModel):
    id: int
    asset_symbol: str
    jurisdiction_id: Optional[int]
    max_position_usd: float
    current_position_usd: float
    limit_percentage: Optional[float]
    warning_threshold: Optional[float]
    current_utilization: float
    is_active: bool
    compliance_status: ComplianceStatus
    last_checked: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Audit Log Schemas
class AuditLogCreate(BaseModel):
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    user: Optional[str] = None
    details: Optional[str] = None
    severity: Optional[RiskLevel] = RiskLevel.LOW


class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime
    action: str
    entity_type: Optional[str]
    entity_id: Optional[int]
    user: Optional[str]
    details: Optional[str]
    severity: RiskLevel
    created_at: datetime

    class Config:
        from_attributes = True


# ── MTL License Schemas ───────────────────────────────────────────────────────

class MTLStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    PENDING = "pending"
    SURRENDERED = "surrendered"
    EXEMPTED = "exempted"


class MTLLicenseCreate(BaseModel):
    state: str
    state_code: str
    license_number: Optional[str] = None
    regulator: Optional[str] = None
    status: MTLStatus = MTLStatus.PENDING
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    renewal_due_date: Optional[datetime] = None
    application_date: Optional[datetime] = None
    notes: Optional[str] = None


class MTLLicenseUpdate(BaseModel):
    license_number: Optional[str] = None
    regulator: Optional[str] = None
    status: Optional[MTLStatus] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    renewal_due_date: Optional[datetime] = None
    application_date: Optional[datetime] = None
    notes: Optional[str] = None


class MTLLicenseResponse(BaseModel):
    id: int
    state: str
    state_code: str
    license_number: Optional[str]
    regulator: Optional[str]
    status: MTLStatus
    issue_date: Optional[datetime]
    expiry_date: Optional[datetime]
    renewal_due_date: Optional[datetime]
    application_date: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Remedial Action Schemas ───────────────────────────────────────────────────

class ActionSource(str, Enum):
    EXAM = "exam"
    SELF_IDENTIFIED = "self_identified"
    AUDIT = "audit"
    REGULATORY_INQUIRY = "regulatory_inquiry"
    COMPLAINT = "complaint"


class ActionStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"
    CLOSED = "closed"


class RemedialActionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    source: ActionSource
    priority: RiskLevel = RiskLevel.MEDIUM
    status: ActionStatus = ActionStatus.OPEN
    owner: Optional[str] = None
    regulator: Optional[str] = None
    related_area: Optional[str] = None
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    notes: Optional[str] = None


class RemedialActionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    source: Optional[ActionSource] = None
    priority: Optional[RiskLevel] = None
    status: Optional[ActionStatus] = None
    owner: Optional[str] = None
    regulator: Optional[str] = None
    related_area: Optional[str] = None
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    notes: Optional[str] = None


class RemedialActionResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    source: ActionSource
    priority: RiskLevel
    status: ActionStatus
    owner: Optional[str]
    regulator: Optional[str]
    related_area: Optional[str]
    due_date: Optional[datetime]
    completion_date: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── BSA/AML Indicator Schemas ─────────────────────────────────────────────────

class BSAIndicatorStatus(str, Enum):
    CURRENT = "current"
    AT_RISK = "at_risk"
    DEFICIENT = "deficient"
    NOT_APPLICABLE = "not_applicable"


class BSAProgramArea(str, Enum):
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


class BSAAMLIndicatorCreate(BaseModel):
    program_area: BSAProgramArea
    metric_name: str
    metric_value: Optional[str] = None
    threshold: Optional[str] = None
    status: BSAIndicatorStatus = BSAIndicatorStatus.CURRENT
    responsible_team: Optional[str] = None
    last_review_date: Optional[datetime] = None
    next_review_date: Optional[datetime] = None
    notes: Optional[str] = None


class BSAAMLIndicatorUpdate(BaseModel):
    metric_value: Optional[str] = None
    threshold: Optional[str] = None
    status: Optional[BSAIndicatorStatus] = None
    responsible_team: Optional[str] = None
    last_review_date: Optional[datetime] = None
    next_review_date: Optional[datetime] = None
    notes: Optional[str] = None


class BSAAMLIndicatorResponse(BaseModel):
    id: int
    program_area: BSAProgramArea
    metric_name: str
    metric_value: Optional[str]
    threshold: Optional[str]
    status: BSAIndicatorStatus
    responsible_team: Optional[str]
    last_review_date: Optional[datetime]
    next_review_date: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
