from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import roles_router, users_router

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

# Routers
app.include_router(roles_router, prefix="/roles", tags=["roles"])
app.include_router(users_router, prefix="/users", tags=["users"])


