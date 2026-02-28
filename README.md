# VirtuLab

Bridging India's practical education divide through immersive, intelligent, and accessible lab simulations — for every student, on every device, anywhere.

---

## 1. Problem Statement

### Problem Title

The Practical Education Divide — Unequal Access to Laboratory Infrastructure in Indian Higher Education

### Problem Description

India’s National Education Policy (NEP 2020) emphasizes experiential learning. However, practical infrastructure remains deeply unequal. Students at premier institutions access advanced laboratories and simulation tools, while millions of students in rural or under-resourced colleges rely solely on textbooks. Practical education is often reduced to theoretical memorization, and students copy lab write-ups without conducting experiments. This creates a severe gap between academic certification and real-world practical capability.

### Target Users

- Undergraduate students (B.Sc., B.Tech. first/second year) in rural and semi-urban colleges lacking functional labs.
- Class 11–12 students (CBSE/State boards) preparing for board practicals without access to functional school labs.
- Teachers and faculty in under-resourced institutions who need a platform to assign, monitor, and assess practical work.

### Existing Gaps

- **Infrastructure:** Physical lab equipment is too expensive to procure, maintain, and replace.
- **Connectivity:** Existing high-end digital simulators require high-speed internet and powerful hardware.
- **Pedagogical:** Current free tools are passive—they simulate but do not adaptively teach or guide a student when they make a mistake.
- **Language:** No major platform offers vernacular language guidance for regional Indian students.

---

## 2. Problem Understanding & Approach

### Root Cause Analysis

The problem is a multi-layered failure: physical infrastructure is unaffordable, pedagogical feedback is missing during self-study, and existing digital solutions ignore the bandwidth constraints of rural India. Fixing just one layer does not solve the core issue.

### Solution Strategy

We attack all layers simultaneously using a **"Hybrid Offline-First"** approach:

1. **Infrastructure Replacement:** Build lightweight mathematical science engines running entirely in the browser (Canvas/SVG).
2. **Access Solution:** Deliver it as an offline-first Progressive Web App (PWA) that works on budget Android phones on 2G networks.
3. **Pedagogical Replacement:** Implement a dual-mode Socratic Tutor (Local Rules for offline + Agentic AI for online) that observes student actions and guides them through failures.

---

## 3. Proposed Solution

### Solution Overview

VirtuLab is a browser-based virtual laboratory platform where students conduct physically accurate science experiments. It operates fully offline for standard execution and local hints, but when connected to the internet, it activates a LangGraph-powered AI tutor that observes the student's actions and provides dynamic, multilingual textual feedback.

### Core Idea

To combine real-time computational physics with a Hybrid Intelligence System (Local Rules + Cloud AI) to create a "Lab Mentor in your Pocket" that works anywhere, while giving teachers real-time telemetry into classroom misconceptions.

### Key Features

- **Multi-Domain Simulation Suite:**
  1. **The Circuit Forge (Physics/Electronics):** Simulates Ohm's Law and component overload. _(Target: Class 10-12, B.Tech 1st Year)_
  2. **The Color-Shift Titration Bench (Chemistry):** Simulates pH curves and acid-base neutralization. _(Target: Class 11-12, B.Sc. Chemistry)_
  3. **The Kinetic Enzyme Reactor (Biology):** Simulates Michaelis-Menten kinetics and protein denaturation via temperature/pH. _(Target: Class 12, B.Sc. Biology/Biotech)_
  4. **The Precision Soil Lab (Agronomy):** Simulates N-P-K fertilizer balancing for crop yield. _(Target: B.Sc. Agriculture, Rural Polytechnics)_
- **Offline-First PWA:** Full simulation loops and mathematical engines work 100% without internet.
- **Hybrid Socratic Tutor:** AI that reads the JSON state of the simulation to deliver personalized, Socratic text hints (Local JSON fallback when offline; Gemini 1.5 Pro when online).
- **Misconception Heatmap (Teacher Flex):** A live dashboard aggregating class-wide errors.
- **Student Diagnostic Dashboard:** A post-lab "Skill Radar" visualizing student growth.

---

## 4. System Architecture

### High-Level Flow

User (Student) → React Frontend (PWA/Canvas) → Zustand State Store → Local Logic (Offline) OR FastAPI Backend (Online) → Gemini 1.5 Pro Model → React UI (Text Hint) → Supabase (Teacher Dashboard Sync)

### Architecture Description

