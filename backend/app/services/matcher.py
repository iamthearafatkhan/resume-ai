# backend/app/services/matcher.py
import re
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from app.services.ats_scorer import extract_skills

_model = None
def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("BAAI/bge-small-en-v1.5")
    return _model

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
    # ngram_range=(1, 2) stops 3-word nonsense phrases
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
            # Skip if any word in the phrase is in our ignore list
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
    except Exception as e:
        return [], []

def compute_match(resume_text: str, jd_text: str, structural_score: float = 0) -> dict:
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

    try:
        model = get_model()
        emb_resume = model.encode(resume_text, convert_to_tensor=True)
        emb_jd = model.encode(requirements_text, convert_to_tensor=True)
        cosine_sim = util.cos_sim(emb_resume, emb_jd).item()
        semantic_score = max(0, min(100, (cosine_sim - 0.3) / 0.5 * 100))
    except Exception:
        semantic_score = 50 

    final_score = (skill_score * 0.50) + (semantic_score * 0.25) + (structural_score * 0.25)

    return {
        "overall_match": round(final_score, 1),
        "skill_coverage": round(skill_score, 1),
        "semantic_similarity": round(semantic_score, 1),
        "matched_skills": sorted(matched)[:15],
        "missing_skills": sorted(missing)[:15],
        "skill_gap": [{"skill": s, "priority": "high" if i < 5 else "medium"} for i, s in enumerate(missing)],
    }