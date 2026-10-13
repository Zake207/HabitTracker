import { useState, type FormEvent } from 'react'

import '../styles/HabitList.css'
import type { Habit, measure_eng } from '../logic/HabitService.ts'
import type { HabitTrackerService } from '../logic/HabitTrackerService.ts'

interface HabitListProps {
  service: HabitTrackerService
}

function HabitList({ service }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>(service.getTrackedHabits())

  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  const [errorInsertHabit, setErrorInsertHabit] = useState(false)
  const [showInsertHabit, setShowFormInsertHabit] = useState(false)

  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [freq, setFreq] = useState('')
  const [tar, setTar] = useState('')
  const [tarm, setTarm] = useState<measure_eng>('amount')

  const [errorModifyHabit, setErrorModifyHabit] = useState(false)
  const [showModifyHabit, setShowFormModifyHabit] = useState(false)

  const [n_name, setNewName] = useState('')
  const [n_freq, setNewFreq] = useState('')
  const [n_tar, setNewTar] = useState('')
  const [n_tarm, setNewTarm] = useState<measure_eng>('amount')

  function resetFormInsertHabit() {
    setId('')
    setName('')
    setFreq('')
    setTar('')
    setTarm('times')
    setShowFormInsertHabit(true)
  }

  function setFormModifyHabit() {
    if (selectedHabit === null) {
      return
    }

    setNewName(selectedHabit.name)
    setNewFreq(String(selectedHabit.frequency))
    setNewTar(String(selectedHabit.target))
    setNewTarm(selectedHabit.target_measure)
    setShowFormModifyHabit(true)
  }

  function handleInsertHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !service.insertTrackedHabit(
        Number(id),
        name,
        Number(freq),
        Number(tar),
        tarm
      )
    ) {
      resetFormInsertHabit()
      setErrorInsertHabit(true)
      setShowFormInsertHabit(false)
      return
    }

    setHabits(service.getTrackedHabits())
    resetFormInsertHabit()
    setShowFormInsertHabit(false)
  }

  function handleModifyHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (selectedHabit === null) {
      return
    }

    if (
      !service.modifyTrackedHabit(
        selectedHabit.habitId,
        n_name,
        Number(n_freq),
        Number(n_tar),
        n_tarm
      )
    ) {
      setErrorModifyHabit(true)
      setShowFormModifyHabit(false)
      return
    }

    setHabits(service.getTrackedHabits())
    setSelectedHabit(null)
    setShowFormModifyHabit(false)
  }

  function handleDeleteHabit() {
    if (!selectedHabit) {
      return
    }

    const confirmed = window.confirm(`Deleting habit "${selectedHabit.name}"?`)

    if (!confirmed) {
      return
    }

    service.eraseTrackedHabit(selectedHabit.habitId)
    setHabits(service.getTrackedHabits())
    setSelectedHabit(null)
  }

  return (
    <section className="habit-list">
      <header className="habit-list-header">
        <div className="habit-header">
            <div>
              <h3>Mis hábitos</h3>
              <p>Controla tu progreso de hoy.</p>
            </div>
          </div>

        <button
          className="primary-button"
          onClick={() => setShowFormInsertHabit(true)}
        >
          Añadir hábito
        </button>
      </header>

      <ul className="habits">
        {habits.map((habit) => (
          <li
            className="habit-item"
            key={habit.habitId}
            onClick={() => setSelectedHabit(habit)}
          >
            <div className="habit-item-info">
              <span className="habit-item-name">{habit.name}</span>

              <span className="habit-item-id">#{habit.habitId}</span>
            </div>

            <span className="habit-item-arrow">→</span>
          </li>
        ))}
      </ul>

      {showInsertHabit && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleInsertHabit}>
            <h2 className="modal-title">Nuevo hábito</h2>

            <div className="form-group">
              <label htmlFor="habit-id">Id</label>
              <input
                id="habit-id"
                type="number"
                value={id}
                onChange={(event) => setId(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-name">Nombre</label>
              <input
                id="habit-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value.trim())}
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-frequency">Objetivo semanal</label>
              <input
                id="habit-frequency"
                type="number"
                min={0}
                max={7}
                value={freq}
                onChange={(event) => setFreq(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-target">Objetivo diario</label>
              <input
                id="habit-target"
                type="number"
                value={tar}
                onChange={(event) => setTar(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-target-measure">Medida</label>
              <input
                id="habit-target-measure"
                type="text"
                value={tarm}
                onChange={(event) => setTarm(event.target.value as measure_eng)}
              />
            </div>

            <div className="modal-actions">
              <button className="primary-button" type="submit">
                Añadir
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowFormInsertHabit(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {errorInsertHabit && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h2 className="modal-title">Error de inserción</h2>

            <p>Error en la inserción, los parametros no siguen los estándares.</p>

            <button
              className="primary-button"
              onClick={() => setErrorInsertHabit(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {selectedHabit && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{selectedHabit.name}</h2>

            <div className="habit-details">
              <div className="habit-detail">
                <span className="habit-detail-label">Objetivo semanal</span>

                <span className="habit-detail-value">
                  {selectedHabit.frequency}
                </span>
              </div>

              <div className="habit-detail">
                <span className="habit-detail-label">Objetivo diario</span>

                <span className="habit-detail-value">
                  {selectedHabit.target} {selectedHabit.target_measure}
                </span>
              </div>
            </div>

            {showModifyHabit && (
              <form className="modify-form" onSubmit={handleModifyHabit}>
                <h3>Mdificar hábito</h3>

                <div className="form-group">
                  <label htmlFor="modify-name">Nombre</label>
                  <input
                    id="modify-name"
                    type="text"
                    value={n_name}
                    onChange={(event) => setNewName(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modify-frequency">Objetivo semanal</label>
                  <input
                    id="modify-frequency"
                    type="number"
                    max={7}
                    value={n_freq}
                    onChange={(event) => setNewFreq(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modify-target">Objetivo diario</label>
                  <input
                    id="modify-target"
                    type="number"
                    value={n_tar}
                    onChange={(event) => setNewTar(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modify-target-measure">Medida</label>
                  <input
                    id="modify-target-measure"
                    type="text"
                    value={n_tarm}
                    onChange={(event) =>
                      setNewTarm(event.target.value as measure_eng)
                    }
                  />
                </div>

                <div className="modal-actions">
                  <button className="primary-button" type="submit">
                    Guardar
                  </button>
                </div>
              </form>
            )}

            {errorModifyHabit && (
              <div className="error-message">
                <p>Error en la modificación, parámetros no siguen los estándares.</p>

                <button
                  className="primary-button"
                  onClick={() => setErrorModifyHabit(false)}
                >
                  Ok
                </button>
              </div>
            )}

            <div className="modal-actions">
              {!showModifyHabit && (
                <button className="primary-button" onClick={setFormModifyHabit}>
                  Modificar
                </button>
              )}

              <button className="danger-button" onClick={handleDeleteHabit}>
                Borrar
              </button>

              <button
                className="secondary-button"
                onClick={() => setSelectedHabit(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HabitList
