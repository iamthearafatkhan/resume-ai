# backend/app/services/ats_scorer.py
import re

def extract_skills(text: str) -> set:
    """
    Fallback static skills list for standard technical/office roles.
    The dynamic matcher will handle other fields.
    """
    text_lower = text.lower()
    skills = {
        "python", "java", "sql", "aws", "docker", "react", "node", "machine learning",
        "project management", "agile", "scrum", "leadership", "communication",
        "excel", "power bi", "tableau", "data analysis", "negotiation", "budgeting",
        "compliance", "customer service", "sales", "marketing", "operations"
    }
    return {skill for skill in skills if skill in text_lower}

def compute_ats_score(raw_text: str) -> dict:
    text_lower = raw_text.lower()
    
    # 1. Contact Info (30 pts) - Global Formatting
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text_lower))
    # Regex matches +1 123 456 7890, (123) 456-7890, 07123456789, etc.
    has_phone = bool(re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}', text_lower))
    has_link = "linkedin" in text_lower or "github" in text_lower or "portfolio" in text_lower or "website" in text_lower
    
    contact_score = ((has_email + has_phone + has_link) / 3) * 30

    # 2. Sections (40 pts) - Universal Synonyms for ANY field
    section_groups = {
        "summary": ["summary", "objective", "profile", "about me", "professional summary"],
        "experience": ["experience", "employment", "work history", "projects", "internship", "research"],
        "education": ["education", "academic", "qualifications", "degree"],
        "skills": ["skills", "technologies", "competencies", "technical", "core skills"],
        "certifications": ["certification", "licenses", "awards", "achievements", "honors"]
    }
    
    found_sections = 0
    missing_sections = []
    
    for section, synonyms in section_groups.items():
        if any(syn in text_lower for syn in synonyms):
            found_sections += 1
        else:
            missing_sections.append(section.capitalize())
            
    section_score = (found_sections / len(section_groups)) * 40

    # 3. Achievements & Metrics (20 pts) - Universal Action Verbs & Numbers
    action_verbs = [
        "led", "managed", "developed", "created", "increased", "reduced", 
        "improved", "implemented", "designed", "evaluated", "built", "achieved",
        "negotiated", "delivered", "analyzed", "coordinated"
    ]
    # Matches any number with %, currency, or time
    has_metrics = bool(re.search(r'\d+%|\d+ percent|[\$\€\£]\s?\d+|\d+\s*(?:years?|months?|hours?)', text_lower))
    has_metrics = has_metrics or bool(re.search(r'\b\d{2,}\b', text_lower)) # Matches large raw numbers
    
    action_score = min(10, (sum(1 for v in action_verbs if v in text_lower) / 5) * 10)
    metric_score = 10 if has_metrics else 0
    achievement_score = action_score + metric_score

    # 4. Length (10 pts)
    word_count = len(raw_text.split())
    length_score = 10 if 150 <= word_count <= 1200 else 5

    # Final Calculation
    total_score = round(contact_score + section_score + achievement_score + length_score, 1)
    total_score = min(100, total_score)

    # Feedback Generation
    feedback = []
    if not has_email or not has_phone: feedback.append("Ensure your contact info (Email, Phone) is clearly visible.")
    if missing_sections: feedback.append(f"Consider adding these sections: {', '.join(missing_sections)}.")
    if not has_metrics: feedback.append("Add quantifiable metrics (e.g., 'Increased revenue by 20%').")
    if word_count < 150: feedback.append("Resume is too short. Add more details about your experience.")
    
    if not feedback: feedback = ["Excellent! Your resume is highly optimized for global ATS parsing."]

    return {
        "overall_score": total_score,
        "missing_sections": missing_sections,
        "keyword_coverage": 0, 
        "feedback": feedback,
        "explanation": "Universal ATS Score: 30% Contact, 40% Structure, 20% Achievements, 10% Length."
    }