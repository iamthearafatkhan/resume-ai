# backend/app/services/matcher.py
import re
import numpy as np
from huggingface_hub import AsyncInferenceClient
from sklearn.feature_extraction.text import TfidfVectorizer
from app.services.ats_scorer import extract_skills
from app.config import settings

# Huge list of words to IGNORE (Corporate fluff & generic verbs)
IGNORE_WORDS = {
    "work", "career", "opportunity", "line", "team", "build", "support", "deliver", 
    "develop", "manage", "experience", "skills", "professional", "process", "delivery",
    "job", "role", "company", "business", "knowledge", "ability", "requirements", 
    "environment", "working", "join", "looking", "apply", "applicants", "successful",
    "actionable", "identifying", "advantageous", "strong", "architects", "clear", 
    "excellent", "good", "great", "high", "low", "various", "multiple", "new"
}

def extract_requirements(jd_text: str) -> str:
    match = re.search(r'(requirements|what you[\'’]ll have|qualifications|skills|about you|who you are|what we[\'’]re looking for)(.*?)(benefits|what we offer|about us|where you|$)', jd_text, re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(2).strip()
    return jd_text

def extract_dynamic_keywords(jd_text: str, resume_text: str, top_n: int = 15):
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 1), max_features=1000)
    try:
        tfidf_matrix = vectorizer.fit_transform([jd_text, resume_text])
        feature_names = vectorizer.get_feature_names_out()
        
        jd_vector = tfidf_matrix[0].toarray()[0]
        top_indices = jd_vector.argsort()[-top_n*3:][::-1] 
        jd_keywords = [feature_names[i] for i in top_indices if jd_vector[i] > 0]
        
        resume_vector = tfidf_matrix[1].toarray()[0]
        matched, missing = [], []
        
        for kw in jd_keywords:
            kw_lower = kw.lower()
            if len(kw) < 4 or any(word in IGNORE_WORDS for word in kw_lower.split()):
                continue
                
            kw_idx = list(feature_names).index(kw)
            if resume_vector[kw_idx] > 0:
                matched.append(kw)
            else:
                missing.append(kw)
                
            if len(matched) + len(missing) >= top_n:
                break
                
        return matched, missing
    except Exception:
        return [], []

async def get_embedding(text: str) -> list[float]:
    """Uses Hugging Face Inference API for embeddings (No local model memory)."""
    if not settings.HF_TOKEN:
        return []
    client = AsyncInferenceClient(token=settings.HF_TOKEN)
    # Using a lightweight embedding model via API
    response = await client.feature_extraction(
        text,
        model="BAAI/bge-small-en-v1.5",
        normalize=True # Helps with cosine similarity
    )
    return response

async def compute_match(resume_text: str, jd_text: str, structural_score: float = 0) -> dict:
    requirements_text = extract_requirements(jd_text)
    dyn_matched, dyn_missing = extract_dynamic_keywords(requirements_text, resume_text, top_n=15)
    
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(requirements_text)
    static_matched = list(resume_skills.intersection(jd_skills))
    static_missing = list(jd_skills - resume_skills)
    
    matched = list(set([m.title() for m in dyn_matched + static_matched]))
    missing = list(set([m.title() for m in dyn_missing + static_missing]) - set(matched))

    total_req = len(matched) + len(missing)
    skill_score = (len(matched) / total_req * 100) if total_req > 0 else 0

    # Semantic Similarity via API
    semantic_score = 50 # Default fallback
    try:
        if settings.HF_TOKEN:
            emb_resume = await get_embedding(resume_text)
            emb_jd = await get_embedding(requirements_text)
            
            if emb_resume and emb_jd:
                # Cosine similarity
                v1, v2 = np.array(emb_resume), np.array(emb_jd)
                cosine_sim = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
                semantic_score = max(0, min(100, (cosine_sim - 0.3) / 0.5 * 100))
    except Exception as e:
        print(f"API Embedding Error: {e}")

    final_score = (skill_score * 0.50) + (semantic_score * 0.25) + (structural_score * 0.25)

    return {
        "overall_match": round(final_score, 1),
        "skill_coverage": round(skill_score, 1),
        "semantic_similarity": round(semantic_score, 1),
        "matched_skills": sorted(matched)[:15],
        "missing_skills": sorted(missing)[:15],
        "skill_gap": [{"skill": s, "priority": "high" if i < 5 else "medium"} for i, s in enumerate(missing)],
    }