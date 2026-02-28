from __future__ import annotations

import json
import os
from typing import TypedDict

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END

load_dotenv()


class AgentState(TypedDict):
    sim_state: dict
    misconception: str | None
    should_intervene: bool
    response: str


def detect_misconception(state: AgentState) -> dict:
    sim = state["sim_state"]
    sim_type = sim.get("experiment", sim.get("type", "")).lower()
    failure = sim.get("failureState")
    misconception: str | None = None

    if sim_type == "circuit":
        current = sim.get("current", 0)
        if failure == "OVERLOAD":
            misconception = "overload_triggered"
        elif current > 0.04 and failure is None:
            misconception = "approaching_overload"

    elif sim_type == "titration":
        ph = sim.get("pH", 7.0)
        base_volume = sim.get("baseVolume", 0)
        if failure == "OVERSHOOT":
            misconception = "endpoint_missed"
        elif ph > 7.5 and base_volume < 20 and failure is None:
            misconception = "added_too_fast"

    elif sim_type == "enzyme":
        temperature = sim.get("temperature", 37)
        if failure == "DENATURED":
            misconception = "denaturation_triggered"
        elif temperature > 55 and failure is None:
            misconception = "approaching_denaturation"

    return {"misconception": misconception}


def decide_intervention(state: AgentState) -> dict:
    return {"should_intervene": state.get("misconception") is not None}


SYSTEM_PROMPT = (
    "You are a Socratic science tutor. NEVER give the answer. "
    "Ask ONE short question (max 2 sentences) that guides the student "
    "to discover their mistake themselves. Reference the exact numbers "
    "from the simulation state. Be warm and encouraging. "
    "Respond in English only."
)


def generate_socratic_question(state: AgentState) -> dict:
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=os.getenv("GEMINI_API_KEY"),
            temperature=0.7,
        )

        user_content = (
            f"Simulation state:\n{json.dumps(state['sim_state'], indent=2)}\n\n"
            f"Detected misconception code: {state['misconception']}"
        )

        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_content),
        ]

        result = llm.invoke(messages)
        return {"response": result.content}
    except Exception:
        return {"response": ""}


def route_intervention(state: AgentState) -> str:
    return "generate" if state.get("should_intervene") else END


workflow = StateGraph(AgentState)

workflow.add_node("detect", detect_misconception)
workflow.add_node("decide", decide_intervention)
workflow.add_node("generate", generate_socratic_question)

workflow.set_entry_point("detect")
workflow.add_edge("detect", "decide")
workflow.add_conditional_edges("decide", route_intervention, {"generate": "generate", END: END})
workflow.add_edge("generate", END)
