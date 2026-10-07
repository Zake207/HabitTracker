import { useState, type FormEvent } from 'react'

import type { Habit, measure_eng } from '../HabitService.ts'
import type { HabitTrackerService } from '../HabitTrackerService.ts'

interface HabitListProps {
  service: HabitTrackerService
}

function HabitList({ service }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>(service.getTrackedHabits())

  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  const [errorInsertHabit, setErrorInsertHabit] = useState(false)
  const [showInsertHabit, setShowFormInsertHabit] = useState(false)

  const [id, setId] = useState(0)
  const [name, setName] = useState('')
  const [freq, setFreq] = useState(0)
  const [tar, setTar] = useState(0)
  const [tarm, setTarm] = useState<measure_eng>('amount')

  const [errorModifyHabit, setErrorModifyHabit] = useState(false)
  const [showModifyHabit, setShowFormModifyHabit] = useState(false)

  const [n_name, setNewName] = useState('')
  const [n_freq, setNewFreq] = useState(0)
  const [n_tar, setNewTar] = useState(0)
  const [n_tarm, setNewTarm] = useState<measure_eng>('amount')

  function resetFormInsertHabit() {
    setId(0)
    setName('')
    setFreq(0)
    setTar(0)
    setTarm('times')
    setShowFormInsertHabit(true)
  }

  function setFormModifyHabit() {
    if (selectedHabit === null) {
      return
    }

    setNewName(selectedHabit.name)
    setNewFreq(selectedHabit.frequency)
    setNewTar(selectedHabit.target)
    setNewTarm(selectedHabit.target_measure)
    setShowFormModifyHabit(true)
  }

  function handleInsertHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!service.insertTrackedHabit(id, name, freq, tar, tarm)) {
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
        n_freq,
        n_tar,
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
        <h2 className="habit-list-title">My Habits</h2>

        <button
          className="primary-button"
          onClick={() => setShowFormInsertHabit(true)}
        >
          Add Habit
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
            <h2 className="modal-title">New Habit</h2>

            <div className="form-group">
              <label htmlFor="habit-id">Id</label>
              <input
                id="habit-id"
                type="number"
                value={id}
                onChange={(event) => setId(Number(event.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-name">Name</label>
              <input
                id="habit-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value.trim())}
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-frequency">Frequency</label>
              <input
                id="habit-frequency"
                type="number"
                value={freq}
                onChange={(event) => setFreq(Number(event.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-target">Target</label>
              <input
                id="habit-target"
                type="number"
                value={tar}
                onChange={(event) => setTar(Number(event.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-target-measure">Target Measure</label>
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
            <h2 className="modal-title">Insertion Error</h2>

            <p>Error during the insertion, check the parameters.</p>

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
                <span className="habit-detail-label">Frequency</span>

                <span className="habit-detail-value">
                  {selectedHabit.frequency}
                </span>
              </div>

              <div className="habit-detail">
                <span className="habit-detail-label">Target</span>

                <span className="habit-detail-value">
                  {selectedHabit.target} {selectedHabit.target_measure}
                </span>
              </div>
            </div>

            {showModifyHabit && (
              <form className="modify-form" onSubmit={handleModifyHabit}>
                <h3>Modify Habit</h3>

                <div className="form-group">
                  <label htmlFor="modify-name">Name</label>
                  <input
                    id="modify-name"
                    type="text"
                    value={n_name}
                    onChange={(event) => setNewName(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modify-frequency">Frequency</label>
                  <input
                    id="modify-frequency"
                    type="number"
                    value={n_freq}
                    onChange={(event) => setNewFreq(Number(event.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modify-target">Target</label>
                  <input
                    id="modify-target"
                    type="number"
                    value={n_tar}
                    onChange={(event) => setNewTar(Number(event.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modify-target-measure">Target Measure</label>
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
                    Save
                  </button>
                </div>
              </form>
            )}

            {errorModifyHabit && (
              <div className="error-message">
                <p>Error during the modification, check the parameters.</p>

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
                  Modify
                </button>
              )}

              <button className="danger-button" onClick={handleDeleteHabit}>
                Delete
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
