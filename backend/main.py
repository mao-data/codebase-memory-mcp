import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import generate

load_dotenv()

app = FastAPI(title="Journi AI Service", version="0.1.0")

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["POST"],
    allow_headers=["Content-Type", "X-Backend-Token"],
    allow_credentials=False,
)

app.include_router(generate.router, prefix="", tags=["AI"])


@app.get("/health")
def health():
    return {"status": "ok"}
