import { useState, type FormEvent } from 'react'

import type { Habit } from '../HabitService.ts'
import type { HabitRegister as HabitRegisterType } from '../HabitRegisterService.ts'
import type { HabitTrackerService } from '../HabitTrackerService.ts'

interface HabitRegisterProps {
  service: HabitTrackerService
}

export function HabitRegister({ service }: HabitRegisterProps) {
  const today = new Date()

  const [habits] = useState<Habit[]>(service.getTrackedHabits())
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null)
  const [realized, setRealized] = useState(0)

  const [showRegisters, setShowRegisters] = useState(false)
  const [registers, setRegisters] = useState<HabitRegisterType[]>([])

  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  function handleInsertRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selectedHabit === null) {
      return
    }
    const register: HabitRegisterType = {
      habitId: selectedHabit,
      date: today,
      completed: realized > 0,
      realized: realized,
    }
    const inserted = service.updateOrAddRegister(
      register.habitId,
      register.date,
      register.completed,
      register.realized
    )

    if (inserted) {
      setRegisters(service.getAllTrackedRegisters())
      setRealized(0)
      setSelectedHabit(null)
    }
    else {
      setRealized(-1)
    }
  }

  function handleShowRegisters() {
    setRegisters(service.getAllTrackedRegisters())
    setShowRegisters(true)
  }

  return (
    <section>
      <header>
        <h2>{formattedDate}</h2>
      </header>
      <ul>
        {habits.map((habit) => {
          const todayRegister = service.getTodayTrackedRegister(habit.habitId)

          const realizedToday = todayRegister?.realized ?? 0

          return (
            <li key={habit.habitId}>
              <div>
                <span>
                  {habit.name} {realizedToday}
                  {'/'}
                  {habit.target}
                  {habit.target_measure}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHabit(habit.habitId)

                      setRealized(todayRegister?.realized ?? 0)
                    }}
                  >
                    Track
                  </button>
                  {selectedHabit === habit.habitId && (
                    <form onSubmit={handleInsertRegister}>
                      <p>Track of: {habit.name}</p>

                      <label htmlFor={`register-realized-${habit.habitId}`}>
                        Realized:
                      </label>

                      <input
                        id={`register-realized-${habit.habitId}`}
                        type="number"
                        min="0"
                        value={realized}
                        onChange={(event) =>
                          setRealized(Number(event.target.value))
                        }
                      />

                      <button type="submit">Confirm</button>
                    </form>
                  )}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <button type="button" onClick={handleShowRegisters}>
        Mostrar registros
      </button>
      {showRegisters && (
        <section>
          <h3>Registros almacenados</h3>

          {registers.length === 0 ? (
            <p>No hay registros almacenados.</p>
          ) : (
            <ul>
              {registers.map((register, index) => (
                <li key={index}>
                  <strong>Habit ID:</strong> {register.habitId}
                  {' | '}
                  <strong>Fecha:</strong>{' '}
                  {register.date.toLocaleDateString('es-ES')}
                  {' | '}
                  <strong>Completado:</strong>{' '}
                  {register.completed ? 'Sí' : 'No'}
                  {' | '}
                  <strong>Realizado:</strong> {register.realized}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </section>
  )
}
