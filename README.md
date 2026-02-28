# VirtuLab

Bridging India's practical education divide through immersive, intelligent, and accessible lab simulations — for every student, on every device, anywhere.

---

## 1. Problem Statement

### Problem Title
The Practical Education Divide — Unequal Access to Laboratory Infrastructure in Indian Higher Education

### Problem Description
India’s National Education Policy (NEP 2020) emphasizes experiential learning. However, practical infrastructure remains deeply unequal. While students at premier institutions access advanced laboratories, millions in rural or under-resourced colleges rely solely on textbooks. Practical education is reduced to theoretical memorization, and students copy lab write-ups without conducting experiments. This creates a severe gap between academic certification and real-world practical capability.

### Target Users
- **Primary:** Undergraduate students (B.Sc., B.Tech. first/second year) in rural and semi-urban colleges lacking functional labs.
- **Secondary:** Class 11–12 students preparing for board practicals.
- **Tertiary:** Teachers and faculty in under-resourced institutions needing a platform to monitor and assess practical work.

### Existing Gaps
- **Infrastructure:** Physical lab equipment is too expensive for rural colleges to procure and maintain.
- **Connectivity:** Existing high-end simulators (like Labster) require high-speed broadband and gaming PCs.
- **Pedagogical:** Free tools (like PhET) are passive calculators; they simulate but do not *teach* or guide when a student fails.
- **Language:** Lack of vernacular support for students studying in regional languages.

---

## 2. Problem Understanding & Approach

### Root Cause Analysis
The problem is a multi-layered failure: the cost of physical infrastructure, the lack of personalized pedagogical feedback during practicals, and the digital divide (bandwidth/hardware constraints). Fixing just one layer does not solve the problem for rural India.

### Solution Strategy
We approach this through a "Zero Wi-Fi Core + Wi-Fi Magic" strategy. 
1. **Infrastructure Replacement:** Build lightweight mathematical physics engines running entirely in the browser (Canvas/SVG).
2. **Access Solution:** Deliver it as an offline-first Progressive Web App (PWA) that works on a budget Android phone on a 2G network.
3. **Pedagogical Replacement:** Integrate an Agentic AI Socratic Tutor that reads the simulation state and guides the student upon failure, paired with a telemetry dashboard for teachers.

---

## 3. Proposed Solution

### Solution Overview
VirtuLab is a browser-based virtual laboratory platform where students conduct physically accurate science experiments. It operates fully offline for standard execution, but when connected to the internet, it activates a LangGraph-powered AI tutor that observes the student's actions and provides Socratic, multilingual feedback.

### Core Idea
To combine real-time computational physics with Agentic AI to create a "Lab Mentor in your Pocket" that empowers students to learn from failure, while giving teachers X-ray vision into classroom misconceptions.

