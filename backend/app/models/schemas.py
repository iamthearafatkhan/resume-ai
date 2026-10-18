# backend/app/models/schemas.py
from pydantic import BaseModel
from typing import List, Optional

class SkillGapItem(BaseModel):
    skill: str
    priority: str

class AnalysisResponse(BaseModel):
    overall_score: float
    missing_sections: List[str]
    keyword_coverage: float
    feedback: List[str]
    explanation: str
    recommended_jobs: Optional[List[str]] = [] # <--- MUST BE HERE

class MatchResponse(BaseModel):
    overall_match: float
    skill_coverage: float
    semantic_similarity: float
    matched_skills: List[str]
    missing_skills: List[str]
    skill_gap: List[SkillGapItem]
    llm_feedback: Optional[List[str]] = None
    feedback_unavailable: Optional[bool] = False