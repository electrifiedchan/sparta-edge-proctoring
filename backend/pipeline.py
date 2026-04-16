import os
import time
import base64
import requests
import fitz  # PyMuPDF
from groq import Groq

# --- HELPER: The Token Shredder (For OCR Fallback) ---
def strip_ocr_metadata(data) -> list:
    """Recursively hunts down text inside the NVIDIA JSON and drops heavy coordinates."""
    extracted = []
    if isinstance(data, dict):
        for k, v in data.items():
            if k.lower() in ['text', 'content', 'value'] and isinstance(v, str):
                extracted.append(v)
            else:
                extracted.extend(strip_ocr_metadata(v))
    elif isinstance(data, list):
        for item in data:
            extracted.extend(strip_ocr_metadata(item))
    return extracted

# --- STAGE 1 & 2: THE HYBRID BRIDGE & EYES ---
def extract_text_intelligently(pdf_path: str, nvidia_key: str, page_number: int = 0) -> str:
    """Attempts perfect digital extraction first. Falls back to DEDICATED NVIDIA OCR NIM if it's an image."""
    print(f"📄 Bridge: Loading {pdf_path} (Page {page_number + 1})")
    
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"Missing file: {pdf_path}")
        
    doc = fitz.open(pdf_path)
    page = doc.load_page(page_number)
    
    # Attempt 1: The Fast Lane (Native Digital Text)
    native_text = page.get_text("text").strip()
    
    if len(native_text) > 50:
        print("⚡ Bridge: Digital text detected! Skipping OCR for 100% accuracy.")
        return native_text
        
    # Attempt 2: The OCR Fallback (High-Res PNG + Dedicated Infer Endpoint)
    print("⚠️ Bridge: No digital text found. Triggering High-Res PNG conversion...")
    
    # THE FIX: 3.0x zoom + Lossless PNG (No more F -> P hallucinations)
    zoom = 3.0    
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    img_bytes = pix.tobytes("png")
    encoded = base64.b64encode(img_bytes).decode('utf-8')
    
    print(f"   -> Base64 Length: {len(encoded)} characters (Bypassing 180k limit!)")
    
    print("⚡ Eyes: Transmitting to DEDICATED NVIDIA Nemotron-OCR-v1 API...")
    
    # THE FIX: Dedicated inference endpoint
    invoke_url = "https://ai.api.nvidia.com/v1/infer/nvidia/nemotron-ocr-v1"
    headers = {
        "Authorization": f"Bearer {nvidia_key}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    payload = {
        "input": [
            {
                "type": "image_url",
                "url": f"data:image/png;base64,{encoded}"
            }
        ],
        # Options: "word", "line", "paragraph"
        "merge_levels": ["line"] 
    }

    response = requests.post(invoke_url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"NVIDIA API Error: {response.status_code} - {response.text}")
        
    text_list = strip_ocr_metadata(response.json())
    clean_text = "\n".join(text_list)
    print(f"   -> Groq Payload successfully shredded to ~{len(clean_text)//4} tokens.")
    return clean_text


# --- STAGE 3: THE BRAIN (Groq Dynamic JSON Structuring) ---
def analyze_with_groq(document_text: str, groq_key: str) -> str:
    print("🧠 Brain: Structuring document data via Groq (llama-3.1-8b-instant)...")
    client = Groq(api_key=groq_key)
    
    system_prompt = """
    You are a professional document intelligence engine. 
    Analyze the provided text and convert it into a strictly structured JSON object.
    
    Schema Requirements:
    - "identified_entity": (String: The name of the person or institution)
    - "document_type": (String: e.g., Resume, Timetable, Marks Card)
    - "primary_contact": (String: Email/Phone if available, else null)
    - "extracted_data": (Array of objects. Break down skills, projects, and experience logically.)
    
    Output ONLY valid JSON. No conversational filler or formatting blocks like ```json.
    """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": document_text}
        ],
        model="llama-3.1-8b-instant",
        temperature=0.0,
        response_format={"type": "json_object"}
    )
    return chat_completion.choices[0].message.content


# --- EXECUTION ENGINE ---
if __name__ == "__main__":
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "YOUR_NVIDIA_API_KEY")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "YOUR_GROQ_API_KEY")

    LOCAL_PDF = "test.pdf"

    if "YOUR_" in NVIDIA_API_KEY or "YOUR_" in GROQ_API_KEY:
        print("❌ Error: API keys missing. Paste your real keys before running.")
    else:
        try:
            start_time = time.time()
            
            # 1. Hybrid Extraction (Digital Text OR High-Res PNG OCR)
            raw_text = extract_text_intelligently(LOCAL_PDF, NVIDIA_API_KEY)
            
            # 2. Brain Analysis
            structured_json = analyze_with_groq(raw_text, GROQ_API_KEY)
            
            end_time = time.time()
            
            print("\n✅ --- FINAL PIPELINE OUTPUT --- ✅\n")
            print(structured_json)
            print(f"\n⏱️  Telemetry: Total Pipeline Execution Time: {end_time - start_time:.2f} seconds")
            
        except Exception as e:
            print(f"\n❌ Pipeline failed: {e}")