
import json
import random
from typing import Optional, Dict, List
from config import GEMINI_API_KEY

_model = None
def get_model():
    
    global _model
    if _model is not None:
        return _model
    if not GEMINI_API_KEY:
        print("⚠️  Gemini API key not set — using offline templates")
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        _model = genai.GenerativeModel("gemini-2.0-flash")
        print("✅ Gemini model loaded (gemini-2.0-flash)")
        return _model
    except Exception as e:
        print(f"⚠️  Gemini init failed: {e}")
        return None
def call_gemini(prompt: str, max_tokens: int = 300) -> Optional[str]:
    
    model = get_model()
    if not model:
        return None
    try:
        response = model.generate_content(
            prompt,
            generation_config={"max_output_tokens": max_tokens, "temperature": 0.7}
        )
        return response.text.strip() if response.text else None
    except Exception as e:
        print(f"Gemini call error: {e}")
        return None

HINT_TEMPLATES = {
    "OVERLOAD": "What happens when current exceeds the safe limit? Think about I = V/R — what made the current so high?",
    "SHORT_CIRCUIT": "What does a very low resistance do to current flow? Can you recall the relationship I = V/R?",
    "ZERO_RANGE": "Why does the projectile not travel any distance? What angle would give zero horizontal component?",
    "LARGE_ANGLE": "At very steep angles, where does most of the velocity go — horizontal or vertical?",
    "OVERSHOOT": "What happens when velocity is extremely high? Is there a practical limit in real experiments?",
    "PH_EXTREME": "You've added too much base. What happens to pH beyond the equivalence point?",
    "ENZYME_DENATURATION": "Enzymes are proteins. What happens to their 3D structure at very high temperatures?",
}

DANGER_TEMPLATES = {
    "ohm-law": "Your current is getting dangerously high. What would happen to a physical wire at this current level?",
    "projectile-motion": "The angle is getting very steep. How does this affect the horizontal vs vertical components?",
    "titration": "You're approaching the equivalence point rapidly. Why is it important to add base slowly near this point?",
    "reaction-rate": "The temperature is very high. At what point do reaction rates stop increasing with temperature?",
}

ASK_AI_TEMPLATES = {
    "ohm-law": "Think about Ohm's Law: V = IR. If you know any two of voltage, current, and resistance, you can find the third. What are you trying to achieve?",
    "projectile-motion": "The key variables are angle, velocity, range, and height. Range = v²sin(2θ)/g. What pattern do you notice?",
    "titration": "In a strong acid-strong base titration, the equivalence point is at pH 7. The curve is steepest near this point. What does that tell you?",
    "optics-bench": "The lens equation is 1/f = 1/v - 1/u. Try predicting image distance before measuring it.",
    "reaction-rate": "Reaction rate depends on temperature and concentration. Doubling temperature roughly doubles rate. Why?",
}
def generate_hint(simulation: str, trigger: str, failure_name: str = None,
                   context: dict = None, student_message: str = None) -> dict:
    

    if trigger == "failure" and failure_name:
        prompt = f

        ai_response = call_gemini(prompt, 150)
        if ai_response:
            return {"message": ai_response, "trigger": "failure", "level": 1}
        return {
            "message": HINT_TEMPLATES.get(failure_name, f"Something went wrong ({failure_name}). What caused it?"),
            "trigger": "failure", "level": 1
        }

    elif trigger == "danger_zone":
        prompt = f

        ai_response = call_gemini(prompt, 150)
        if ai_response:
            return {"message": ai_response, "trigger": "danger_zone", "level": 1}
        return {
            "message": DANGER_TEMPLATES.get(simulation, "You're approaching dangerous values. What might happen?"),
            "trigger": "danger_zone", "level": 1
        }

    elif trigger == "ask_ai":
        prompt = f"""You are a Socratic science tutor for a {simulation} virtual lab.
The student asks: "{student_message or 'Can you help me understand this experiment?'}"
Current parameters: {json.dumps(context or {})}.

Give a helpful Socratic response (max 3 sentences). Guide them with a question, 
don't give the direct answer. Relate to the current parameter values."""

        ai_response = call_gemini(prompt, 200)
        if ai_response:
            return {"message": ai_response, "trigger": "ask_ai", "level": 1}
        return {
            "message": ASK_AI_TEMPLATES.get(simulation, "Think about the relationship between your variables. What happens when you change one?"),
            "trigger": "ask_ai", "level": 1
        }

    return {"message": "Try adjusting the parameters and observe what changes.", "trigger": trigger, "level": 1}

