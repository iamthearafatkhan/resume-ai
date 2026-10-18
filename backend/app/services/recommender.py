# backend/app/services/recommender.py
from huggingface_hub import AsyncInferenceClient
from app.config import settings
import json

async def get_job_recommendations(resume_text: str) -> list[str]:
    # 1. Try HF API (Optional)
    if settings.HF_TOKEN:
        try:
            client = AsyncInferenceClient(token=settings.HF_TOKEN)
            prompt = f"""<|im_start|>system
You are an expert recruiter. Suggest exactly 3 job titles based on this resume. Return ONLY a JSON array of strings.
<|im_end|>
<|im_start|>user
Resume: {resume_text[:1500]}
<|im_end|>
<|im_start|>assistant
"""
            response = await client.text_generation(prompt, model="Qwen/Qwen2.5-7B-Instruct", max_new_tokens=60, temperature=0.3)
            start, end = response.find('['), response.rfind(']') + 1
            if start != -1 and end != 0:
                titles = json.loads(response[start:end])
                if isinstance(titles, list) and len(titles) > 0:
                    return titles[:3]
        except Exception:
            pass # Fail silently and use fallback

    # 2. Guaranteed Fallback (Rule-Based)
    text_lower = resume_text.lower()
    if "project management" in text_lower or "project coordinator" in text_lower or "document controller" in text_lower:
        return ["Project Manager", "Operations Coordinator", "Program Lead"]
    elif "human resource" in text_lower or "hr " in text_lower or "recruitment" in text_lower:
        return ["HR Business Partner", "Talent Acquisition Specialist", "People Operations"]
    elif "python" in text_lower or "sql" in text_lower or "data analyst" in text_lower or "machine learning" in text_lower:
        return ["Data Analyst", "Business Intelligence Analyst", "Machine Learning Engineer"]
    elif "construction" in text_lower or "site" in text_lower or "civil" in text_lower:
        return ["Site Engineer", "Construction Manager", "Project Coordinator"]
    elif "marketing" in text_lower or "sales" in text_lower:
        return ["Marketing Manager", "Sales Executive", "Business Development"]
    elif "law" in text_lower or "legal" in text_lower:
        return ["Legal Assistant", "Paralegal", "Compliance Officer"]
    
    return ["Operations Specialist", "Administrative Manager", "Business Analyst"]