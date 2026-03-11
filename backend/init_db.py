"""
Script to populate the database with sample data
"""
from app.db.database import SessionLocal, Base, engine
from app.models import Jurisdiction, ComplianceArea, PositionLimit, RiskAssessment, MTLLicense, RemedialAction, BSAAMLIndicator
from sample_data import (
    SAMPLE_JURISDICTIONS, SAMPLE_COMPLIANCE_AREAS, SAMPLE_POSITION_LIMITS, SAMPLE_RISK_ASSESSMENTS,
    SAMPLE_MTL_LICENSES, SAMPLE_REMEDIAL_ACTIONS, SAMPLE_BSA_INDICATORS,
)


def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Add jurisdictions
        for j_data in SAMPLE_JURISDICTIONS:
            jurisdiction = Jurisdiction(**j_data)
            db.add(jurisdiction)
        db.commit()

        jurisdictions = db.query(Jurisdiction).all()

        # Add compliance areas
        for a_data in SAMPLE_COMPLIANCE_AREAS:
            compliance_area = ComplianceArea(**a_data)
            db.add(compliance_area)
        db.commit()

        # Add position limits
        for p_data in SAMPLE_POSITION_LIMITS:
            position_limit = PositionLimit(**p_data)
            db.add(position_limit)
        db.commit()

        # Add risk assessments
        for r_data in SAMPLE_RISK_ASSESSMENTS:
            risk_assessment = RiskAssessment(**r_data)
            db.add(risk_assessment)
        db.commit()

        # Add MTL licenses
        for m_data in SAMPLE_MTL_LICENSES:
            mtl_license = MTLLicense(**m_data)
            db.add(mtl_license)
        db.commit()

        # Add remedial actions
        for ra_data in SAMPLE_REMEDIAL_ACTIONS:
            action = RemedialAction(**ra_data)
            db.add(action)
        db.commit()

        # Add BSA/AML indicators
        for b_data in SAMPLE_BSA_INDICATORS:
            indicator = BSAAMLIndicator(**b_data)
            db.add(indicator)
        db.commit()

        print("✅ Database initialized with sample data!")
        print(f"   - {len(jurisdictions)} jurisdictions")
        print(f"   - {len(SAMPLE_COMPLIANCE_AREAS)} compliance areas")
        print(f"   - {len(SAMPLE_POSITION_LIMITS)} position limits")
        print(f"   - {len(SAMPLE_RISK_ASSESSMENTS)} risk assessments")
        print(f"   - {len(SAMPLE_MTL_LICENSES)} MTL licenses")
        print(f"   - {len(SAMPLE_REMEDIAL_ACTIONS)} remedial actions")
        print(f"   - {len(SAMPLE_BSA_INDICATORS)} BSA/AML indicators")

    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
