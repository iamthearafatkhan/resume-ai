# backend/app/services/llm_feedback.py
from huggingface_hub import AsyncInferenceClient
from app.config import settings

async def get_llm_feedback(resume_text: str, jd_text: str, gap_data: list) -> list[str]:
    if not settings.HF_TOKEN:
        return ["Please add your HF_TOKEN to the backend .env file to get AI recommendations."]

    client = AsyncInferenceClient(token=settings.HF_TOKEN)
    missing = ", ".join([g["skill"] for g in gap_data]) or "None"
    
    prompt = f"""<|im_start|>system
You are an expert career coach. Give 3 short, actionable bullet points (max 15 words each) to help a candidate improve their resume based on the missing skills. Do not invent skills.
<|im_end|>
<|im_start|>user
Missing Skills: {missing}
Job Description: {jd_text[:500]}
<|im_end|>
<|im_start|>assistant
"""
    
    try:
        response = await client.text_generation(
            prompt,
            model="Qwen/Qwen2.5-7B-Instruct",
            max_new_tokens=150,
            temperature=0.4,
        )
        # Clean up response
        lines = [line.strip("- ").strip() for line in response.split("\n") if line.strip()]
        return lines[:3]
    except Exception as e:
        print(f"HF API Error: {e}")
        raise e