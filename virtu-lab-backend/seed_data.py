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

if __name__ == "__main__":
    for i in range(1, 21):
        record = {
            "student_id": f"student_{i:03d}",
            "experiment": random.choice(EXPERIMENTS),
            "score": random.randint(60, 100),
            "misconception": random.choice(MISCONCEPTIONS),
            "duration_seconds": random.randint(120, 480),
            "failure_triggered": random.choice([True, False]),
        }
        try:
            r = requests.post(f"{BASE}/api/logs/record", json=record)
            if r.status_code == 200:
                print(f"✅ Record {i}: {record['student_id']} — {record['experiment']}")
            else:
                print(f"❌ Record {i}: {r.status_code} {r.text}")
        except Exception as e:
            print(f"❌ Record {i}: {e}")

    print("\nDone — 20 records seeded.")
