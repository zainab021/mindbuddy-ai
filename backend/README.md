# MindSprint AI — FastAPI Backend

A clean, beginner-friendly REST API built with Python and FastAPI.
It powers the MindSprint AI study companion app.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **FastAPI** | Web framework (fast, modern, auto-generates docs) |
| **Uvicorn** | ASGI server that runs FastAPI |
| **Pydantic** | Data validation (request/response schemas) |
| **python-dotenv** | Loads environment variables from `.env` |

---

## Folder Structure

```
backend/
├── app/
│   ├── main.py          ← FastAPI app + CORS + router registration
│   ├── config/
│   │   └── settings.py  ← Environment variable loading
│   ├── data/
│   │   └── mock.py      ← All mock data (replaces a database for now)
│   ├── routes/          ← One file per feature (auth, quiz, etc.)
│   ├── schemas/         ← Pydantic request/response models
│   ├── services/        ← Business logic (keeps routes thin)
│   └── utils/
│       └── helpers.py   ← Small helper functions (IDs, timestamps, etc.)
├── requirements.txt     ← Python packages to install
├── .env.example         ← Copy this to .env and fill in your values
└── README.md            ← You are here
```

---

## Setup — Step by Step

### 1. Make sure Python is installed

Open your terminal and run:

```bash
py --version
```

You should see `Python 3.12.x` or higher. If not, download it from [python.org](https://python.org).

---

### 2. Open the backend folder

```bash
cd d:\mindbuddy-ai\backend
```

---

### 3. Create a virtual environment

A virtual environment keeps your project's packages separate from other Python projects.

```bash
py -m venv venv
```

This creates a `venv/` folder inside `backend/`.

---

### 4. Activate the virtual environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**Mac / Linux:**
```bash
source venv/bin/activate
```

Your terminal prompt will change to show `(venv)` — that means it worked.

---

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

This installs FastAPI, Uvicorn, Pydantic, and everything else the app needs.

---

### 6. Set up environment variables

Copy the example file and rename it:

```bash
copy .env.example .env
```

Open `.env` and update the values if needed. The defaults work fine for local development.

---

### 7. Start the server

```bash
uvicorn app.main:app --reload
```

- `app.main` → the `main.py` file inside the `app/` folder
- `app` → the `FastAPI()` instance inside that file
- `--reload` → auto-restarts when you save a file (dev mode only)

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

---

## API Documentation

Once the server is running, open your browser:

| URL | Description |
|-----|-------------|
| `http://127.0.0.1:8000/docs` | **Swagger UI** — interactive, try requests directly in the browser |
| `http://127.0.0.1:8000/redoc` | **ReDoc** — clean, readable API reference |
| `http://127.0.0.1:8000/health` | Quick health check |

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/login` | Log in with email + password |
| POST | `/auth/signup` | Create a new account |
| POST | `/study/generate` | Generate AI study content |
| GET | `/flashcards` | List all flashcard decks |
| GET | `/flashcards/{deck_id}` | Get a deck with its cards |
| POST | `/flashcards` | Create a new deck |
| GET | `/quiz` | List all quizzes |
| GET | `/quiz/{quiz_id}` | Get a quiz (answers hidden) |
| POST | `/quiz/{quiz_id}/submit` | Submit answers, get result |
| GET | `/analytics` | Get full analytics dashboard data |
| GET | `/planner` | List all planner tasks |
| POST | `/planner` | Create a new task |
| PATCH | `/planner/{task_id}` | Update a task (partial) |
| DELETE | `/planner/{task_id}` | Delete a task |

---

## Connecting to the Next.js Frontend

The backend is already configured to accept requests from `http://localhost:3000` (the default Next.js dev port).

In your Next.js app, make requests to `http://127.0.0.1:8000`:

```typescript
// Example fetch from Next.js
const res = await fetch("http://127.0.0.1:8000/analytics");
const data = await res.json();
```

---

## Notes for Beginners

- **No database yet** — all data lives in memory. It resets when you restart the server. This is intentional for the first version.
- **No real auth** — tokens are random strings, not real JWTs. Passwords are stored in plain text for demo purposes. Do not deploy this to production without adding proper auth.
- **Mock data** — all responses come from `app/data/mock.py`. Edit that file to change the demo data.
- **Add a real database later** — the service layer (`app/services/`) is the right place to swap mock data for real database calls when you're ready.
