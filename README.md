# 🧪 VirtuLab

VirtuLab is a next-generation virtual science laboratory platform that combines high-fidelity 3D simulations with real-time AI mentoring.

---

## 🛠️ VirtuLab Tech Stack

### Frontend (The Experience)
- **Framework**: React (Vite) — For rapid development and lightning-fast loading.
- **3D Engine**: Three.js (+ React Three Fiber) — For immersive 3D lab models and environments.
- **Physics Engine**: Rapier (WASM) — Real-time science calculations (e.g., Faraday's Law).
- **State Management**: Zustand — Managing Voltage, Mass, and AI communication states.
- **Styling**: Tailwind CSS — Modern UI with glassmorphism effects.
- **Deployment**: Vercel

### Backend (The Intelligence)
- **API Framework**: FastAPI (Python) — Fast communication via WebSockets.
- **AI Agent Logic**: LangGraph — Analyzing student mistakes and providing Socratic feedback.
- **LLM**: Gemini 1.5 Pro — AI Mentor reasoning and natural language interaction.
- **Database**: Supabase (PostgreSQL) — Storing student logs and teacher analytics.
- **Deployment**: Railway

---

## 🔄 Workflow Diagram

```mermaid
graph TD
    Student([Student/User]) --> UI[React + Vite Frontend]
    UI --> Lab3D[3D Simulation Three.js/Rapier]
    UI --> State[Zustand State Management]
    
    State <-- WebSocket --> API[FastAPI Backend]
    
    subgraph "AI Intelligence Layer"
        API --> Agent[LangGraph Agent]
        Agent <--> Gemini[Gemini 1.5 Pro]
    end
    
    subgraph "Data Layer"
        Agent --> DB[(Supabase / PostgreSQL)]
        API --> DB
    end
    
    Agent -- "Socratic Feedback" --> State
    State -- "Update Visuals" --> Lab3D
```

---

## 📁 Project Structure

```text
virtu-lab/
├── virtu-lab-frontend/        # Frontend code
│   ├── src/
│   │   ├── components/        # 3D Beaker, Chat box, Sliders
│   │   ├── store/             # Zustand (Mass aur Voltage data)
│   │   ├── hooks/             # WebSocket connectivity
│   │   └── pages/             # Student Lab aur Teacher Dashboard
│   └── vite.config.js
│
└── virtu-lab-backend/         # Backend code
    ├── main.py                # FastAPI aur WebSockets logic
    ├── agent.py               # LangGraph AI logic
    ├── database.py            # Supabase connection
    └── requirements.txt       # Python libraries list
```
