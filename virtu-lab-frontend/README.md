# VirtuLab Frontend

A high-fidelity Virtual Science Laboratory PWA built with React, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file with the following:
    ```env
    VITE_BACKEND_URL=http://localhost:8000
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    ```

3.  **Run Dev Server**:
    ```bash
    npm run dev
    ```

## 🏗️ Project Structure

-   `src/components/ui`: Core layout and shared UI elements (LabShell, AITutorPanel, etc.)
-   `src/components/simulations`: Laboratory experiment R3F engines
-   `src/store`: Global state management with Zustand
-   `src/hooks`: Custom React hooks for API and hardware integration
-   `src/pages`: Main application routes (Standard Lab vs Teacher Dashboard)

## ✨ Technologies

-   **Frontend**: React 18, Vite, TypeScript
-   **Styling**: Tailwind CSS v3, Framer Motion
-   **Charts**: Recharts
-   **State**: Zustand
-   **Icons**: Lucide React
