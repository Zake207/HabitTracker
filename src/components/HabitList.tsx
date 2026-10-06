import { useState, type FormEvent } from 'react';
import type { Habit, measure_eng } from '../HabitService.ts';
import type { HabitTrackerService } from '../HabitTrackerService.ts';

interface HabitListProps {
  service: HabitTrackerService;
}

function HabitList({ service }: HabitListProps) {
  function handleSubmitNewHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    service.insertTrackedHabit(id,name,freq,tar,tarm)
    setHabits(service.getTrackedHabits());
    setShowForm(false)  
  }
  const [habits, setHabits] = useState<Habit[]>(
    service.getTrackedHabits(),
  );
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [freq, setFreq] = useState(0);
  const [tar, setTar] = useState(0);
  const [tarm, setTarm] = useState<measure_eng>('times');

  return (
    <section>
      <h2>My Habits</h2>

      <ul>
        {habits.map((habit) => (
          <li key={habit.habitId}>
            ({habit.habitId}) {habit.name} - Frequency: {habit.frequency}, Target: {habit.target} {habit.target_measure}
          </li>
        ))}
      </ul>
      <button onClick={() => setShowForm(true)}>
        Add Habit
      </button>
          {showForm && (
        <form onSubmit={handleSubmitNewHabit}>
        New Habit:<br />
            Id <input value={id} onChange={(event) => setId(Number(event.target.value))}/><br />
            Name <input value={name} onChange={(event) => setName(event.target.value)}/><br />
            Frequency <input value={freq} onChange={(event) => setFreq(Number(event.target.value))}/><br />
            Target <input value={tar} onChange={(event) => setTar(Number(event.target.value))}/><br />
            Target Measure <input value={tarm} onChange={(event) => setTarm(event.target.value)}/><br />
            <button type="submit"> Añadir </button>
        </form>
      )}
    </section>
  );
}

export default HabitList;