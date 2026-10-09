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

  // Notes related code

  const [note, setNote] = useState(
  service.getTodayNote()?.notes ?? ''
)

const [noteSaved, setNoteSaved] = useState(false)

  function handleSaveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const saved = service.addNote(note)
    setNoteSaved(saved)
  }

  
return (
  <main className="habit-tracker">
    <header className="page-header">
      <h2>{formattedDate}</h2>
      <p>Tu seguimiento diario</p>
    </header>

    <div className="daily-panel">
      {/* Panel de registros */}
      <section className="panel register-panel">
        <div className="panel-header">
          <div>
            <h3>Registros de hábitos</h3>
            <p>Controla tu progreso de hoy.</p>
          </div>
        </div>

        <ul className="habit-list">
          {habits.map((habit) => {
            const todayRegister = service.getTodayTrackedRegister(
              habit.habitId
            )

            const realizedToday = todayRegister?.realized ?? 0

            return (
              <li className="habit-card" key={habit.habitId}>
                <div className="habit-card-header">
                  <div className="habit-info">
                    <h4>{habit.name}</h4>
                    <p className="habit-progress">
                      <strong>{realizedToday}</strong>
                      <span> / {habit.target} {habit.target_measure}</span>
                    </p>
                  </div>

                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => {
                      setSelectedHabit(habit.habitId)
                      setRealized(todayRegister?.realized ?? 0)
                    }}
                  >
                    Registrar
                  </button>
                </div>

                {selectedHabit === habit.habitId && (
                  <form
                    className="register-form"
                    onSubmit={handleInsertRegister}
                  >
                    <p className="form-description">
                      Registrar progreso: {habit.name}
                    </p>

                    <label htmlFor={`register-realized-${habit.habitId}`}>
                      Cantidad realizada
                    </label>

                    <input
                      className="form-input"
                      id={`register-realized-${habit.habitId}`}
                      type="number"
                      min="0"
                      step="any"
                      value={realized}
                      onChange={(event) =>
                        setRealized(Number(event.target.value))
                      }
                    />

                    <div className="form-actions">
                      <button className="button button-primary" type="submit">
                        Confirmar
                      </button>

                      <button
                        className="button button-ghost"
                        type="button"
                        onClick={() => setSelectedHabit(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </li>
            )
          })}
        </ul>

        <div className="debug-section">
          <button
            className="button button-ghost debug-toggle"
            type="button"
            onClick={handleShowRegisters}
          >
            {showRegisters ? 'Actualizar registros almacenados' : 'Mostrar registros almacenados'}
          </button>

          {showRegisters && (
            <section className="stored-registers">
              <h4>Registros almacenados</h4>

              {registers.length === 0 ? (
                <p className="empty-message">
                  No hay registros almacenados.
                </p>
              ) : (
                <ul className="stored-register-list">
                  {registers.map((register, index) => (
                    <li
                      className="stored-register-item"
                      key={`${register.habitId}-${register.date.getTime()}-${index}`}
                    >
                      <p>
                        <strong>Hábito:</strong> {register.habitId}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{' '}
                        {register.date.toLocaleDateString('es-ES')}
                      </p>
                      <p>
                        <strong>Completado:</strong>{' '}
                        {register.completed ? 'Sí' : 'No'}
                      </p>
                      <p>
                        <strong>Realizado:</strong> {register.realized}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </section>

      {/* Panel de notas */}
      <section className="panel notes-panel">
        <div className="panel-header">
          <div>
            <h3>Notas del día</h3>
            <p>Guarda ideas, recordatorios y observaciones.</p>
          </div>
        </div>

        <form className="notes-form" onSubmit={handleSaveNote}>
          <label htmlFor="daily-note">Tu espacio personal</label>

          <textarea
            className="notes-textarea"
            id="daily-note"
            value={note}
            onChange={(event) => {
              setNote(event.target.value)
              setNoteSaved(false)
            }}
            placeholder="¿Qué quieres recordar hoy?"
            rows={12}
          />

          <div className="notes-footer">
            <span className="notes-hint">
              Las notas se guardan para el día actual.
            </span>

            <button className="button button-primary" type="submit">
              Guardar nota
            </button>
          </div>

          {noteSaved && (
            <p className="save-message" role="status">
              Nota guardada correctamente.
            </p>
          )}
        </form>
      </section>
    </div>
  </main>
)

}
