from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import Employer, User, Role
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.employer import EmployerUpdate
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

    employer, email, role_name = row
    return {
        "id": employer.id,
        "company_name": employer.company_name,
        "website": employer.website,
        "about": employer.about,
        "location": employer.location,
        "country": employer.country,
        "tel": employer.tel,
        "user_id": employer.user_id,
        "email": email,
        "role": role_name   # <- returns role string from Roles table
    }

from app.schemas import EmployerRead

async def employer_update(id: int, employer_update: EmployerUpdate, db: AsyncSession):
    # Get user
    user = await get_user(id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get employer
    result = await db.execute(select(Employer).where(Employer.user_id == user.id))
    employer = result.scalars().first()
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found for this user")

    # Update only the provided fields
    update_data = employer_update.dict(exclude_unset=True)

    if "company_name" in update_data:
        employer.company_name = update_data["company_name"]
    if "website" in update_data:
        employer.website = update_data["website"]
    if "about" in update_data:
        employer.about = update_data["about"]
    if "location" in update_data:
        employer.location = update_data["location"]
    if "country" in update_data:
        employer.country = update_data["country"]
    if "tel" in update_data:
        employer.tel = update_data["tel"]

    if "email" in update_data:
        user.email = update_data["email"]

    await db.commit()
    await db.refresh(employer)
    await db.refresh(user)

    # Build response for EmployerRead
    return EmployerRead(
        id=employer.id,
        user_id=employer.user_id,
        company_name=employer.company_name,
        website=employer.website,
        about=employer.about,
        location=employer.location,
        country=employer.country,
        tel=employer.tel,
        email=user.email,
        role=str(user.role.name)
    )
