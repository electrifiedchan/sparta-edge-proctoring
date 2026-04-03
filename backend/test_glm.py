import requests
import json

def extract_resume_with_nemotron(file_url: str, api_key: str) -> str:
    """
    Sends an image URL to OpenRouter's Nemotron-Nano API to extract clean Markdown.
    """
    api_endpoint = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000", # Required by OpenRouter docs
        "X-Title": "Hackathon Resume Parser" 
    }
    
    # Prompt engineering explicitly designed to force Nemotron to preserve column layouts
    payload = {
        "model": "nvidia/nemotron-nano-12b-v2-vl:free",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a precise data extraction engine. Extract all text from this document image. Preserve the logical reading order, multi-column layouts, and sections. Output ONLY clean Markdown format. Do not add any conversational filler."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": file_url
                        }
                    }
                ]
            }
        ],
        "temperature": 0.0 # Set to 0 so it extracts factually without hallucinating
    }
    
    try:
        print("Sending request to OpenRouter (Nemotron Nano VL)... Please wait.")
        response = requests.post(api_endpoint, headers=headers, json=payload)
        response.raise_for_status() 
        
        response_data = response.json()
        
        # Navigate the standard OpenAI/OpenRouter response dictionary
        markdown_text = response_data['choices'][0]['message']['content']
        return markdown_text
        
    except requests.exceptions.RequestException as e:
        # If it fails, this will print the exact reason OpenRouter rejected it
        error_msg = response.text if 'response' in locals() else 'No response from server'
        return f"API Error: {e}\nDetails: {error_msg}"

# --- TEST EXECUTION ---
if __name__ == "__main__":
    # Paste your actual OpenRouter API key here
    openrouter_key = "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"
    
    # Keeping the same test image URL to verify the pipeline works
    test_url = "https://cdn.bigmodel.cn/static/logo/introduction.png"
    
    if openrouter_key == "YOUR_OPENROUTER_API_KEY_HERE":
        print("❌ Wait! You need to paste your real OpenRouter API key into the script first.")
    else:
        print("Testing extraction...")
        result = extract_resume_with_nemotron(test_url, openrouter_key)
        
        print("\n--- EXTRACTION RESULT ---\n")
        print(result)