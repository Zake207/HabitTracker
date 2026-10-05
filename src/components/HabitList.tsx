import { useState } from 'react';

function HabitList() {
  const [habits, setHabits] = useState<string[]>([
    'Leer',
    'Estudiar',
    'Entrenar',
  ]);

  return (
    <section>
      <h2>Mis hábitos</h2>

      <ul>
        {habits.map((habit) => (
          <li key={habit}>{habit}</li>
        ))}
      </ul>

      <button
        onClick={() =>
          setHabits([...habits, 'Programar'])
        }
      >
        Añadir hábito
      </button>
    </section>
  );
}

export default HabitList;