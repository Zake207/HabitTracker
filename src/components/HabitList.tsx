import { useState, type FormEvent } from 'react';
import type { Habit, measure_eng } from '../HabitService.ts';
import type { HabitTrackerService } from '../HabitTrackerService.ts';

interface HabitListProps {
  service: HabitTrackerService;
}

function HabitList({ service }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>(service.getTrackedHabits(),);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const [errorInsertHabit, setErrorInsertHabit] = useState(false);
  const [showInsertHabit, setShowFormInsertHabit] = useState(false)
  const [id, setId] = useState(0)
  const [name, setName] = useState('')
  const [freq, setFreq] = useState(0)
  const [tar, setTar] = useState(0)
  const [tarm, setTarm] = useState<measure_eng>('times')
  function handleInsertHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!service.insertTrackedHabit(id,name,freq,tar,tarm)) {
      setErrorInsertHabit(true)
      setShowFormInsertHabit(false)
      return
    }
    setHabits(service.getTrackedHabits());
    setShowFormInsertHabit(false)  
  }
  return (
    <section>
      <h2>My Habits</h2>
      <ul>
        {habits.map((habit) => (
          <li key={habit.habitId} onClick={() => setSelectedHabit(habit)}>
          ({habit.habitId}) {habit.name}
          </li>
        ))}
      </ul>
      <button onClick={() => setShowFormInsertHabit(true)}>
        Add Habit
      </button>
        {showInsertHabit && (
          <form onSubmit={handleInsertHabit}>
            New Habit:<br />
            Id <input value={id} onChange={(event) => setId(Number(event.target.value))}/><br />
            Name <input value={name} onChange={(event) => setName(event.target.value)}/><br />
            Frequency <input value={freq} onChange={(event) => setFreq(Number(event.target.value))}/><br />
            Target <input value={tar} onChange={(event) => setTar(Number(event.target.value))}/><br />
            Target Measure <input value={tarm} onChange={(event) => setTarm(event.target.value as measure_eng)}/><br />
            <button type="submit"> Añadir </button>
          </form>
        )}
        {errorInsertHabit && (
          <div>
            <p>
              Error during the insertion, check te parameters.
            </p>
            <button onClick={() => setErrorInsertHabit(false)}>
              Aceptar
            </button>
          </div>
        )}
        {selectedHabit && (
          <div>
            <h2>{selectedHabit.name}</h2>
            <p> Frequency: {selectedHabit.frequency} </p>
            <p>Objetivo: {selectedHabit.target}{' '}{selectedHabit.target_measure}</p>
        <button onClick={() => setSelectedHabit(null)}>
            Cerrar
        </button>
    </div>
)}
    </section>
  );
}

export default HabitList;