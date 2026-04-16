# How to Run the App manually

If you prefer to start the backend and frontend manually instead of using `start.bat`, follow these steps:

### 1. Start the Backend

1. Open a new terminal.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Activate the virtual environment:
   ```bash
   venv\Scripts\activate
   ```
4. Run the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   *The backend will now be running on `http://localhost:8000`.*

### 2. Start the Frontend

1. Open a **second** new terminal.
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Start the Next.js development server:
   ```bash
   pnpm dev
   ```
   *(If you are using npm or yarn, you can use `npm run dev` or `yarn dev` instead).*
4. The frontend will build and run.

### 3. Open the App in Your Browser

1. Open your web browser.
2. Go to [http://localhost:3000](http://localhost:3000)

---

## Using `start.bat`

We've modified the existing `start.bat` script in the root directory to handle all of this for you automatically.

Simply double-click **`start.bat`**, and it will:
1. Verify that your dependencies are installed.
2. Open a terminal instance for the Python Backend (activating your venv automatically).
3. Open a terminal instance for the Next.js Frontend.
4. **Automatically open `http://localhost:3000`** in your default web browser once everything is ready.
