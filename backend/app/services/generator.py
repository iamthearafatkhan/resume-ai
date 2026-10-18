# backend/app/services/generator.py
from huggingface_hub import AsyncInferenceClient
from app.config import settings

async def generate_bullet_points(job_title: str) -> list[str]:
    if not settings.HF_TOKEN:
        # Fallback if no token is provided
        return [
            f"Developed and implemented {job_title} strategies to improve operational efficiency by 20%.",
            f"Collaborated with cross-functional teams to deliver high-quality results within tight deadlines.",
            f"Analyzed key metrics and prepared detailed reports for senior management to drive decision-making."
        ]

    client = AsyncInferenceClient(token=settings.HF_TOKEN)
    prompt = f"""<|im_start|>system
You are an expert resume writer. Generate exactly 3 professional, ATS-friendly resume bullet points for a "{job_title}". 
Use the format: Action Verb + Task + Result/Impact (with a metric if possible).
Return ONLY the 3 bullet points, one per line, prefixed with a dash (-).
<|im_end|>
<|im_start|>user
Generate bullets for: {job_title}
<|im_end|>
<|im_start|>assistant
"""
    try:
        response = await client.text_generation(
            prompt,
            model="Qwen/Qwen2.5-7B-Instruct",
            max_new_tokens=150,
            temperature=0.6,
        )
        lines = [line.strip("- ").strip() for line in response.split("\n") if line.strip()]
        return lines[:3]
    except Exception as e:
        print(f"HF API Error: {e}")
        return ["Error generating bullets. Please try again."]