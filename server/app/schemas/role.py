from pydantic import BaseModel, Field

class RoleBase(BaseModel):
    name: str = Field(..., max_length=50)

class RoleCreate(RoleBase):
    pass

class RoleRead(RoleBase):
    model_config = {"from_attributes": True}
    id: int