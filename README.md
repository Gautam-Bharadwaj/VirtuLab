VirtuLab — AI-Powered Virtual Science Laboratory
Bridging India's practical education divide through immersive, intelligent, and accessible lab simulations — for every student, on every device, anywhere.
1. Problem Statement
Problem Title
The Practical Education Divide — Unequal Access to Laboratory Infrastructure in Indian Higher Education

Problem Description
India's National Education Policy (NEP 2020) places significant emphasis on experiential and hands-on learning. However, a deep and persistent infrastructure gap exists between premier institutions (IITs, NITs, central universities) and the thousands of rural and semi-urban colleges that serve the majority of India's 40+ million higher education students.
Science and engineering education — Physics, Chemistry, Electronics — fundamentally require hands-on experimentation to build intuition. Without practical exposure, students can memorize formulas but cannot develop the applied understanding needed for real-world problem solving, competitive exams, or careers in STEM. A student who has never conducted an electrolysis experiment cannot truly understand Faraday's Laws, regardless of how many times they've read the textbook chapter.

Target Users
Primary: Undergraduate students (B.Sc., B.Tech. first/second year) in rural and semi-urban colleges across India lacking functional laboratory infrastructure
Secondary: Class 11–12 students (CBSE/State boards) preparing for board practicals without access to functional school labs
Tertiary: Teachers and faculty in under-resourced institutions who need a platform to assign, monitor, and assess practical work
Existing Gaps
GapCurrent RealityAccessLab simulation tools like Labster, PhET cost $10–$20/month per student — unaffordable at scale in IndiaConnectivityMost existing platforms require high-speed internet and powerful hardwareLanguageNo platform offers vernacular language (Hindi, Tamil, Telugu) guidance for Indian studentsIntelligenceExisting tools are passive — they simulate but don't teach. No adaptive feedback, no misconception detectionIntegrationNo platform connects student experiment data to teacher dashboards for real-time class-wide insight2. Problem Understanding & Approach
Root Cause Analysis
The problem is not simply a lack of physical labs — it is a three-layered failure:

Infrastructure Layer: Physical lab equipment is expensive to procure, maintain, and replace. Rural colleges cannot sustain this investment on limited UGC grants.
Pedagogical Layer: Even where labs exist, there is often no structured feedback mechanism. Students complete experiments mechanically without understanding why results deviate from expected values.
Technology Access Layer: Existing digital alternatives assume broadband internet, modern laptops, and English proficiency — assumptions that fail for the majority of India's college-going population.
Solution Strategy
VirtuLab attacks all three layers simultaneously:

Replace the infrastructure with a browser-based physics engine (WebAssembly) that simulates real experiments with scientific accuracy — no hardware needed
Replace the absent teacher with an agentic AI tutor that observes the student's every action in the simulation and uses the Socratic method to build intuition, not just provide answers
Remove the access barrier by building a Progressive Web App (PWA) that works on a ₹8,000 Android phone, on a 2G connection, fully offline after the first load — accessible via a URL, no app store required
3. Proposed Solution
Solution Overview
VirtuLab is a browser-based virtual laboratory platform where students can conduct physically accurate science experiments in an immersive 3D/2D environment, guided in real time by an agentic AI tutor that reads the simulation state — not just the student's text — and asks Socratic questions to drive self-discovery. Teachers get a live analytics dashboard showing exactly where their students struggle.

Core Idea
"What if every student in India had access to a world-class laboratory and a personal science tutor — simultaneously — from a basic Android phone?"
The core innovation is the fusion of three systems that individually exist but have never been combined at this level:

