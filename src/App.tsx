import { useState } from 'react'
import { HabitTrackerService } from './logic/HabitTrackerService.ts'
import HabitList from './components/HabitList.tsx'
import Sidebar from './components/Sidebar'
import { HabitRegister } from './components/HabitRegister.tsx'
import { HabitMetrics } from './components/Metrics.tsx'

export type View = 'habits' | 'registers' | 'metrics'

const habitTrackerService = new HabitTrackerService()

function App() {
  const [view, setView] = useState<View>('registers')

  return (
    <main className="app">
      <Sidebar view={view} setView={setView} />
      {view === 'habits' && <HabitList service={habitTrackerService} />}

      {view === 'registers' && <HabitRegister service={habitTrackerService} />}

      {view === 'metrics' && <HabitMetrics service={habitTrackerService} />}
    </main>
  )
}

export default App
