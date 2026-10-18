# 🤖 AI Resume Analyzer & Builder

> A full-stack, privacy-first SaaS platform that analyzes resumes against job descriptions using deterministic ATS rules and NLP semantic matching.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📖 Overview

**AI Resume Analyzer & Builder** is a privacy-first, full-stack application designed to help job seekers optimize their resumes. By combining deterministic ATS (Applicant Tracking System) rules with advanced NLP semantic matching, it provides actionable insights, exact skill gap analyses, and AI-driven recommendations to bypass corporate fluff and land more interviews.

---

## ✨ Key Features

- **📊 ATS Scoring:** Real, explainable scores based on structure, contact info, and quantifiable achievements.
- **🧠 Semantic Job Matching:** Uses `BAAI/bge-small-en-v1.5` to match resumes to JDs, ignoring corporate fluff.
- **🎯 AI Recommendations:** Recommends job titles and identifies exact skill gaps.
- **📝 CV Builder:** Create ATS-friendly, Europass, and Modern resumes with live PDF export and AI bullet generation.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion |
| **Backend** | FastAPI, Python |
| **AI / ML** | Hugging Face Inference API, Sentence-Transformers, Scikit-learn |

---

## 🚀 Getting Started (Local Setup)

Follow these steps to get the backend running on your local machine.

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ installed

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI development server
uvicorn app.main:app --reload
```

## Frontend Setup
(Note: Add your specific frontend commands here. Standard Vite commands are provided below as a placeholder)
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The API docs will be available at http://localhost:8000/docs and the frontend at http://localhost:5173.

## 🛡️ Privacy First
Unlike traditional resume analyzers, this platform is built with a privacy-first architecture. No user data is permanently stored, and sensitive document parsing happens securely.

## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.




