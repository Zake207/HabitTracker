import { useState, type FormEvent } from 'react'

import type { Habit } from '../HabitService.ts'
import type { HabitRegister } from '../HabitRegisterService.ts'
import type { HabitTrackerService } from '../HabitTrackerService.ts'

interface HabitRegisterProps {
  service: HabitTrackerService
}

// Falta hacer que al insertar una cantidad de realized este se refleje solo 
// en el habito donde se inserto y despues guardarlo dentro de service, ya 
// que de momento por usar un realized global se abre el cuestionario para 
// todos y se setea un realized para todos

export function HabitRegister({ service }: HabitRegisterProps) {
  const today = new Date()
  const [habits, setHabits] = useState<Habit[]>(service.getTrackedHabits())
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null)
  const [realized, setRealized] = useState(0)

  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  function handleInsertRegister() {}
  return (
    <section>
      <header>
        <h2>{formattedDate}</h2>
      </header>
      <ul>
        {habits.map((habit) => (
          <li>
            <div>
              <span>
                {habit.name}{'  '}{realized}{'/'}{habit.target}{habit.target_measure}
                <button onClick={() => { setSelectedHabit(habit.habitId)}}>Track</button>
                {selectedHabit === habit.habitId && 
                    <form onSubmit={handleInsertRegister}>
                        Track of: {habit.name}<br />
                        Realized: <input id="register-realized" type="number" value={realized} onChange={(event) => setRealized(Number(event.target.value))}/>
                        <button type='submit'>Confirm</button>
                    </form>
                }
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
