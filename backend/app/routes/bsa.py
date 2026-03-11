from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import BSAAMLIndicatorCreate, BSAAMLIndicatorUpdate, BSAAMLIndicatorResponse
from app.services import BSAAMLService

router = APIRouter(prefix="/api/bsa", tags=["BSA/AML"])


@router.get("/indicators", response_model=List[BSAAMLIndicatorResponse])
def list_indicators(status: str = None, program_area: str = None, db: Session = Depends(get_db)):
    return BSAAMLService.get_indicators(db, status, program_area)


@router.get("/indicators/deficient", response_model=List[BSAAMLIndicatorResponse])
def get_deficient(db: Session = Depends(get_db)):
    return BSAAMLService.get_deficient(db)


@router.get("/indicators/{indicator_id}", response_model=BSAAMLIndicatorResponse)
def get_indicator(indicator_id: int, db: Session = Depends(get_db)):
    indicator = BSAAMLService.get_indicator(db, indicator_id)
    if not indicator:
        raise HTTPException(status_code=404, detail="Indicator not found")
    return indicator


@router.post("/indicators", response_model=BSAAMLIndicatorResponse)
def create_indicator(data: BSAAMLIndicatorCreate, db: Session = Depends(get_db)):
    return BSAAMLService.create_indicator(db, data)


@router.put("/indicators/{indicator_id}", response_model=BSAAMLIndicatorResponse)
def update_indicator(indicator_id: int, data: BSAAMLIndicatorUpdate, db: Session = Depends(get_db)):
    indicator = BSAAMLService.update_indicator(db, indicator_id, data)
    if not indicator:
        raise HTTPException(status_code=404, detail="Indicator not found")
    return indicator
