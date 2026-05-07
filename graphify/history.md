# Project Setup History

## What has been done so far:
1. **Repository Setup**: Cloned the Sparta Edge Proctoring codebase into the root directory.
2. **Backend Configuration**: Set up Python virtual environment (env), installed equirements.txt.
3. **Frontend Configuration**: Installed UI dependencies using pnpm.
4. **Model Migration**: Project initially used Gemini limit. Transitioned to use **Groq** for AI inference.
5. **API Keys (Backend)**: Created ackend/.env with the following variables: GROQ_API_KEY, DEEPGRAM_API_KEY, NVIDIA_API_KEY.
6. **API Keys (Frontend)**: Created rontend/.env.local and added DEEPGRAM_API_KEY to support voice transcriptions securely.
7. **Documentation**: Updated README.md to reflect GROQ_API_KEY and NVIDIA_API_KEY requirements.

## Running the App
Run .\start.bat in the root folder to boot both the Python FastAPI backend on port 8000 and the Next.js frontend on port 3000.