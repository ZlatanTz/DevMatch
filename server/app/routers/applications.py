from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app import schemas
from app.services.applications import *
router = APIRouter()

router.post('/jobs/{job_i}')