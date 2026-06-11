# REACH Fitness

Marketing and appointment booking platform for REACH Fitness.

## Local development

### API

```powershell
Copy-Item backend/.env.example backend/.env
python -m venv .venv
.\.venv\Scripts\python -m pip install -r backend/requirements.txt
.\.venv\Scripts\python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8001 --reload
```

### Web

```powershell
Copy-Item frontend/.env.example frontend/.env
cd frontend
cmd /c npm install
cmd /c npm run dev
```

The web app runs on `http://localhost:5173` and the API runs on
`http://localhost:8001`.

