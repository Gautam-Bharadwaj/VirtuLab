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
  1. **The Circuit Forge (Physics/Electronics):** Simulates Ohm's Law and component overload. *(Target: Class 10-12, B.Tech 1st Year)*
  2. **The Color-Shift Titration Bench (Chemistry):** Simulates pH curves and acid-base neutralization. *(Target: Class 11-12, B.Sc. Chemistry)*
  3. **The Kinetic Enzyme Reactor (Biology):** Simulates Michaelis-Menten kinetics and protein denaturation via temperature/pH. *(Target: Class 12, B.Sc. Biology/Biotech)*
  4. **The Precision Soil Lab (Agronomy):** Simulates N-P-K fertilizer balancing for crop yield. *(Target: B.Sc. Agriculture, Rural Polytechnics)*
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
*(Add system architecture diagram image here - e.g., a flowchart showing Frontend PWA, FastAPI, Gemini, and Supabase)*

---

## 5. Database Design

### ER Diagram

```mermaid
erDiagram
