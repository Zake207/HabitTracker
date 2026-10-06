import { HabitTrackerService } from './HabitTrackerService.ts';
import HabitList from './components/HabitList.tsx';

const habitTrackerService = new HabitTrackerService();
habitTrackerService.insertTrackedHabit(1,"example",2,2,"times")

function App() {
  return (
    <main>
      <h1>Habit Tracker</h1>

      <HabitList service={habitTrackerService} />
    </main>
  );
}

export default App;