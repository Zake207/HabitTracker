import { useState } from 'react';
import { HabitTrackerService } from './HabitTrackerService.ts';
import HabitList from './components/HabitList.tsx';
import Sidebar from './components/Sidebar';

export type View = 'habits' | 'registers' | 'metrics'

const habitTrackerService = new HabitTrackerService();

function App() {
  const [view, setView] = useState<View>('habits');
  
  return (
    <main className="app">
            <Sidebar
                view={view}
                setView={setView}
            />

            {view === 'habits' && (
                <HabitList service={habitTrackerService} />
            )}

            {/* {view === 'registers' && (
                <RegisterView service={habitTrackerService} />
            )}

            {view === 'metrics' && (
                <MetricsView service={habitTrackerService} />
            )} */}
        </main>
  );
}

export default App;