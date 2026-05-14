"""
Stub FastAPI server.

This project (Zintta) uses Supabase as Backend-as-a-Service directly from the
React/Vite frontend via @supabase/supabase-js. There is no custom Python
backend logic. This file exists only to satisfy the supervisor configuration.
"""
from fastapi import FastAPI

app = FastAPI(title="Zintta - stub backend")


@app.get("/api/")
def root() -> dict:
    return {
        "service": "zintta-stub",
        "message": "Frontend uses Supabase directly. No backend endpoints are implemented here.",
    }


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