The architecture is strictly decoupled. The **Frontend (Next.js/React)** handles the visual Canvas and maintains the scientific state (Voltage, pH, Temp) using **Zustand**. When a failure state triggers (e.g., enzyme denaturation), a local Socratic engine pulls a cached hint. If online, the frontend emits the JSON state payload to the **Backend (FastAPI)**. The backend uses **LangGraph** to orchestrate a **Gemini API** call for advanced Socratic response. Simultaneously, the event log is pushed to **Supabase**, updating the Teacher Dashboard via Real-time subscriptions.

### Architecture Diagram

_(Add system architecture diagram image here - e.g., a flowchart showing Frontend PWA, FastAPI, Gemini, and Supabase)_

---

## 5. Database Design

### ER Diagram

_(Add ER diagram image here showing Students, Experiment_Logs, and Misconception_Tags tables)_

### ER Diagram Description

- **`students`**: Stores anonymous tracking IDs and language preferences.
- **`experiment_logs`**: The core telemetry table. Stores `student_id`, `experiment_type`, `inputs_used`, `failure_triggered`, and `timestamp`.
- **`misconception_tags`**: A reference table that categorizes raw errors into pedagogical concepts (e.g., "Polarity Confusion", "Denaturation Error").

---

## 6. Dataset Selected

### Dataset Name

Procedural Science Laws & Socratic Decision Tree.

### Source

Derived from first-principles science: Ohm's Law, Faraday's Law, Logarithmic pH curves, and Michaelis-Menten equations.

### Data Type

Real-time computational state data (JSON).

### Selection Reason

Simulators require absolute scientific accuracy. By utilizing hardcoded mathematical formulas rather than training a model on historical data, we guarantee zero hallucination in the scientific engines.

### Preprocessing Steps

Simulation tick data is normalized into a standard JSON schema (`{ current_state, target_state, error_code }`) before being evaluated by the Local Logic or sent to the LLM to ensure precise context.

---

## 7. Model Selected

### Model Name

Google Gemini 1.5 Pro (Online) + Local Rule-Based Decision Logic (Offline).

### Selection Reasoning

Gemini 1.5 Pro provides exceptional reasoning capabilities and a massive context window to analyze complex JSON simulation states. It natively supports high-quality text output in Indian vernacular languages. To satisfy the offline requirement, we use a Local Decision Engine as a fallback to ensure the "Mentor" never disappears.

### Alternatives Considered

- _GPT-4o:_ Excellent reasoning, but higher latency/cost barrier for hackathon constraints.
- _Llama 3 (Local):_ Would solve offline AI constraints perfectly, but requires heavy GPU processing impossible on budget smartphones.

### Evaluation Metrics

- **Socratic Compliance:** Does the model ask a question instead of giving the direct answer?
- **Context Grounding:** Does the model reference the specific numbers from the simulation?

---

## 8. Technology Stack

### Frontend

- Next.js (React) / Vite
- Tailwind CSS & Framer Motion (Styling & Animation)
- HTML5 Canvas & Zustand (Physics Rendering & State)
- vite-plugin-pwa (Offline Caching)
- Recharts (Data Visualization)

### Backend

- FastAPI (Python) / Node.js
- WebSockets / REST API

### ML/AI

- Google Gemini 1.5 Pro API
- LangGraph (Agentic Orchestration)

### Database

- Supabase (PostgreSQL + Real-time Subscriptions)

### Deployment

- Vercel (Frontend)
- Railway / Render (Backend)

---

## 9. API Documentation & Testing

### API Endpoints List

- **POST `/api/tutor/analyze`**: Accepts current simulation JSON state, returns an advanced Socratic hint via Gemini.
- **POST `/api/logs/record`**: Pushes student failure events to the database (syncs automatically when online).
- **GET `/api/teacher/heatmap`**: Fetches aggregated misconception data for the Recharts dashboard.

### API Testing Screenshots

_(Add Postman / Thunder Client screenshots here showing a JSON payload sent and a Socratic response received)_

---

## 10. Module-wise Development & Deliverables

### Checkpoint 1: Research & Planning

- **Deliverables:** Finalized mathematical formulas for the 4 core simulators, defined JSON state schemas, mapped the `hints.json` offline decision tree, and created GitHub repository.

### Checkpoint 2: Backend Development

- **Deliverables:** API server scaffolded, Gemini API integrated with LangGraph, and Supabase project initialized with tables.

### Checkpoint 3: Frontend Development

- **Deliverables:** Next.js UI shell created, Zustand state store configured, and initial HTML5 Canvas drawing logic implemented for the simulators.

### Checkpoint 4: Model Training & Prompting

