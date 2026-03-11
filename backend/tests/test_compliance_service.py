"""
Unit tests for compliance service
"""
import pytest
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base
from app.models import ComplianceArea, RiskAssessment, Jurisdiction
from app.models.compliance import ComplianceStatus, RiskLevel
from app.schemas import ComplianceAreaCreate, RiskAssessmentCreate
from app.services.compliance_service import ComplianceService

# Setup test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
Base.metadata.create_all(bind=engine)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db():
    db = TestingSessionLocal()
    yield db
    db.close()


def test_create_compliance_area(db):
    """Test creating a compliance area"""
    # Create jurisdiction first
    jurisdiction = Jurisdiction(name="US", code="US")
    db.add(jurisdiction)
    db.commit()
    db.refresh(jurisdiction)
    
    # Create compliance area
    data = ComplianceAreaCreate(
        name="KYC",
        description="Customer verification",
        jurisdiction_id=jurisdiction.id,
        responsible_team="Compliance"
    )
    
    area = ComplianceService.create_compliance_area(db, data)
    
    assert area.name == "KYC"
    assert area.status == ComplianceStatus.PENDING_REVIEW
    assert area.responsible_team == "Compliance"


def test_get_compliance_areas(db):
    """Test retrieving compliance areas"""
    jurisdiction = Jurisdiction(name="EU", code="EU")
    db.add(jurisdiction)
    db.commit()
    
    area1 = ComplianceArea(
        name="AML",
        jurisdiction_id=jurisdiction.id,
        status=ComplianceStatus.COMPLIANT
    )
    area2 = ComplianceArea(
        name="GDPR",
        jurisdiction_id=jurisdiction.id,
        status=ComplianceStatus.NON_COMPLIANT
    )
    db.add_all([area1, area2])
    db.commit()
    
    areas = ComplianceService.get_compliance_areas(db)
    assert len(areas) >= 2


def test_create_risk_assessment(db):
    """Test creating a risk assessment"""
    jurisdiction = Jurisdiction(name="UK", code="UK")
    db.add(jurisdiction)
    db.commit()
    
    area = ComplianceArea(
        name="Market Abuse",
        jurisdiction_id=jurisdiction.id
    )
    db.add(area)
    db.commit()
    db.refresh(area)
    
    data = RiskAssessmentCreate(
        compliance_area_id=area.id,
        risk_level=RiskLevel.HIGH,
        risk_description="High trading volume anomaly",
        mitigation_strategy="Enhanced monitoring"
    )
    
    assessment = ComplianceService.create_risk_assessment(db, data)
    
    assert assessment.risk_level == RiskLevel.HIGH
    assert assessment.compliance_area_id == area.id