A scientifically accurate physics simulation running as WebAssembly in the browser (no server round-trip for physics)
An agentic AI that reads simulation state as structured data every 500ms and intervenes intelligently using LangGraph
A radical accessibility layer (PWA + offline cache + multilingual voice) that makes this viable for the actual target population
Key Features
🔬 Simulation Engine
Electrolysis of Copper Sulfate (Chemistry): Real-time electrode mass changes calculated using Faraday's Second Law (m = MIT/nF), animated ion migration particle system, solution color shift based on ion concentration, dynamic bubble formation physics — all rendered in 3D via React Three Fiber and Rapier WebAssembly physics
Ohm's Law & Series/Parallel Circuits (Physics): Interactive drag-and-drop circuit builder, animated electron flow with speed proportional to current, bulb brightness physically mapped to power dissipation, live ammeter and voltmeter readouts — rendered in 2D via PixiJS WebGL
🤖 Agentic AI Lab Assistant (Socratic Tutor)
Reads a structured JSON snapshot of the full simulation state every 500ms via WebSocket
Detects specific misconceptions (electrode polarity confusion, voltage out of safe range, mass deviation >5% from expected) using a rule-based pre-filter before invoking the LLM
Runs a LangGraph stateful agent graph: analyze_state → decide_intervention → formulate_socratic_question
Never gives the direct answer. Always asks one guiding question referencing specific numbers from the simulation
Speaks the question aloud in the student's chosen language (Hindi, Tamil, English) via Web Speech API — zero extra cost, works offline
📊 Teacher Analytics Dashboard
Live class-wide view of all student experiment sessions via Supabase Realtime subscriptions
Per-student score, deviation percentage, misconceptions triggered, and time taken
Aggregated "most common mistake" card — instantly tells a teacher where the entire class is going wrong
Accessible at /teacher — shareable URL, no separate app needed
📱 Radical Accessibility
Progressive Web App: Installable on Android home screen from Chrome — no app store, no account required
Offline-capable: Physics engine (WASM) and UI cached via Workbox service worker after first load
Low-bandwidth optimized: Critical JS bundle under 200KB, assets lazy-loaded, works on 2G/3G
Multilingual voice output: Web Speech API with hi-IN, ta-IN, en-IN locale support
4. System Architecture
High-Level Flow
Student (Browser / PWA)
        │
        ▼
React Frontend (Vite + R3F + PixiJS)
        │                    │
        │ WebSocket           │ REST
        ▼                    ▼
FastAPI Backend ──────► Supabase (Postgres)
        │                    ▲
        ▼                    │
LangGraph Agent         Realtime Sub
        │                    │
        ▼                    ▼
Gemini 1.5 Pro API    Teacher Dashboard
        │
        ▼
Socratic Question → WebSocket → Student UI → Web Speech API → 🔊 Voice
Architecture Description
Frontend (Client-Side):
The React frontend is split into two rendering contexts. The 3D electrolysis lab uses React Three Fiber (declarative Three.js) with the Rapier physics engine compiled to WebAssembly — all physics calculations run in a Web Worker, keeping the UI thread at 60fps. The 2D circuit lab uses PixiJS v8 (WebGL renderer) for high-performance animated sprite rendering. Global simulation state is managed by Zustand, which serializes a state snapshot every 2 seconds and emits it to the backend WebSocket. The app is configured as a PWA via vite-plugin-pwa with Workbox, enabling full offline capability after the first visit.
Backend (AI & Data Layer):
A FastAPI server handles two concerns: (1) a persistent WebSocket endpoint per student session that feeds simulation state into the LangGraph Socratic agent, and (2) REST endpoints for logging completed experiment sessions and serving analytics data. The LangGraph agent runs as a stateful graph — it first applies fast rule-based misconception detection (no LLM call needed for obvious errors), then decides whether to intervene based on severity and time since last intervention, and finally calls Gemini 1.5 Pro to formulate a context-aware Socratic question. Conversation history per student is stored in Upstash Redis (serverless, low-latency).
Database:
Supabase (managed Postgres) stores completed experiment logs with full metadata. The Teacher Dashboard subscribes to the experiment_logs table via Supabase Realtime, so new student results appear live without polling.
Deployment:
Frontend on Vercel (global CDN, auto-deploy from GitHub). Backend on Railway (Dockerized FastAPI, auto-scaled). Static 3D assets (GLTF models) on Cloudflare R2 (free egress).

