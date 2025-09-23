from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import roles_router, users_router, jobs_router, skills_router, employers_router, candidates_router

app = FastAPI(title="DevMatch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "OK"}


app.include_router(roles_router, prefix="/roles", tags=["roles"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(jobs_router, prefix="/jobs", tags=["jobs"])
app.include_router(skills_router, prefix="/skills", tags=["skills"])
app.include_router(employers_router, prefix="/employers", tags=["employers"])
app.include_router(candidates_router, prefix="/candidates", tags=["candidates"])

