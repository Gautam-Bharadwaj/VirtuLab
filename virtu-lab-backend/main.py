
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import FRONTEND_URL, PORT
from models import (
    HintRequest, HintResponse,
    ReportRequest, ReportResponse,
    ChallengeRequest, ChallengeResponse,
    ExperimentRecord, StudentProgress,
)
from agent import generate_hint, generate_report_result, generate_challenge, generate_viva_questions
from db import save_experiment, get_student_stats

app = FastAPI(
    title="VirtuLab API",
    description="AI-powered virtual lab backend with Socratic tutoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    
    from agent import get_model
    from db import get_client
    return {
        "status": "ok",
        "gemini": "connected" if get_model() else "offline",
        "database": "connected" if get_client() else "offline (in-memory)",
    }

@app.get("/api/simulations")
def get_simulations():
    
    return [
        {"name": "Ohm’s Law & Resistance", "subject": "Physics", "color": "bg-blue-500", "shadow": "shadow-blue-500/20", "icon": "/icon_ohm_law.png", "labKey": "ohm-law"},
        {"name": "Projectile Motion", "subject": "Physics", "color": "bg-indigo-500", "shadow": "shadow-indigo-500/20", "icon": "/icon_projectile.png", "labKey": "projectile-motion"},
        {"name": "Optics Bench", "subject": "Physics", "color": "bg-cyan-500", "shadow": "shadow-cyan-500/20", "icon": "/icon_optics.png", "labKey": "optics-bench"},
        {"name": "Logic Gates", "subject": "Physics", "color": "bg-blue-600", "shadow": "shadow-blue-600/20", "icon": "/icon_logic_gates.png", "labKey": "logic-gates"},
        {"name": "Acid-Base Titration", "subject": "Chemistry", "color": "bg-orange-500", "shadow": "shadow-orange-500/20", "icon": "/icon_titration.png", "labKey": "titration"},
        {"name": "Flame Test", "subject": "Chemistry", "color": "bg-rose-500", "shadow": "shadow-rose-500/20", "icon": "/icon_flame_test.png", "labKey": "flame-test"},
        {"name": "Periodic Table Trends", "subject": "Chemistry", "color": "bg-amber-500", "shadow": "shadow-amber-500/20", "icon": "/icon_periodic_table.png", "labKey": "periodic-table"},
        {"name": "Rate of Reaction", "subject": "Chemistry", "color": "bg-orange-600", "shadow": "shadow-orange-600/20", "icon": "/icon_reaction_rate.png", "labKey": "reaction-rate"},
        {"name": "Mitosis", "subject": "Biology", "color": "bg-green-600", "shadow": "shadow-green-600/20", "icon": "/icon_mitosis.png", "labKey": "mitosis"},
    ]

@app.post("/api/ai/hint", response_model=HintResponse)
def get_hint(req: HintRequest):
    
    result = generate_hint(
        simulation=req.simulation,
        trigger=req.trigger,
        failure_name=req.failure_name,
        context=req.context,
        student_message=req.student_message,
    )
    return HintResponse(
        message=result["message"],
        trigger=result["trigger"],
        level=result.get("level", 1),
        follow_up=result.get("follow_up"),
    )
@app.post("/api/ai/report")
def get_report(req: ReportRequest):
    
    result_text = generate_report_result(
        simulation=req.simulation,
        observations=req.observations,
        failures=[f.dict() if hasattr(f, 'dict') else f for f in req.failures],
        duration=req.duration,
        score=req.score,
    )

    viva = generate_viva_questions(req.simulation, req.observations)

    return {
        "result": result_text,
        "viva_questions": viva,
    }
@app.post("/api/ai/challenge")
def get_challenge(req: ChallengeRequest):
    
    challenge = generate_challenge(
        simulation=req.simulation,
        completed=req.completed_challenges,
        skill_level=req.skill_level,
    )
    if challenge:
        return challenge
    return {"fallback": True, "message": "Use offline challenges"}

@app.post("/api/progress/save")
def save_progress(record: ExperimentRecord):
    
    data = record.dict()
    success = save_experiment(data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save progress")
    return {"status": "saved", "student_id": record.student_id}
@app.get("/api/progress/{student_id}")
def get_progress(student_id: str):
    
    stats = get_student_stats(student_id)
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
