from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import MTLLicenseCreate, MTLLicenseUpdate, MTLLicenseResponse
from app.services import MTLService

router = APIRouter(prefix="/api/mtl", tags=["MTL Licenses"])


@router.get("/licenses", response_model=List[MTLLicenseResponse])
def list_licenses(status: str = None, db: Session = Depends(get_db)):
    return MTLService.get_licenses(db, status)


@router.get("/licenses/expiring-soon", response_model=List[MTLLicenseResponse])
def get_expiring_soon(days: int = 90, db: Session = Depends(get_db)):
    return MTLService.get_expiring_soon(db, days)


@router.get("/licenses/{license_id}", response_model=MTLLicenseResponse)
def get_license(license_id: int, db: Session = Depends(get_db)):
    license = MTLService.get_license(db, license_id)
    if not license:
        raise HTTPException(status_code=404, detail="License not found")
    return license


@router.post("/licenses", response_model=MTLLicenseResponse)
def create_license(data: MTLLicenseCreate, db: Session = Depends(get_db)):
    return MTLService.create_license(db, data)


@router.put("/licenses/{license_id}", response_model=MTLLicenseResponse)
def update_license(license_id: int, data: MTLLicenseUpdate, db: Session = Depends(get_db)):
    license = MTLService.update_license(db, license_id, data)
    if not license:
        raise HTTPException(status_code=404, detail="License not found")
    return license
