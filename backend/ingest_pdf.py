import os
from pypdf import PdfReader
import logging

logger = logging.getLogger(__name__)

def parse_pdf(file_path):
    """
    Reads a PDF file and returns the raw text using pypdf.
    Fast, reliable, and uses zero API calls.
    """
    try:
        reader = PdfReader(file_path)
        text = ""

        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"

        if len(text.strip()) > 50:
            logger.info(f"✅ pypdf extraction successful ({len(text)} chars)")
            return text
        else:
            logger.warning("⚠️ pypdf extraction returned very little text. Document might be an image.")
            return text if text else "Error: Could not extract meaningful text from PDF. Ensure it is a text-based PDF, not an image."

    except Exception as e:
        logger.error(f"❌ pypdf error: {e}")
        return f"Error reading PDF: {str(e)}"

if __name__ == "__main__":
    print("PDF Parser Function Ready.")