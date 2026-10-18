# AI Resume Analyzer & Builder

A full-stack, privacy-first SaaS platform that analyzes resumes against job descriptions using deterministic ATS rules and NLP semantic matching.

## Features
- **ATS Scoring**: Real, explainable scores based on structure, contact info, and achievements.
- **Semantic Job Matching**: Uses `BAAI/bge-small-en-v1.5` to match resumes to JDs, ignoring corporate fluff.
- **AI Recommendations**: Recommends job titles and exact skill gaps.
- **CV Builder**: Create ATS-friendly, Europass, and Modern resumes with live PDF export and AI bullet generation.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python
- **AI/ML**: Hugging Face Inference API, Sentence-Transformers, Scikit-learn

## Local Setup
### Backend
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload