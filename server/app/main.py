from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.routers import roles_router, users_router, jobs_router, applications_router, candidates_router, employers_router, auth_router, skills_router, me_router, admin_router
from sqlalchemy import text
app = FastAPI(title="DevMatch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.on_event("startup")
# async def startup_db_check():
#     try:
#         async with engine.begin() as conn:
#             # test query mora biti obavijen u text()
#             result = await conn.execute(text("SELECT 1"))
#             print("DB connection OK:", result.scalar())  # should print 1
#     except Exception as e:
#         print("DB connection failed:", e)

@app.get("/")
async def root():
    return {"message": "OK"}

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(me_router, prefix="/me", tags=["me"])
app.include_router(roles_router, prefix="/roles", tags=["roles"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(jobs_router, prefix="/jobs", tags=["jobs"])
app.include_router(applications_router, prefix="/applications", tags=["applications"])
app.include_router(candidates_router, prefix="/candidates", tags=["candidates"])
app.include_router(employers_router, prefix="/employers", tags=["employers"])
app.include_router(skills_router, prefix="/skills", tags=["skills"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])
