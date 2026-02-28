import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LabShell } from './components/ui/LabShell';
import { ControlsSidebar } from './components/ui/ControlsSidebar';
import { SimulationEngine } from './components/simulations/SimulationEngine';
import { AITutorPanel } from './components/ui/AITutorPanel';
import { TeacherDashboard } from './pages/TeacherDashboard';

function App() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <LabShell sidebar={<ControlsSidebar />} tutor={<AITutorPanel />}>
            <SimulationEngine />
          </LabShell>
        } 
      />
      <Route path="/teacher" element={<TeacherDashboard />} />
    </Routes>
  );
}

export default App;
