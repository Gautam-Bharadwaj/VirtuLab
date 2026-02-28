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

