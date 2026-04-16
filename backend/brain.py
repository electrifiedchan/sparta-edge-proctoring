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

# 🚀 UPGRADED MODEL ROUTING
HEAVY_MODEL = "llama-3.3-70b-versatile"  # Flagship Llama 3.3 for deep reasoning/adversarial roasts
FAST_MODEL = "llama-3.1-8b-instant"      # Ultra-fast 8B for JSON extraction and gatekeeping

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

def analyze_resume_vs_code(resume_text, code_context, project_name=None, job_description: str = ""):
    """The 'Roast' Function using LLaMA 3.3 70B - Upgraded to S.P.A.R.T.A. Combat Readiness Simulator"""
    no_code_provided = "NO CODE PROVIDED" in code_context or len(code_context) < 100
    
    if no_code_provided and project_name:
        return json.dumps({
            "combat_readiness_score": 0,
            "verdict": f"Project '{project_name}' is PHANTOMWARE.",
            "ats_metrics": {
                "keyword_match_rate": 0,
                "quantification_rate": 0,
                "missing_critical_skills": ["Code Evidence"]
            },
            "sections": {
                "experience": { "score": 0, "roast": "Cannot verify claims without code." },
                "skills": { "score": 0, "roast": "Cannot verify tech stack without code." },
                "formatting": { "score": 0, "roast": "Irrelevant until code is provided." },
                "ats_compatibility": { "score": 0, "roast": "Failed validation." }
            },
            "faang_attack_vectors": [
                {"trigger_claim": "Claimed to build a project", "attack_question": "Explain why you didn't provide code for this project."}
            ]
        })

    project_focus = f"FOCUS ONLY ON PROJECT: {project_name}" if project_name else ""
    jd_focus = f"JOB DESCRIPTION: {job_description}\n\n" if job_description else "JOB DESCRIPTION: Generic Senior Software Engineer Role\n\n"
    current_date = datetime.now().strftime("%B %d, %Y")
    
    prompt = f"""
    You are S.P.A.R.T.A., an elite, ruthless Technical Interviewer, FAANG Senior Engineer, and ATS filtering system evaluator.
    DATE: {current_date}
    {project_focus}
    {jd_focus}
    
    RESUME CLAIMS: {resume_text[:4000]}
    CODE EVIDENCE: {code_context[:30000]}
    
    Audit Protocol: Compare the grand claims in the resume to the actual reality of the code and the demands of the Job Description. 
    Act as an ATS filtering system AND a FAANG Senior Engineer.
    Calculate a Keyword Match Rate against the JD, a Quantification Rate (what % of bullets have numbers/metrics), and identify missing critical skills.
    
    Return STRICT JSON matching this exact schema. DO NOT wrap in markdown blocks like ```json:
    {{
        "combat_readiness_score": (0-100),
        "verdict": "(Brutal 3-5 word summary of their chances)",
        "ats_metrics": {{
            "keyword_match_rate": (0-100),
            "quantification_rate": (0-100),
            "missing_critical_skills": ["...", "..."]
        }},
        "sections": {{
            "experience": {{"score": (0-100), "roast": "(Brutal critique of their work history vs code and JD)"}},
            "skills": {{"score": (0-100), "roast": "(Critique of listed tech stack vs actual code usage and JD)"}},
            "formatting": {{"score": (0-100), "roast": "(Critique of resume layout/clarity)"}},
            "ats_compatibility": {{"score": (0-100), "roast": "(Will an ATS robot read this easily?)"}}
        }},
        "faang_attack_vectors": [
            {{"trigger_claim": "(e.g., 'Used React')", "attack_question": "(e.g., 'Explain the fiber reconciliation algorithm')"}},
            {{"trigger_claim": "(e.g., 'Led a team')", "attack_question": "(Amazon Leadership Principle attack)"}}
        ]
    }}
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
        return json.dumps({
            "combat_readiness_score": 0, 
            "verdict": "System Failure", 
            "ats_metrics": {"keyword_match_rate": 0, "quantification_rate": 0, "missing_critical_skills": []},
            "sections": {
                "experience": {"score": 0, "roast": "Error analyzing resume."},
                "skills": {"score": 0, "roast": "Error analyzing skills."},
                "formatting": {"score": 0, "roast": "Error analyzing formatting."},
                "ats_compatibility": {"score": 0, "roast": "Error analyzing compatibility."}
            }, 
            "faang_attack_vectors": []
        })

def generate_star_bullets(code_context):
    prompt = f"Act as an elite Tech Recruiter. Write 3 powerful STAR method resume bullets based on this raw code:\n{code_context[:30000]}"
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
    """Text chat UI upgraded to S.P.A.R.T.A. Llama 3.3 70B Heavy Reasoning"""
    
    # Dynamic System Prompt to handle both Red Pill (Roast) and Blue Pill (Rewrite) optimally.
    system_prompt = f"""You are S.P.A.R.T.A., an elite AI engineering architect. 
    If the user asks for a resume rewrite or improvement, provide highly technical, ATS-optimized, metrics-driven bullet points. 
    If the user is answering an interview question or arguing code logic, act as a ruthless, aggressive CTO and brutally challenge their logic. 
    Be concise. Do not use pleasantries.
    CONTEXT:
    {context}"""
    
    messages = [{"role": "system", "content": system_prompt}]
    
    for msg in history:
        role = "assistant" if msg["role"] == "model" else "user"
        content = msg["parts"][0]
        messages.append({"role": role, "content": content})
        
    messages.append({"role": "user", "content": message})
    
    try:
        completion = groq_client.chat.completions.create(
            model=HEAVY_MODEL, 
            messages=messages,
            temperature=0.7
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"System Malfunction... {e}"

def generate_interview_challenge(code_context, analysis_json):
    prompt = f"""
    Act as a ruthless CTO conducting a high-pressure technical interview. 
    ANALYSIS: {analysis_json}
    CODE: {code_context[:10000]}
    
    Look at the red flags. If there is phantomware, attack it. If the code is weak, call it out. Give me a 1 sentence, highly aggressive technical question based exactly on their code or claims. No greetings. No pleasantries.
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

def reconstruct_resume(resume_text: str):
    system_prompt = """
    You are S.P.A.R.T.A., an elite FAANG resume reconstructor.
    Convert the provided resume text into 3 powerful bullet points.
    
    ABSOLUTE RULES:
    1. Use the XYZ Formula: Accomplished [X] as measured by [Y], by doing [Z].
    2. NEVER invent metrics, percentages, or technologies.
    3. If a metric is missing, use a bracketed placeholder like 🔴[X]% or 🔴[Metric].
    4. Start every bullet with a Tier-1 action verb (e.g., Architected, Engineered, Spearheaded).
    
    Output strictly in this JSON format:
    {
      "bullets": [
        {
          "original": "Short summary of what they said",
          "enhanced": "The FAANG-grade XYZ bullet with placeholders"
        }
      ]
    }
    """
    
    try:
        completion = groq_client.chat.completions.create(
            model=HEAVY_MODEL, # Correct Groq's lightning-fast 70B model
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": resume_text}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response safely
        raw_content = completion.choices[0].message.content.strip()
        return json.loads(raw_content)
        
    except Exception as e:
        print(f"❌ S.P.A.R.T.A. LLM ERROR: {str(e)}")
        return {
            "bullets": [
                {
                    "original": "Failed to parse context.", 
                    "enhanced": f"ERROR RECONSTRUCTING: {str(e)}"
                }
            ]
        }