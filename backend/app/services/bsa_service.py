from sqlalchemy.orm import Session
from app.models import BSAAMLIndicator
from app.schemas import BSAAMLIndicatorCreate, BSAAMLIndicatorUpdate


class BSAAMLService:
    @staticmethod
    def get_indicators(db: Session, status: str = None, program_area: str = None):
        q = db.query(BSAAMLIndicator)
        if status:
            q = q.filter(BSAAMLIndicator.status == status)
        if program_area:
            q = q.filter(BSAAMLIndicator.program_area == program_area)
        return q.order_by(BSAAMLIndicator.program_area).all()

    @staticmethod
    def get_indicator(db: Session, indicator_id: int):
        return db.query(BSAAMLIndicator).filter(BSAAMLIndicator.id == indicator_id).first()

    @staticmethod
    def create_indicator(db: Session, data: BSAAMLIndicatorCreate):
        indicator = BSAAMLIndicator(**data.model_dump())
        db.add(indicator)
        db.commit()
        db.refresh(indicator)
        return indicator

    @staticmethod
    def update_indicator(db: Session, indicator_id: int, data: BSAAMLIndicatorUpdate):
        indicator = db.query(BSAAMLIndicator).filter(BSAAMLIndicator.id == indicator_id).first()
        if not indicator:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(indicator, field, value)
        db.commit()
        db.refresh(indicator)
        return indicator

    @staticmethod
    def get_deficient(db: Session):
        return (
            db.query(BSAAMLIndicator)
            .filter(BSAAMLIndicator.status.in_(["deficient", "at_risk"]))
            .order_by(BSAAMLIndicator.program_area)
            .all()
        )
