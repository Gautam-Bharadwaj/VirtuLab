import { Routes, Route } from 'react-router-dom'
import { LabShell } from './components/ui/LabShell'
import { SimulationEngine } from './components/simulations/SimulationEngine'
import { ControlsSidebar } from './components/ui/ControlsSidebar'
import { AITutorPanel } from './components/ui/AITutorPanel'
import { TeacherDashboard } from './pages/TeacherDashboard'
import { useLabStore } from './store/useLabStore'

function MainLab() {
  const failureState = useLabStore((s) => s.failureState)

  return (
    <LabShell
      sidebar={<ControlsSidebar />}
      tutor={<AITutorPanel />}
    >
      <SimulationEngine />      {/* Ayush's R3F canvas */}

      {/* Floating failure notification */}
      {failureState && (
        <div
          className="fixed top-20 right-96 z-50 flex items-center gap-2
                     bg-red-600/90 backdrop-blur-md text-white px-4 py-2.5
                     rounded-xl shadow-lg shadow-red-500/20 animate-bounce
                     border border-red-500/30"
        >
          <span className="text-lg">⚠️</span>
          <span className="text-sm font-medium">{failureState.name}</span>
        </div>
      )}
    </LabShell>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLab />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
    </Routes>
  )
}
