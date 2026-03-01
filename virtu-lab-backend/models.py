
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime
class HintRequest(BaseModel):
    simulation: str  # e.g. "ohm-law"
    trigger: str  # "failure" | "danger_zone" | "ask_ai"
    failure_name: Optional[str] = None  # e.g. "OVERLOAD"
    context: Dict[str, Any] = {}  # current param values like {"voltage": 24, "resistance": 10}
    student_message: Optional[str] = None  # student's question (for ask_ai trigger)
class HintResponse(BaseModel):
    message: str
    trigger: str
    level: int
    follow_up: Optional[str] = None
class ReportRequest(BaseModel):
    simulation: str
    observations: List[Dict[str, Any]]
    failures: List[Dict[str, str]]
    duration: int
    score: int
class ReportResponse(BaseModel):
    aim: str
    result: str
    struggles: List[str]
    viva_questions: List[str]
class ChallengeRequest(BaseModel):
    simulation: str
    completed_challenges: List[str] = []
    skill_level: Optional[str] = "intermediate"
class ChallengeResponse(BaseModel):
    id: str
    title: str
    description: str
    target_key: str
    target_value: float
    target_unit: str
    tolerance: float
    hint: str
    proof: str
    fixed_params: Dict[str, float] = {}
    compute: str
class ExperimentRecord(BaseModel):
    student_id: str
    simulation: str
    score: int
    duration: int
    mistakes: int
    failures: List[Dict[str, str]] = []
    observations: List[Dict[str, Any]] = []
    challenge_completed: Optional[str] = None
    prediction_accuracy: Optional[float] = None
    timestamp: Optional[str] = None
class StudentProgress(BaseModel):
    student_id: str
    total_experiments: int
    total_time: int
    avg_score: float
    simulations_completed: Dict[str, int]
    recent_experiments: List[Dict[str, Any]]
    strengths: List[str]
    weaknesses: List[str]
