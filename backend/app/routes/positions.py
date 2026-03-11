from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import (
    PositionLimitCreate,
    PositionLimitUpdate,
    PositionLimitResponse,
)
from app.services import PositionLimitService

router = APIRouter(prefix="/api/positions", tags=["Positions"])


@router.post("/limits", response_model=PositionLimitResponse)
def create_position_limit(
    data: PositionLimitCreate,
    db: Session = Depends(get_db)
):
    """Create a new position limit"""
    return PositionLimitService.create_position_limit(db, data)


@router.get("/limits", response_model=List[PositionLimitResponse])
def list_position_limits(
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    """List all position limits"""
    return PositionLimitService.get_position_limits(db, is_active=active_only if active_only else None)


@router.get("/limits/{limit_id}", response_model=PositionLimitResponse)
def get_position_limit(
    limit_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific position limit"""
    limit = PositionLimitService.get_position_limit(db, limit_id)
    if not limit:
        raise HTTPException(status_code=404, detail="Position limit not found")
    return limit


@router.get("/limits/symbol/{symbol}", response_model=PositionLimitResponse)
def get_position_limit_by_symbol(
    symbol: str,
    db: Session = Depends(get_db)
):
    """Get position limit by asset symbol"""
    limit = PositionLimitService.get_position_limit_by_symbol(db, symbol.upper())
    if not limit:
        raise HTTPException(status_code=404, detail="Position limit not found for this symbol")
    return limit


@router.put("/limits/{limit_id}", response_model=PositionLimitResponse)
def update_position_limit(
    limit_id: int,
    data: PositionLimitUpdate,
    db: Session = Depends(get_db)
):
    """Update a position limit"""
    limit = PositionLimitService.update_position_limit(db, limit_id, data)
    if not limit:
        raise HTTPException(status_code=404, detail="Position limit not found")
    return limit


@router.get("/at-risk", response_model=List[PositionLimitResponse])
def get_at_risk_positions(db: Session = Depends(get_db)):
    """Get positions at or exceeding warning threshold"""
    return PositionLimitService.get_at_risk_positions(db)


@router.get("/non-compliant", response_model=List[PositionLimitResponse])
def get_non_compliant_positions(db: Session = Depends(get_db)):
    """Get non-compliant positions"""
    return PositionLimitService.get_non_compliant_positions(db)
