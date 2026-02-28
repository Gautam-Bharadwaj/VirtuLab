import asyncio
import base64
import json
import os
import re

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client
from google import genai

from agent import socratic_agent

load_dotenv()

genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    sim_state: dict
    student_id: str


class VisionRequest(BaseModel):
    image_base64: str


@app.get("/health")
def health():
    return {"status": "ok", "message": "VirtuLab Backend Running"}


@app.post("/api/tutor/analyze")
async def analyze(req: AnalyzeRequest):
    try:
        result = await asyncio.to_thread(
            socratic_agent.invoke,
            {
                "sim_state": req.sim_state,
