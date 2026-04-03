import os
import json
import logging
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# --- LOGGING SETUP ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Groq Client
try:
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    logger.info("✅ Groq Client initialized successfully in brain.py")
except Exception as e:
    logger.error(f"❌ Failed to initialize Groq client: {e}")
    groq_client = None

# Model Routing
HEAVY_MODEL = "llama3-70b-8192"  # For deep analysis, roasts, and rewriting
FAST_MODEL = "llama-3.1-8b-instant"    # For fast gatekeeping and JSON extraction

def validate_is_resume(text_content):
    """
    🛡️ THE GATEKEEPER: Fast LLaMA 8B check to ensure upload is a resume.
    """
    keywords = ["experience", "education", "skills", "projects", "summary", "work history", "curriculum vitae", "contact"]
    text_lower = text_content.lower()
    match_count = sum(1 for k in keywords if k in text_lower)

    if match_count < 2:
        return False, "This document lacks standard resume sections (Experience, Skills, Education)."

    prompt = f"""
    Determine if this text is a Professional Resume/CV.
    Output JSON exactly: {{"is_resume": true/false, "reason": "why"}}
    
    TEXT: {text_content[:2000]}
    """
    try:
        completion = groq_client.chat.completions.create(
            model=FAST_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        result = json.loads(completion.choices[0].message.content)
        return result.get("is_resume", False), result.get("reason", "")
    except Exception as e:
        logger.warning(f"Groq validation failed, falling back to heuristic. Error: {e}")
        return True, "" # Lenient fallback so we don't break the demo

def extract_projects_from_resume(resume_text):
    """Uses LLaMA 8B to extract project names and GitHub URLs"""
    prompt = f"""
    Extract all projects from this resume.
    Return JSON exactly: {{"projects": [{{"name": "...", "description": "...", "github_url": "https://github.com/...", "technologies": ["..."]}}]}}
    If NO github URL is found for a specific project, use null.
    
    RESUME: 
    {resume_text[:4000]}
    """
    try:
        completion = groq_client.chat.completions.create(
            model=FAST_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        result = json.loads(completion.choices[0].message.content)
        logger.info(f"📋 Extracted {len(result.get('projects', []))} projects")
        return result.get("projects", [])
    except Exception as e:
        logger.error(f"Failed to extract projects: {e}")
        return []

def analyze_resume_vs_code(resume_text, code_context, project_name=None):
    """The 'Roast' Function using LLaMA 70B."""
    no_code_provided = "NO CODE PROVIDED" in code_context or len(code_context) < 100
    
    if no_code_provided and project_name:
        return json.dumps({
            "credibility_score": 0,
            "verdict": f"Project '{project_name}' is PHANTOMWARE - zero code evidence provided.",
            "matches": [],
            "red_flags": [f"🚩 PHANTOMWARE: Project '{project_name}' has NO GitHub link - all claims are unverified."],
            "missing_gems": [],
            "summary": "Cannot verify any claims. Credibility: 0/100"
        })

    project_focus = f"FOCUS ONLY ON PROJECT: {project_name}" if project_name else ""
    current_date = datetime.now().strftime("%B %d, %Y")
    
    prompt = f"""
    You are 'GitReal', a ruthless Forensic Resume Auditor.
    DATE: {current_date}
    {project_focus}
    
    RESUME CLAIMS: {resume_text[:4000]}
    CODE EVIDENCE: {code_context[:30000]}
    
    Audit Protocol: Check for Seniority mismatch, keyword stuffing, and outdated tech. Be brutal.
    Return strict JSON with exactly these keys: "credibility_score" (number 0-100), "verdict" (string), "matches" (list of strings), "red_flags" (list of strings), "missing_gems" (list of strings), "summary" (string).
    """
    try:
        completion = groq_client.chat.completions.create(
            model=HEAVY_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        return completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        return json.dumps({"verdict": "Error analyzing project", "red_flags": [str(e)], "matches": [], "missing_gems": [], "credibility_score": 0})

def generate_star_bullets(code_context):
    prompt = f"Act as a Senior Tech Recruiter. Write 3 powerful STAR method resume bullets based on this raw code:\n{code_context[:30000]}"
    try:
        completion = groq_client.chat.completions.create(
            model=HEAVY_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error generating bullets: {e}"

def get_chat_response(history, message, context):
    """Translates Gemini history format back to Groq format for the text chat UI."""
    system_prompt = f"You are Morpheus from The Matrix. Speak in metaphors about code and reality.\nCONTEXT:\n{context}"
    messages = [{"role": "system", "content": system_prompt}]
    
    # Map Gemini format from main.py back to standard OpenAI/Groq format
    for msg in history:
        role = "assistant" if msg["role"] == "model" else "user"
        content = msg["parts"][0]
        messages.append({"role": role, "content": content})
        
    messages.append({"role": "user", "content": message})
    
    try:
        completion = groq_client.chat.completions.create(
            model=FAST_MODEL,
            messages=messages,
            temperature=0.7
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"The Matrix is glitching... {e}"

def generate_interview_challenge(code_context, analysis_json):
    prompt = f"""
    Act as a ruthless CTO conducting a stress interview. 
    ANALYSIS: {analysis_json}
    CODE: {code_context[:10000]}
    
    Look at the red flags. If there is phantomware, attack it. Give me a 1 sentence, highly aggressive technical question. No greetings.
    """
    try:
        completion = groq_client.chat.completions.create(
            model=HEAVY_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return completion.choices[0].message.content
    except Exception as e:
        return "Explain the architecture of your most complex project right now, and don't lie."

def generate_ats_resume(resume_text, code_context):
    prompt = f"""
    Rewrite this resume to be ATS compliant. Inject hardcore technical evidence found in the code to prove the claims.
    RESUME: {resume_text[:3000]}
    CODE: {code_context[:20000]}
    """
    try:
        completion = groq_client.chat.completions.create(
            model=HEAVY_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error: {e}"