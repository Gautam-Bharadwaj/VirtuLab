
from config import SUPABASE_URL, SUPABASE_KEY
from datetime import datetime, timezone
import json

_client = None
def get_client():
    
    global _client
    if _client is not None:
        return _client
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("⚠️  Supabase not configured — running in offline mode")
        return None
    try:
        from supabase import create_client
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase connected")
        return _client
    except Exception as e:
        print(f"⚠️  Supabase connection failed: {e}")
        return None
_memory_store: dict = {"experiments": [], "students": {}}
def save_experiment(record: dict) -> bool:
    
    record["timestamp"] = record.get("timestamp") or datetime.now(timezone.utc).isoformat()
    client = get_client()
    if client:
        try:
            client.table("experiments").insert(record).execute()
            return True
        except Exception as e:
            print(f"DB save error: {e}")

    _memory_store["experiments"].append(record)
    return True
def get_student_experiments(student_id: str) -> list:
    
    client = get_client()
    if client:
        try:
            result = client.table("experiments") \
                .select("*") \
                .eq("student_id", student_id) \
                .order("timestamp", desc=True) \
                .limit(50) \
                .execute()
            return result.data or []
        except Exception as e:
            print(f"DB read error: {e}")

    return [e for e in _memory_store["experiments"] if e.get("student_id") == student_id]
def get_student_stats(student_id: str) -> dict:
    
    experiments = get_student_experiments(student_id)
    if not experiments:
        return {
            "student_id": student_id,
            "total_experiments": 0,
            "total_time": 0,
            "avg_score": 0,
            "simulations_completed": {},
            "recent_experiments": [],
            "strengths": [],
            "weaknesses": [],
        }

    total_time = sum(e.get("duration", 0) for e in experiments)
    scores = [e.get("score", 0) for e in experiments]
    avg_score = sum(scores) / len(scores) if scores else 0

    sim_counts = {}
    sim_scores = {}
    for e in experiments:
        sim = e.get("simulation", "unknown")
        sim_counts[sim] = sim_counts.get(sim, 0) + 1
        if sim not in sim_scores:
            sim_scores[sim] = []
        sim_scores[sim].append(e.get("score", 0))

    sim_averages = {s: sum(sc) / len(sc) for s, sc in sim_scores.items() if sc}
    sorted_sims = sorted(sim_averages.items(), key=lambda x: x[1], reverse=True)
    strengths = [s[0] for s in sorted_sims[:3] if s[1] >= 70]
    weaknesses = [s[0] for s in sorted_sims[-3:] if s[1] < 70]

    return {
        "student_id": student_id,
        "total_experiments": len(experiments),
        "total_time": total_time,
        "avg_score": round(avg_score, 1),
        "simulations_completed": sim_counts,
        "recent_experiments": experiments[:10],
        "strengths": strengths,
        "weaknesses": weaknesses,
    }