### Key Features
- **Multi-Domain Simulations:** First-principles math engines for Electronics (Ohm's Law) and Chemistry (Titration).
- **Offline-First PWA:** Full simulation loops work without active internet.
- **Agentic Socratic Tutor:** AI that reads the JSON state of the simulation (not just text) to deliver personalized hints.
- **Vernacular Voice Assist:** Hints delivered via Web Speech API in Hindi, Marathi, and English.
- **Misconception Heatmap (Teacher Flex):** A real-time dashboard aggregating class-wide errors.

---

## 4. System Architecture

### High-Level Flow
User (Student) → React Frontend (PWA/Canvas) → Zustand State Store → WebSocket → FastAPI Backend (LangGraph Agent) → Gemini 1.5 Pro Model → Response → Web Speech API (Audio)

### Architecture Description
The architecture is strictly decoupled. The **Frontend (Next.js/React)** handles the visual Canvas and maintains the physical state (Voltage, Resistance, pH) using Zustand. When a failure state triggers (e.g., component overload), the frontend emits the JSON state payload to the **Backend (FastAPI)**. The backend uses LangGraph to orchestrate the decision logic, querying the **Gemini API** for a Socratic response. Simultaneously, the event log is pushed to **Supabase**, which uses Real-time subscriptions to update the Teacher Dashboard instantly.

### Architecture Diagram
*(Add system architecture diagram image here - e.g., a flowchart showing Frontend, FastAPI, Gemini, and Supabase)*

---

## 5. Database Design

### ER Diagram
*(Add ER diagram image here showing Students, Experiment_Logs, and Misconceptions tables)*

### ER Diagram Description
- **`students`**: Stores basic anonymous tracking IDs and language preferences.
- **`experiment_logs`**: The core telemetry table. Stores `student_id`, `experiment_type`, `inputs_used`, `failure_triggered`, and `timestamp`.
- **`misconception_tags`**: A reference table that categorizes raw errors into pedagogical concepts (e.g., "Polarity Confusion", "Ohm's Law Calculation Error").

---

## 6. Dataset Selected

### Dataset Name
First-Principles Physics & Chemistry Equations (Procedurally Generated Data).

### Source
Standard scientific laws (Faraday’s Law, Ohm’s Law, Logarithmic pH curves).

### Data Type
Real-time computational state data (JSON).

### Selection Reason
Simulators require absolute scientific accuracy. By utilizing hardcoded mathematical formulas rather than training a model on historical data, we guarantee zero hallucination in the physics engine. The "Dataset" is generated live by the user's interaction with the math.

### Preprocessing Steps
Simulation tick data is normalized into a standard JSON schema (`{ current_state, target_state, deviation_percentage }`) before being sent to the LLM to ensure the AI has precise context.

---

## 7. Model Selected

### Model Name
Google Gemini 1.5 Pro (via Google Gen AI SDK).

### Selection Reasoning
Gemini 1.5 Pro was selected for its massive context window and exceptional reasoning capabilities. It processes the structured JSON state of the simulation flawlessly and natively supports high-quality output in Indian vernacular languages (Hindi, Tamil), which is critical for our target demographic.

### Alternatives Considered
- *GPT-4o:* Excellent reasoning, but higher latency/cost barrier for hackathon constraints.
- *Llama 3 (Local):* Would solve offline AI constraints, but requires heavy GPU processing not possible on low-resource mobile devices.

### Evaluation Metrics
- **Socratic Compliance:** Does the model ask a question instead of giving the direct answer?
- **Context Grounding:** Does the model reference the specific numbers/state from the simulation?

---

## 8. Technology Stack

### Frontend
- Next.js (React) / Vite
- Tailwind CSS & Framer Motion (Styling & Animation)
- HTML5 Canvas & Zustand (Physics Rendering & State)
- vite-plugin-pwa (Offline Caching)

### Backend
- Node.js / Express OR FastAPI (Python)
- WebSockets (Real-time communication)

### ML/AI
- Google Gemini 1.5 Pro API
- LangGraph (Agentic Orchestration)
- Web Speech API (Browser-native TTS)

### Database
- Supabase (PostgreSQL + Real-time Subscriptions)

### Deployment
- Vercel (Frontend)
- Railway / Render (Backend)

---

## 9. API Documentation & Testing

### API Endpoints List
- **POST `/api/tutor/analyze`**: Accepts current simulation JSON state, returns Socratic hint.
- **POST `/api/logs/record`**: Pushes student failure events to the database.
- **GET `/api/teacher/heatmap`**: Fetches aggregated misconception data for the teacher dashboard.

### API Testing Screenshots
*(Add Postman / Thunder Client screenshots here showing a JSON payload sent and a Socratic response received)*

---

## 10. Module-wise Development & Deliverables

### Checkpoint 1: Research & Planning
- **Deliverables:** Finalized problem statement, selected 2 core simulations (Circuits & Titration), defined JSON state schema, and created GitHub repository.

### Checkpoint 2: Backend Development
- **Deliverables:** API server scaffolded, Gemini API keys integrated, Socratic prompt engineered, and Supabase project initialized.

### Checkpoint 3: Frontend Development
- **Deliverables:** Next.js UI shell created, Zustand state store configured, and initial HTML5 Canvas drawing logic implemented.

### Checkpoint 4: Model Training (Prompt Tuning)
- **Deliverables:** Tuned the System Prompt to enforce strict Socratic questioning and prevent the AI from giving direct answers. Configured JSON context window.

### Checkpoint 5: Model Integration
- **Deliverables:** Connected Frontend State to Backend API. Implemented Web Speech API for vernacular voice output. Built real-time Teacher Dashboard UI.

### Checkpoint 6: Deployment
- **Deliverables:** PWA manifest configured. Frontend deployed to Vercel. End-to-end testing completed.

---

## 11. End-to-End Workflow

1. Student opens the PWA URL on their smartphone; assets cache for offline use.
2. Student selects an experiment (e.g., Electronics Lab) and adjusts sliders (Voltage/Resistance).
3. The local math engine calculates the result. If parameters exceed limits, a visual "Failure State" triggers (e.g., LED overloads).
4. The React frontend packages the exact variables into a JSON object and sends it to the AI backend.
5. Gemini 1.5 Pro analyzes the JSON, identifies the physical law violated, and generates a Socratic question in the student's language.
6. The frontend displays the hint and speaks it aloud using the Web Speech API.
7. Concurrently, the failure event is synced to Supabase, instantly updating the Teacher's "Misconception Heatmap" dashboard.

---

## 12. Demo & Video

- **Live Demo Link:** *(Insert Vercel Link)*
- **Demo Video Link:** *(Insert YouTube/Drive Link)*
- **GitHub Repository:** *(Insert GitHub Link)*

---

## 13. Hackathon Deliverables Summary

- A fully functional, offline-capable Progressive Web App (PWA).
- Two interactive, math-driven lab simulations (Physics & Chemistry).
- An integrated Agentic AI Tutor providing vernacular, Socratic feedback.
- A Real-time Teacher Telemetry Dashboard mapping class-wide misconceptions.

---

## 14. Team Roles & Responsibilities

| Member Name | Role | Responsibilities |
|-------------|------|-----------------|
| *(Name 1)* | Frontend/Simulation Lead | Canvas rendering, Zustand state management, PWA config, UI/UX. |
| *(Name 2)* | AI/Backend Lead | API architecture, Gemini integration, LangGraph orchestration, Prompt tuning. |
| *(Name 3)* | Data/Integration Lead | Supabase setup, Teacher Dashboard charting, Web Speech API integration, Deployment. |

---

## 15. Future Scope & Scalability

### Short-Term
- Add "Vision-to-Sim" (AR-Lite): Allowing students to take a photo of a textbook circuit and instantly generate a digital simulation.
- Expand the lab library to cover B.Tech core mechanical and civil engineering concepts (Truss Analysis, Fluid Dynamics).

### Long-Term
- Fine-tune a smaller, open-source LLM (like Llama 3) to run entirely locally via WebGPU, removing the need for an internet connection even for the AI Tutor.
- Institutional deployment: Partnering with State Education Boards to map simulations directly to NCERT and AICTE syllabi.

---

## 16. Known Limitations

- **AI Latency:** On slow 2G networks, the Socratic AI response may experience a 1-3 second latency delay.
- **Physics Approximation:** Simulations use ideal mathematical models and currently do not account for complex real-world variables like ambient temperature or wire impurity.
- **Device Dependency:** The Web Speech API's voice quality depends entirely on the Android device's default Text-To-Speech engine.

---

## 17. Impact

- **Democratizing Education:** Provides high-end practical learning to rural students at zero marginal cost.
- **Empowering Educators:** Shifts teaching from "blind instruction" to data-driven pedagogy via the Misconception Heatmap.
- **NEP 2020 Alignment:** Directly fulfills the government's mandate for immersive, experiential, and multilingual digital education.
