import { HabitRegisterService, HabitRegister } from './HabitRegisterService'
import { HabitService, Habit, measure_eng } from './HabitService'

export class HabitTrackerService {
  private habits = new HabitService()
  private registers = new HabitRegisterService()

  constructor(habit_list: Map<number, Habit> = new Map<number, Habit>()) {
    this.habits = new HabitService(habit_list)

    this.loadTrackedHabits()
    this.habits.getHabits().forEach((habit) => {
      this.registers.addEntry(habit.habitId)
    })
    this.loadTrackedRegisters()
    // Falta tratar el caso en el que no se inicializa vacio
    // por lo que hay que ver que pasa entre el localStorage
    // y el map que se pasa como parámetro
  }

  insertTrackedHabit(
    habit_id: number,
    name: string,
    frequency: number,
    target: number,
    target_measure: measure_eng
  ): boolean {
    const new_habit: Habit = {
      habitId: habit_id,
      name: name,
      frequency: frequency,
      target: target,
      target_measure: target_measure,
    }
    if (this.habits.insertHabit(new_habit)) {
      if (this.registers.addEntry(habit_id)) {
        this.saveTrackedHabits()
        return true
      }
    }
    return false
  }

  eraseTrackedHabit(habit_id: number): boolean {
    this.registers.dropEntry(habit_id)
    if (this.habits.eraseHabit(habit_id)) {
      this.saveTrackedHabits()
      return true
    }
    return false
  }

  addRegister(
    habit_id: number,
    date: Date,
    completed: boolean,
    realized: number
  ): boolean {
    const new_register: HabitRegister = {
      habitId: habit_id,
      date: date,
      completed: completed,
      realized: realized,
    }
    if (this.registers.insertRegister(new_register)) {
      return true
    }
    return false
  }

  modifyTrackedHabit(
    habit_id: number,
    new_name: string,
    new_frequency: number,
    new_target: number,
    new_target_measure: measure_eng
  ): boolean {
    const habit_to_modify = this.habits.searchHabit(habit_id)
    if (!habit_to_modify.found) {
      return false
    }
    const modified_habit: Habit = {
      habitId: habit_id,
      name: new_name,
      frequency: new_frequency,
      target: new_target,
      target_measure: new_target_measure,
    }
    if (this.habits.modifyHabit(habit_id, modified_habit)) {
      this.saveTrackedHabits()
      return true
    }
    return false
  }

  getTrackedHabits(): Array<Habit> {
    return Array.from(this.habits.getHabits().values())
  }

  getTodayTrackedRegister(habit_id: number): HabitRegister | undefined {
    const today = new Date()
    const register = this.registers.searchRegister(habit_id, today)
    if (register.found) {
      return register.register
    }
  }

  /**
   * @description
   * Obtains all habit registrations corresponding to the current calendar day.
   *
   * @returns {HabitRegister[]} Habit registrations for the current day.
   */
  getAllTrackedRegisters(): HabitRegister[] {
    const registers: HabitRegister[] = []
    this.registers.getRegisters().forEach((habitRegisters) => {
      habitRegisters.forEach((register) => {
        registers.push(register)
      })
    })
    return registers
  }

  private saveTrackedHabits() : void {
    const habits = Array.from(this.habits.getHabits().values())
    localStorage.setItem('habits', JSON.stringify(habits))
  }

  private saveTrackedRegisters() : void {
    const registers = Array.from(this.registers.getRegisters().values())
    localStorage.setItem('registers', JSON.stringify(registers))
  }

  private loadTrackedHabits(): void {
    const data = localStorage.getItem('habits')
    if (data === null) {
      return
    }
    const habits: Habit[] = JSON.parse(data)
    this.habits = new HabitService(
      new Map<number, Habit>(habits.map((habit) => [habit.habitId, habit]))
    )
  }

  private loadTrackedRegisters() : void {
    const data = localStorage.getItem('registers')
    if (data === null) {
      return
    }
    const registers: HabitRegister[] = JSON.parse(data)
    registers.forEach((register) => {
      this.registers.insertRegister(register)
    })
  }

  updateOrAddRegister(
    habit_id: number,
    date: Date,
    completed: boolean,
    realized: number
  ): boolean {
    const register = this.registers.searchRegister(habit_id, date)
    if (register.found && register.register !== undefined) {
      const modified_register: HabitRegister = {
        habitId: habit_id,
        date: date,
        completed: completed,
        realized: realized,
      }
      if (this.registers.modifyRegister(modified_register)) {
        this.saveTrackedRegisters()
        return true
      }
      return false
    }
    if (this.addRegister(habit_id, date, completed, realized)) {
      this.saveTrackedRegisters()  
      return true
    }
  }
}
