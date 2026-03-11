from sqlalchemy.orm import Session
from app.models import RemedialAction
from app.schemas import RemedialActionCreate, RemedialActionUpdate


class RemedialActionService:
    @staticmethod
    def get_actions(db: Session, status: str = None, priority: str = None):
        q = db.query(RemedialAction)
        if status:
            q = q.filter(RemedialAction.status == status)
        if priority:
            q = q.filter(RemedialAction.priority == priority)
        return q.order_by(RemedialAction.due_date).all()

    @staticmethod
    def get_action(db: Session, action_id: int):
        return db.query(RemedialAction).filter(RemedialAction.id == action_id).first()

    @staticmethod
    def create_action(db: Session, data: RemedialActionCreate):
        action = RemedialAction(**data.model_dump())
        db.add(action)
        db.commit()
        db.refresh(action)
        return action

    @staticmethod
    def update_action(db: Session, action_id: int, data: RemedialActionUpdate):
        action = db.query(RemedialAction).filter(RemedialAction.id == action_id).first()
        if not action:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(action, field, value)
        db.commit()
        db.refresh(action)
        return action

    @staticmethod
    def get_overdue(db: Session):
        from datetime import datetime
        return (
            db.query(RemedialAction)
            .filter(
                RemedialAction.due_date < datetime.utcnow(),
                RemedialAction.status.notin_(["completed", "closed"]),
            )
            .order_by(RemedialAction.due_date)
            .all()
        )

    @staticmethod
    def get_open_critical(db: Session):
        return (
            db.query(RemedialAction)
            .filter(
                RemedialAction.priority.in_(["critical", "high"]),
                RemedialAction.status.notin_(["completed", "closed"]),
            )
            .order_by(RemedialAction.due_date)
            .all()
        )
