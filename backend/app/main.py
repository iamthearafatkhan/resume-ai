# backend/app/main.py
import traceback
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import AnalysisResponse, MatchResponse
from app.services.parser import extract_text
from app.services.ats_scorer import compute_ats_score
from app.services.matcher import compute_match
from app.services.llm_feedback import get_llm_feedback
from app.config import settings
from app.services.recommender import get_job_recommendations
from app.services.generator import generate_bullet_points

app = FastAPI(title="Resume ATS & Match API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Resume API is running perfectly!"}



@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    try:
        raw_bytes = await file.read()
        text = extract_text(raw_bytes, file.filename)
        
        ats_result = compute_ats_score(text)
        
        # ALWAYS get recommendations
        jobs = await get_job_recommendations(text)
        ats_result["recommended_jobs"] = jobs
            
        return ats_result
    except Exception as e:
        print("\n=== BACKEND CRASH LOG ===")
        traceback.print_exc()
        print("=========================\n")
        raise HTTPException(status_code=500, detail=str(e))

# backend/app/main.py
# ... (imports) ...

@app.post("/match", response_model=MatchResponse)
async def match_job(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    include_feedback: bool = Form(True),
):
    try:
        raw_bytes = await file.read()
        resume_text = extract_text(raw_bytes, file.filename)
        
        ats_result = compute_ats_score(resume_text)
        
        # ADD AWAIT HERE
        match_result = await compute_match(resume_text, job_description, ats_result["overall_score"])

        if include_feedback and settings.HF_TOKEN:
            try:
                feedback = await get_llm_feedback(resume_text, job_description, match_result["skill_gap"])
                match_result["llm_feedback"] = feedback
            except Exception as e:
                print(f"LLM Feedback Error: {e}")
                match_result["llm_feedback"] = None
                match_result["feedback_unavailable"] = True

        return match_result
    except Exception as e:
        print("\n=== MATCH CRASH LOG ===")
        traceback.print_exc()
        print("=======================\n")
        raise HTTPException(status_code=500, detail=str(e))





@app.post("/generate-bullets")
async def generate_bullets(job_title: str = Form(...)):
    try:
        bullets = await generate_bullet_points(job_title)
        return {"bullets": bullets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))