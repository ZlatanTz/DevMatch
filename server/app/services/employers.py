from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import Employer, User, Role
from sqlalchemy.ext.asyncio import AsyncSession
from ..services.users import get_user
from fastapi import HTTPException


async def list_employers(db: AsyncSession):
    result = await db.execute(
        select(Employer, User.email).join(User, Employer.user_id == User.id)
    )

    employers_with_email = []
    for employer, email in result.all():
        employers_with_email.append({
            "id": employer.id,
            "company_name": employer.company_name,
            "company_logo": employer.company_logo,
            "website": employer.website,
            "about": employer.about,
            "location": employer.location,
            "country": employer.country,
            "tel": employer.tel,
            "user_id": employer.user_id,
            "email": email
        })

    return employers_with_email

async def get_employer(user_id: int, db: AsyncSession):
    result = await db.execute(
        select(Employer, User.email, Role.name)
        .join(User, Employer.user_id == User.id)
        .join(Role, User.role_id == Role.id)
        .where(Employer.user_id == user_id)
    )
    
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Employer not found")

    result = await db.execute(select(Employer).where(Employer.user_id == user_id))
    employer = result.scalars().first()
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found for this user")

    return employer