RESULT_TEMPLATES = {
    "ohm-law": "The experiment confirms Ohm's Law: current is directly proportional to voltage and inversely proportional to resistance (I = V/R).",
    "projectile-motion": "The experiment demonstrates that maximum range occurs at 45°, consistent with R = v²sin(2θ)/g.",
    "titration": "The titration curve shows a sharp pH jump at the equivalence point, confirming stoichiometric neutralization.",
    "optics-bench": "The observations verify the thin lens equation (1/f = 1/v - 1/u).",
    "reaction-rate": "Reaction rate increases with temperature and concentration, consistent with collision theory.",
    "logic-gates": "Truth tables for all basic gates were verified, confirming Boolean algebra principles.",
    "flame-test": "Different elements produced characteristic flame colours due to electron energy transitions.",
    "periodic-table": "Periodic trends in atomic radius, ionization energy, and electronegativity were confirmed.",
    "microscope": "Higher magnification revealed finer cellular details but reduced the field of view.",
    "cell-structure": "Key organelles were identified and their functions matched theoretical descriptions.",
    "mitosis": "All stages of mitotic division were observed in sequence from prophase to cytokinesis.",
    "anatomy": "The spatial arrangement of organ systems was explored and their interconnections understood.",
}
def generate_report_result(simulation: str, observations: list, failures: list,
                            duration: int, score: int) -> str:
    
    prompt = f"""You are a science lab report writer. Write a RESULT paragraph (3-4 sentences) 
for a {simulation} experiment.

Student's observations: {json.dumps(observations[:3])}
Failures triggered: {json.dumps(failures)}
Duration: {duration}s, Score: {score}/100

Write in third person past tense ("The experiment showed..."). 
Be specific about the actual values observed. Include one key formula.
Keep it under 80 words."""

    ai_response = call_gemini(prompt, 200)
    if ai_response:
        return ai_response

    return RESULT_TEMPLATES.get(simulation, "The observations matched expected theoretical values.")

def generate_challenge(simulation: str, completed: list = None, skill_level: str = "intermediate") -> Optional[dict]:
    
    prompt = f"""Generate a physics/chemistry lab challenge for the "{simulation}" simulation.
Skill level: {skill_level}
Already completed challenge IDs: {json.dumps(completed or [])}

Return ONLY valid JSON (no markdown) with these exact keys:
{{
  "id": "unique-id",
  "title": "Short title",
  "description": "One sentence challenge description",
  "target_key": "the variable to hit (e.g. current, range, ph)",
  "target_value": 0.03,
  "target_unit": "A",
  "tolerance": 5,
  "hint": "One hint sentence",
  "proof": "Mathematical proof why the answer works",
  "fixed_params": {{"voltage": 6}},
  "compute": "inputs.voltage / inputs.resistance"
}}"""

    ai_response = call_gemini(prompt, 400)
    if ai_response:
        try:
            text = ai_response.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3]
            return json.loads(text.strip())
        except json.JSONDecodeError:
            print(f"Failed to parse Gemini challenge JSON: {ai_response[:100]}")

    return None

def generate_viva_questions(simulation: str, observations: list = None) -> Optional[List[str]]:
    
    prompt = f

    ai_response = call_gemini(prompt, 300)
    if ai_response:
        try:
            text = ai_response.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3]
            questions = json.loads(text.strip())
            if isinstance(questions, list) and len(questions) >= 3:
                return questions[:3]
        except json.JSONDecodeError:
            pass

    return None
