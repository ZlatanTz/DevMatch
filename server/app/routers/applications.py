from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core import get_db
from app import schemas
from app.services import applications
from app.utils.auth import require_roles

router = APIRouter()

@router.get("/{application_id}", response_model=schemas.ApplicationOut)
async def get_application(application_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(require_roles("candidate"))):
    return await applications.get_application(db, application_id)

@router.put("/{application_id}", response_model=schemas.ApplicationOut)
async def update_application(application_id: int, update: schemas.ApplicationUpdate, db: AsyncSession = Depends(get_db), current_user = Depends(require_roles("employer"))):
    if update.status is not None:
        return await applications.update_application_status(db, application_id, update.status)
    


