import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import generate

load_dotenv()

app = FastAPI(title="Journi AI Service", version="0.1.0")

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(generate.router, prefix="", tags=["AI"])


@app.get("/health")
def health():
    return {"status": "ok"}
