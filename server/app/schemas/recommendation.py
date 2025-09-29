from typing import Dict, List
from pydantic import BaseModel
from app.schemas.job import JobReadDetailed
from app.schemas.candidate import CandidateRead
class JobRecommendation(BaseModel):
    job: JobReadDetailed
    score: float
    parts: Dict[str, float]
    reasons: List[str]
    model_config = {"from_attributes": True}

class ApplicationRecommendation(BaseModel):
    application_id: int
    candidate: CandidateRead
    score: float
    parts: Dict[str, float]
    reasons: List[str]
    model_config = {'from_attributes' : True}