- **Deliverables:** Tuned the Gemini System Prompt to enforce strict Socratic questioning. Validated the Local Offline Engine logic.

### Checkpoint 5: Model Integration

- **Deliverables:** Connected Frontend State to Backend API. Built the Teacher Misconception Dashboard and Student Skill Radar charts.

### Checkpoint 6: Deployment

- **Deliverables:** PWA manifest configured and Service Workers active. Frontend deployed to Vercel. End-to-end testing completed in Airplane Mode.

---

## 11. End-to-End Workflow

1. Student opens the PWA URL on their smartphone; all math engines and the `hints.json` file cache for offline use.
2. Student selects an experiment (e.g., Enzyme Kinetics) and adjusts variables (Temperature/pH).
3. The local math engine calculates the result. If parameters exceed limits (e.g., Temp = 90°C), a visual "Failure State" triggers (Enzyme denatures).
4. **Offline Path:** The Local Engine reads the failure and instantly displays a cached Socratic text hint.
5. **Online Path:** If Wi-Fi is active, the React frontend packages the variables into JSON and sends it to the FastAPI backend. Gemini 1.5 Pro analyzes the data and generates a highly specific, context-aware Socratic question.
6. The frontend displays the hint in the student's chosen language.
7. Concurrently, the failure event is synced to Supabase, instantly updating the Teacher's "Misconception Heatmap" dashboard.

---

## 12. Demo & Video

- **Live Demo Link:** _(Insert Vercel Link)_
- **Demo Video Link:** _(Insert YouTube/Drive Link)_
- **GitHub Repository:** _(Insert GitHub Link)_

---

## 13. Hackathon Deliverables Summary

- A fully functional, offline-capable Progressive Web App (PWA).
- Four interactive, math-driven lab simulations spanning Physics, Chemistry, Biology, and Agronomy.
- A Hybrid AI Tutor providing Socratic textual feedback (Local Rules + Cloud AI).
- A Real-time Teacher Telemetry Dashboard mapping class-wide misconceptions.
- A Student Diagnostic Dashboard featuring a Skill Radar and Error Timeline.

---

## 14. Team Roles & Responsibilities

| Member Name  | Role & Difficulty Level                                | Responsibilities                                                                                                                                                                                   |
| ------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ayush**    | **Simulation & Agent Architect (High Difficulty)**     | Writing the core mathematical science engines (Physics/Chem/Bio) in JS. Managing Zustand state, defining Failure States, and architecting the LangGraph Socratic logic and Gemini prompts.         |
| **Member 2** | **Infrastructure & API Lead (Medium-High Difficulty)** | Setting up FastAPI/Node backend, managing Supabase schema and REST endpoints. Configuring `vite-plugin-pwa` Service Workers to ensure the offline fallback logic works flawlessly.                 |
| **Member 3** | **Frontend & Analytics Lead (Medium Difficulty)**      | Building the responsive Next.js UI shell. Integrating Recharts to build the Teacher Misconception Dashboard and the Student Skill Radar. Connecting frontend charts to live Supabase data streams. |

---

## 15. Future Scope & Scalability

### Short-Term

- **Vision-to-Sim (AR-Lite):** Using Gemini Vision to allow students to take a photo of a textbook circuit diagram and instantly generate a digital, interactive simulation of that exact circuit.
- Expand the library to cover B.Tech core mechanical engineering concepts (e.g., Fluid Dynamics, Thermodynamics).

### Long-Term

- Fine-tune a smaller, open-source SLM (Small Language Model like Llama-3-8B) to run locally via WebGPU, enabling dynamic AI generation completely offline.
- Institutional deployment: Partnering with State Education Boards to map simulations directly to NCERT and AICTE syllabi.

---

## 16. Known Limitations

- **Offline AI Limitation:** While the simulations run 100% offline, the Socratic hints provided in offline mode are pulled from a static decision tree. Dynamic, conversational generation requires an internet connection to reach the Gemini API.
- **Physics Approximation:** Simulations use ideal mathematical models and currently do not account for complex real-world variables like ambient humidity or wire impurities.
- **Sync Latency:** The Teacher Dashboard only updates when the student's device re-establishes an active internet connection to flush the local logs.

---

## 17. Impact

- **Democratizing Education:** Provides high-end practical learning and scientific intuition to rural students at zero marginal cost.
- **Empowering Educators:** Shifts teaching from "blind instruction" to data-driven pedagogy via the Misconception Heatmap.
- **NEP 2020 Alignment:** Directly fulfills the government's mandate for immersive, experiential, and equitable digital education infrastructure.
