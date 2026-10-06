import { useState, type FormEvent } from 'react';
import type { Habit, measure_eng } from '../HabitService.ts';
import type { HabitTrackerService } from '../HabitTrackerService.ts';

interface HabitListProps {
  service: HabitTrackerService;
}

// Falta: Reiniciar formularios cada vez que se completen 
//        para no mostrar lo anterior al iniciar uno nuevo.

//        Al modificar un habito el formulario debe reflejar
//        los valores ya existentes del habito para evitar 
//        perdida de tiempo al usuario.

//        Añadir un menu donde se pueda navegar entre las
//        funcionalidades de la aplicación

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

  const [errorModifyHabit, setErrorModifyHabit] = useState(false);
  const [showModifyHabit, setShowFormModifyHabit] = useState(false)
  const [n_name, setNewName] = useState('')
  const [n_freq, setNewFreq] = useState(0)
  const [n_tar, setNewTar] = useState(0)
  const [n_tarm, setNewTarm] = useState<measure_eng>('times')

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

  function handleModifyHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() 
    if(!service.modifyTrackedHabit(selectedHabit.habitId,n_name, n_freq, n_tar, n_tarm)) {
      setErrorModifyHabit(true)
      setShowFormModifyHabit(false)
      return
    }
    setHabits(service.getTrackedHabits());
    setSelectedHabit(null)
    setShowFormModifyHabit(false)
  }
  function handleDeleteHabit() {
    if (!selectedHabit) {
      return;
    }
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el hábito "${selectedHabit.name}"?`
    );
    if (!confirmed) {
      return;
    }  
    service.eraseTrackedHabit(selectedHabit.habitId);
    setHabits(service.getTrackedHabits());
    setSelectedHabit(null);
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
            <h2>New Habit</h2>
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
        <button onClick={() => setShowFormModifyHabit(true)}>
            Modify
        </button>
          {showModifyHabit && (
            <form onSubmit={handleModifyHabit}>
              <h2>Modify Habit</h2>
              Name <input value={n_name} onChange={(event) => setNewName(event.target.value)}/><br />
              Frequency <input value={n_freq} onChange={(event) => setNewFreq(Number(event.target.value))}/><br />
              Target <input value={n_tar} onChange={(event) => setNewTar(Number(event.target.value))}/><br />
              Target Measure <input value={n_tarm} onChange={(event) => setNewTarm(event.target.value as measure_eng)}/><br />
              <button type="submit"> Save </button>
            </form>
          )}
          {errorModifyHabit && (
            <div>
              <p>
                Error during the modification, check te parameters.
              </p>
              <button onClick={() => setErrorModifyHabit(false)}>
                Ok
              </button>
            </div>
          )}
        <button onClick={handleDeleteHabit}>
            Delete
        </button>
        <button onClick={() => setSelectedHabit(null)}>
            Cerrar
        </button>
    </div>
)}
    </section>
  );
}

export default HabitList;