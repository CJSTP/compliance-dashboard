from sqlalchemy.orm import Session
from app.models import MTLLicense
from app.schemas import MTLLicenseCreate, MTLLicenseUpdate


class MTLService:
    @staticmethod
    def get_licenses(db: Session, status: str = None):
        q = db.query(MTLLicense)
        if status:
            q = q.filter(MTLLicense.status == status)
        return q.order_by(MTLLicense.state).all()

    @staticmethod
    def get_license(db: Session, license_id: int):
        return db.query(MTLLicense).filter(MTLLicense.id == license_id).first()

    @staticmethod
    def create_license(db: Session, data: MTLLicenseCreate):
        license = MTLLicense(**data.model_dump())
        db.add(license)
        db.commit()
        db.refresh(license)
        return license

    @staticmethod
    def update_license(db: Session, license_id: int, data: MTLLicenseUpdate):
        license = db.query(MTLLicense).filter(MTLLicense.id == license_id).first()
        if not license:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(license, field, value)
        db.commit()
        db.refresh(license)
        return license

    @staticmethod
    def get_expiring_soon(db: Session, days: int = 90):
        from datetime import datetime, timedelta
        cutoff = datetime.utcnow() + timedelta(days=days)
        return (
            db.query(MTLLicense)
            .filter(MTLLicense.status == "active", MTLLicense.expiry_date <= cutoff)
            .order_by(MTLLicense.expiry_date)
            .all()
        )