Architecture Diagram
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser / PWA)                │
│  ┌──────────────────┐    ┌──────────────────────────────┐   │
│  │  3D Lab (R3F +   │    │  2D Circuit Lab (PixiJS       │   │
│  │  Rapier WASM)    │    │  WebGL)                       │   │
│  └────────┬─────────┘    └──────────────┬───────────────┘   │
│           └──────────┬───────────────────┘                   │
│                 ┌────▼─────┐                                  │
│                 │  Zustand │  (Shared simulation state)       │
│                 └────┬─────┘                                  │
│           ┌──────────▼──────────┐                            │
│           │  useLabSocket Hook  │  (WebSocket + REST calls)  │
│           └──────────┬──────────┘                            │
└──────────────────────┼──────────────────────────────────────┘
                       │ WebSocket (wss://)
┌──────────────────────▼──────────────────────────────────────┐
│                    FASTAPI BACKEND (Railway)                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              LangGraph Socratic Agent                │    │
│  │  analyze_state → decide_intervention → formulate_q  │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │ API Call                           │
│              ┌──────────▼──────────┐                        │
│              │  Gemini 1.5 Pro API │                        │
│              └──────────┬──────────┘                        │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  POST /api/log-experiment   GET /api/analytics       │    │
│  └──────────────────────┬──────────────────────────────┘    │
└─────────────────────────┼───────────────────────────────────┘
                          │ Supabase Client
┌─────────────────────────▼───────────────────────────────────┐
│                  SUPABASE (Postgres + Realtime)               │
│   experiment_logs table ──► Realtime Channel ──► Teacher UI  │
└─────────────────────────────────────────────────────────────┘
5. Database Design
ER Diagram
┌──────────────────────────────┐         ┌──────────────────────────────┐
│          students             │         │       experiment_logs         │
├──────────────────────────────┤         ├──────────────────────────────┤
│ id (uuid) PK                 │◄────────│ student_id (text) FK         │
│ name (text)                  │  1    N │ id (uuid) PK                 │
│ college (text)               │         │ experiment (text)             │
│ language_pref (text)         │         │ final_voltage (float)        │
│ created_at (timestamp)       │         │ final_current (float)        │
└──────────────────────────────┘         │ anode_mass_final (float)     │
                                         │ cathode_mass_final (float)   │
┌──────────────────────────────┐         │ expected_cathode_mass (float)│
│       misconception_types    │         │ deviation_percent (float)    │
├──────────────────────────────┤         │ duration_seconds (int)       │
│ id (uuid) PK                 │         │ misconceptions_triggered     │
│ code (text) UNIQUE           │◄────────│   (text[])                   │
│ label (text)                 │  ref    │ score (int)                  │
│ experiment (text)            │         │ created_at (timestamp)       │
│ description (text)           │         └──────────────────────────────┘
└──────────────────────────────┘
ER Diagram Description
The database has three core entities:

students — Stores basic student identity and language preference. Linked to all their experiment sessions. In the MVP, student_id is generated client-side (UUID) and stored in localStorage; a full auth system is future scope.
experiment_logs — The primary data table. Each row represents one completed experiment session with full quantitative results: the voltages and currents used, final measured masses vs. Faraday-predicted masses, percentage deviation, total time taken, an array of misconception codes triggered during the session, and a computed score (0–100) based on accuracy and efficiency.
misconception_types — A reference/lookup table for all known misconception codes (e.g., polarity_confusion, voltage_too_high, mass_calculation_error). Allows the teacher dashboard to display human-readable labels and experiment-specific descriptions without hardcoding strings in the frontend.
6. Dataset Selected
Dataset Name
Faraday Electrolysis Reference Dataset + Ohm's Law Circuit Reference Values (Synthetically generated from first-principles physics)

Source
No external dataset is required. All simulation ground truth is derived directly from established physics laws:

Faraday's Second Law of Electrolysis: m = (M × I × t) / (n × F) where M = molar mass of copper (63.5 g/mol), F = Faraday constant (96,485 C/mol), n = valency (2)
Ohm's Law: V = IR, P = I²R, I_series = V_total / R_total, I_parallel = V / R_individual
Data Type
Computed numerical data (real-time per-frame calculation), stored as time-series experiment session logs in Supabase.

Selection Reason
Using real physics equations as the data source ensures:

Scientific accuracy — outputs are provably correct, not approximated from a trained model
Zero data licensing concerns — first-principles physics equations are in the public domain
Real-time adaptability — any voltage/current/time combination yields the exact correct expected mass, enabling precise deviation calculation for any student action
Preprocessing Steps
Physics constants (M, F, n for copper sulfate electrolysis) are hardcoded as configuration in the simulation store
Every simulation tick (1 second), the tick() function in Zustand computes the incremental mass change and accumulates it
On experiment completion, deviation percentage is computed as |actual - expected| / expected × 100
The final session object is POSTed to /api/log-experiment for persistence and analytics aggregation
7. Model Selected
Model Name
Google Gemini 1.5 Pro (via langchain-google-genai Python package)

Selection Reasoning
Gemini 1.5 Pro was selected over alternatives for the following specific reasons:
CriteriaGemini 1.5 ProReason It Wins HereContext Window1,000,000 tokensCan hold full experiment session history + simulation state in a single callLatency~800ms–1.2s for short outputsFast enough for near-real-time Socratic interventionCostFree tier via AI Studio APICritical for a hackathon; scales cheaply post-demoMultilingualStrong Hindi, Tamil, Bengali supportCore requirement for Indian student accessibilityStructured inputHandles JSON simulation state nativelyNo special parsing needed to pass physics data as contextThe model is not used for physics calculation. It is used only for natural language generation of Socratic questions, given a structured context of what the student did wrong and what the correct physics predicts.

Alternatives Considered
GPT-4o (OpenAI): Superior general reasoning but higher cost, no free tier, and slightly worse multilingual support for Indian languages
Claude 3.5 Sonnet (Anthropic): Excellent for code and reasoning but API access requires paid tier; less accessible for hackathon budget
Llama 3 (Meta, self-hosted): Free but requires GPU inference server — not deployable in 24 hours without significant DevOps overhead
Gemini 1.5 Flash: Considered as primary for lower latency, but 1.5 Pro's stronger reasoning produces noticeably better Socratic questions in testing
Evaluation Metrics
The AI tutor is evaluated on three qualitative dimensions during testing:
MetricDescriptionTest MethodSocratic ComplianceDid the model ask a question instead of giving the answer?Manual review of 20 simulated misconception scenariosState GroundingDid the response reference specific numbers from the simulation JSON?Check for numeric values from sim state appearing in responseLanguage AccuracyIs the Hindi/Tamil output grammatically correct and naturally phrased?Native speaker review8. Technology Stack
Frontend
TechnologyVersionPurposeReact18.xComponent frameworkVite5.xBuild tool, HMR, bundle optimizationReact Three Fiber8.xDeclarative Three.js for 3D chemistry lab@react-three/drei9.xR3F helpers: Environment, Float, Text3D, Loader@react-three/rapier1.xRapier WASM physics engine for bubble simulationPixiJS8.xWebGL 2D renderer for circuit labZustand4.xLightweight global state (simulation store)Tailwind CSS3.xUtility-first stylingshadcn/uiLatestPre-built accessible UI componentsFramer Motion11.xAnimations for modals and transitionsReact Router DOM6.xClient-side routing (Lab / Teacher views)@supabase/supabase-js2.xSupabase client for Realtime dashboardvite-plugin-pwa + WorkboxLatestService worker, offline caching, PWA manifestreact-joyride2.xOnboarding tooltip tourBackend
TechnologyVersionPurposePython3.11+RuntimeFastAPI0.111+Async REST + WebSocket serverUvicorn0.29+ASGI serverLangGraph0.1+Stateful agentic AI graph (Socratic agent)LangChain Google GenAI1.xGemini 1.5 Pro integrationupstash-redis0.15+Serverless Redis for conversation historysupabase-py2.xServer-side Supabase client for loggingpython-dotenv1.xEnvironment variable managementML/AI
TechnologyPurposeGoogle Gemini 1.5 ProSocratic question generation (NLG)LangGraph StateGraphAgentic decision graph (observe → decide → formulate)Rule-based Misconception EngineFast pre-filter for common errors (no LLM call needed)Web Speech API (browser-native)Multilingual TTS — zero cost, zero latency, offline-capableDatabase
TechnologyPurposeSupabase (Postgres)Experiment session logs, analyticsSupabase RealtimeLive teacher dashboard subscriptionsUpstash RedisPer-student conversation history (session-scoped)Deployment
TechnologyPurposeVercelFrontend hosting (global CDN, auto-deploy from GitHub)RailwayFastAPI backend (Dockerized, auto-scaled)Cloudflare R23D model asset storage (GLTF files, free egress)GitHub ActionsCI/CD pipeline9. API Documentation & Testing
API Endpoints List
REST Endpoints:

GET /health
Description: Health check
Response: {"status": "ok", "message": "VirtuLab AI Backend Running"}
POST /api/log-experiment
Description: Log a completed experiment session to Supabase
Request Body:{  "student_id": "s_abc123",  "experiment": "electrolysis_copper_sulfate",  "final_voltage": 6.0,  "final_current": 1.2,  "anode_mass_final": 9.87,  "cathode_mass_final": 10.13,  "expected_cathode_mass": 10.18,  "deviation_percent": 0.49,  "duration_seconds": 240,  "misconceptions_triggered": ["polarity_confusion"],  "score": 82}
Response: {"status": "logged", "id": "uuid-string"}
GET /api/analytics
Description: Fetch all experiment logs for the teacher dashboard
Response: Array of experiment log objects ordered by created_at descending
WebSocket Endpoint:

WS /ws/lab-agent/{student_id}Description: Persistent WebSocket per student session. Receives simulation state snapshots, returns Socratic AI interventions when misconceptions are detected.
Client sends every 2 seconds (when experiment is running):{  "experiment": "electrolysis_copper_sulfate",  "voltage_applied": 6.5,  "current": 1.3,  "anode_mass_g": 9.80,  "cathode_mass_g": 10.20,  "expected_cathode_mass_g": 10.18,  "deviation_percent": 0.20,  "elapsed_seconds": 120,  "student_last_action": "swapped_electrodes"}
Server responds (only when intervention warranted):{  "type": "socratic_nudge",  "message": "I noticed you swapped the electrodes. At the cathode, should we expect oxidation or reduction to occur?",  "misconception": "polarity_confusion"}
API Testing Screenshots
📸 Add Postman / Thunder Client screenshots here after implementation
WebSocket Testing: Use piehost.com/websocket-tester → Connect to wss://your-backend.railway.app/ws/lab-agent/test-001 → Send the simulation state JSON above → Observe Socratic response.
10. Module-wise Development & Deliverables
Checkpoint 1: Research & Planning
Deliverables:Finalized problem statement and user personas (rural B.Sc./B.Tech. student + teacher)
Selected experiments: Electrolysis of CuSO₄ and Ohm's Law Circuit
Defined simulation state schema and WebSocket message contract
Finalized tech stack and created GitHub repository
Completed this README / Ideation Document
Checkpoint 2: Backend Development
Deliverables:FastAPI server running locally with CORS configured
WebSocket endpoint /ws/lab-agent/{student_id} accepting simulation state JSON
LangGraph Socratic agent (analyze_state → decide_intervention → generate_question) fully functional
Gemini 1.5 Pro integrated and Socratic prompts tuned via AI Studio
REST endpoints for experiment logging and analytics
Supabase experiment_logs table created with schema
Backend deployed and live on Railway with environment variables configured
Checkpoint 3: Frontend Development
Deliverables:React + Vite project scaffolded with all dependencies installed
3D electrolysis lab scene (beaker, electrodes, bubbles) rendering in React Three Fiber
Rapier WASM physics engine integrated; electrode mass changes visible in real time
2D circuit lab rendering in PixiJS with animated electron flow and brightness-mapped LED
Zustand simulation store with Faraday's Law tick function implemented
UI shell (dark theme, left simulation panel, right AI chat panel, bottom readouts) built
Teacher Dashboard at /teacher with Supabase Realtime subscription
PWA configured with vite-plugin-pwa + Workbox; service worker caching WASM and assets
Checkpoint 4: Model Training
Deliverables:(No model training required — Gemini 1.5 Pro is used via API)
Socratic prompt engineering completed and documented (20 misconception scenarios tested in AI Studio)
Rule-based misconception detection logic implemented and validated against all known error types
LangGraph agent graph compiled and integration-tested with mock simulation state inputs
Checkpoint 5: Model Integration
Deliverables:Frontend useLabSocket hook sending simulation state snapshots to backend WebSocket every 2 seconds
AI responses received via WebSocket and rendered in chat panel with typing animation
Web Speech API voice output integrated — AI speaks in Hindi/Tamil/English
End-to-end flow verified: student action → physics update → WebSocket emit → LangGraph → Gemini → Socratic question → voice output
Experiment results logged to Supabase on experiment completion
Teacher dashboard showing live class data via Realtime subscription
Checkpoint 6: Deployment
Deliverables:Frontend deployed on Vercel with custom domain / Vercel URL
Backend deployed on Railway with all environment variables set
PWA verified: "Add to Home Screen" prompt working on Android Chrome
Offline mode verified: simulation and cached hints work with WiFi disabled
Performance audit: Lighthouse PWA score >90, initial load <3s on throttled Slow 3G
Seed data script run — teacher dashboard populated with 20 realistic student sessions for demo
Final demo rehearsed and recorded
11. End-to-End Workflow
Student opens URL on any device (mobile or desktop) → PWA loads in <3 seconds; physics engine (WASM) is downloaded and cached by the service worker
Student selects experiment (Electrolysis Lab or Circuit Lab) → onboarding tooltip tour auto-starts for first-time users
Student begins experiment → presses Start → simulation physics begin ticking; Faraday's Law calculates mass changes per second; animated particles and electrode scaling update visually in real time
Simulation state emits → Zustand store serializes the full state JSON every 2 seconds and sends it over WebSocket to the FastAPI backend
LangGraph agent processes state → rule-based filter checks for misconceptions first; if found, Gemini 1.5 Pro is called to generate a context-aware Socratic question referencing specific simulation numbers
AI question arrives → displayed in the chat panel with typing animation + spoken aloud in the student's chosen language via Web Speech API
Student completes experiment → Results modal shows actual vs. expected values, score, and star rating → session data is POSTed to /api/log-experiment → Supabase stores the record → Teacher Dashboard updates live via Realtime subscription
12. Demo & Video
Live Demo Link: https://virtu-lab.vercel.app (to be updated post-deployment)
Demo Video Link: (to be added)
GitHub Repository: https://github.com/your-team/virtu-lab (to be updated)
13. Hackathon Deliverables Summary
✅ Fully functional PWA accessible via URL on any device — no installation required
✅ Two complete interactive science simulations with real physics (Electrolysis + Circuit Lab)
✅ Agentic AI Socratic tutor observing simulation state in real time and guiding students via LangGraph + Gemini 1.5 Pro
✅ Multilingual voice output in Hindi, Tamil, and English using Web Speech API
✅ Live teacher analytics dashboard with Supabase Realtime showing class-wide misconception patterns
✅ Offline-capable (PWA + Workbox service worker) — works on 2G networks
✅ Deployed frontend (Vercel) + backend (Railway) with live accessible URLs
14. Team Roles & Responsibilities
Member NameRoleResponsibilitiesPerson ASimulation EngineerReact Three Fiber 3D electrolysis lab, Rapier WASM physics integration, PixiJS 2D circuit lab, Zustand simulation state, WebSocket emission hookPerson BAI & Backend EngineerFastAPI server, LangGraph Socratic agent, Gemini 1.5 Pro integration and prompt engineering, Supabase schema and logging endpoints, Railway deploymentPerson CUI/UX Engineer & DevOpsUI shell design (v0.dev + Tailwind), AI chat panel, Web Speech API voice integration, Teacher Dashboard with Supabase Realtime, PWA configuration, Vercel deployment, demo prep15. Future Scope & Scalability
Short-Term (1–3 months post-hackathon)
Expand experiment library: Titration (Chemistry), Simple Harmonic Motion (Physics), Kirchhoff's Laws (Electronics), Microscopy (Biology)
Add student authentication (Supabase Auth) and persistent progress tracking across sessions
Build teacher tools: experiment assignment, deadline setting, per-student detailed report PDF export
Hindi and regional language UI (not just voice — full translated interface)
Mobile UX improvements: touch-optimized controls for experiment sliders and circuit drag-and-drop
Long-Term (6–24 months)
NCERT/State Board Curriculum Alignment: Map every experiment to specific syllabus chapters; auto-generate experiment recommendations based on the chapter a student is currently studying
Adaptive Difficulty: AI adjusts experiment complexity based on student's historical performance and common mistakes
Peer Collaboration Mode: Two students can conduct the same experiment simultaneously with shared state — synchronous virtual lab partner experience
Institutional Licensing Model: Offer to state governments and universities as a low-cost SaaS platform (₹10–50/student/year vs. $10–20/month for Western alternatives)
Vernacular AI Tutor: Fine-tune a smaller open-source model (Llama 3, Gemma 2) on Indian science curriculum Q&A in Hindi/Tamil to reduce API costs for scale
AR Bridge: QR code on real lab equipment that overlays VirtuLab simulation on the camera feed for hybrid physical-virtual experiments
16. Known Limitations
Physics Approximation: The current simulation models ideal conditions. Real-world factors like electrode impurities, temperature variation, and solution resistance are not yet modeled — deviation from real lab results is possible
AI Latency: The Socratic intervention relies on a Gemini API call (~800ms–1.5s). On very slow connections, there may be a perceptible delay between the misconception occurring and the question appearing
Voice Quality: Web Speech API uses the device's built-in TTS engine. Voice quality varies significantly between Android manufacturers and is notably better on modern devices than older ones
Offline AI: In offline mode, the LangGraph agent is unavailable. Fallback is pre-written static Socratic hints cached locally — functional but less adaptive than the live AI
Single Subject Scope (MVP): The hackathon build covers two experiments. A complete platform for even one year of B.Sc. curriculum would require 30–50 experiments
No Authentication (MVP): Student identity is a client-generated UUID stored in localStorage. No account system, password recovery, or cross-device sync
17. Impact
Scale of addressable need: India has approximately 40,000 colleges, of which an estimated 60–70% lack functional science laboratory infrastructure. VirtuLab is the only tool in this space that is free, offline-capable, mobile-first, and vernacular — directly targeting the actual user
NEP 2020 Alignment: Directly supports the National Education Policy's mandate for experiential learning and the use of technology to bridge rural-urban educational equity gaps
Measurable learning outcomes: The misconception detection and session logging system creates, for the first time, a data layer for practical science education in India — enabling evidence-based intervention at the classroom and policy level
Zero marginal cost deployment: Because the physics engine runs client-side (WASM) and the AI uses a free-tier API, the marginal cost of serving one additional student is effectively zero — making universal access economically viable
Teacher empowerment: The real-time class analytics dashboard gives teachers in under-resourced schools a tool that even well-funded private schools do not have — live insight into exactly where student understanding breaks down during an experiment, enabling targeted pedagogical intervention
VirtuLab — Making world-class science education a right, not a privilege.
Built with: React · Vite · React Three Fiber · Rapier WASM · PixiJS · Zustand · FastAPI · LangGraph · Gemini 1.5 Pro · Supabase · Upstash Redis · Railway · Vercel , is this really buildable ?
