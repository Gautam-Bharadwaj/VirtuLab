import random
import requests

BASE = "http://localhost:8000"

EXPERIMENTS = ["circuit", "titration", "enzyme"]
MISCONCEPTIONS = [
    "approaching_overload",
    "overload_triggered",
    "added_too_fast",
    "endpoint_missed",
    "approaching_denaturation",
    "denaturation_triggered",
]

