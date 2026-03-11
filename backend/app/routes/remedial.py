from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import RemedialActionCreate, RemedialActionUpdate, RemedialActionResponse
from app.services import RemedialActionService

router = APIRouter(prefix="/api/remedial", tags=["Remedial Actions"])


@router.get("/actions", response_model=List[RemedialActionResponse])
def list_actions(status: str = None, priority: str = None, db: Session = Depends(get_db)):
    return RemedialActionService.get_actions(db, status, priority)


@router.get("/actions/overdue", response_model=List[RemedialActionResponse])
def get_overdue(db: Session = Depends(get_db)):
    return RemedialActionService.get_overdue(db)


@router.get("/actions/open-critical", response_model=List[RemedialActionResponse])
def get_open_critical(db: Session = Depends(get_db)):
    return RemedialActionService.get_open_critical(db)


@router.get("/actions/{action_id}", response_model=RemedialActionResponse)
def get_action(action_id: int, db: Session = Depends(get_db)):
    action = RemedialActionService.get_action(db, action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Remedial action not found")
    return action


@router.post("/actions", response_model=RemedialActionResponse)
def create_action(data: RemedialActionCreate, db: Session = Depends(get_db)):
    return RemedialActionService.create_action(db, data)


@router.put("/actions/{action_id}", response_model=RemedialActionResponse)
def update_action(action_id: int, data: RemedialActionUpdate, db: Session = Depends(get_db)):
    action = RemedialActionService.update_action(db, action_id, data)
    if not action:
        raise HTTPException(status_code=404, detail="Remedial action not found")
    return action
