import { HabitRegisterService, HabitRegister } from './HabitRegisterService'
import { HabitService, Habit, measure_eng } from './HabitService'
import { DailyNoteService, DailyNote } from './DailyNote'

export class HabitTrackerService {
  private habits = new HabitService()
  private registers = new HabitRegisterService()
  private notes = new DailyNoteService()

  constructor(habit_list: Map<number, Habit> = new Map<number, Habit>()) {
    this.habits = new HabitService(habit_list)
    this.loadTrackedHabits()
    this.habits.getHabits().forEach((habit) => {
      this.registers.addEntry(habit.habitId)
    })
    this.loadTrackedRegisters()
    this.loadNotes()
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
    const target = this.habits.getHabits().get(habit_id)?.target
    if (target === undefined) {
      return false
    }

    const new_register: HabitRegister = {
      habitId: habit_id,
      date: date,
      completed: completed && realized >= target,
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

  private saveTrackedHabits(): void {
    const habits = Array.from(this.habits.getHabits().values())
    localStorage.setItem('habits', JSON.stringify(habits))
  }

  private saveTrackedRegisters(): void {
    const registers = this.getAllTrackedRegisters()
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

  private loadTrackedRegisters(): void {
    const data = localStorage.getItem('registers')
    if (data === null) {
      return
    }
    const registers: HabitRegister[] = JSON.parse(data)
    registers.forEach((register) => {
      register.date = new Date(register.date)
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
    return false
  }

  // Notes related code

  getTodayNote(): DailyNote | undefined {
    return this.notes.searchNote(new Date())
  }

  /**
   * @description
   * Adds text to the note corresponding to the current day and persists it.
   *
   * @param {string} content - Text to append to today's note.
   * @returns {boolean} True if the note was added successfully.
   */
  addNote(content: string): boolean {
    const result = this.notes.addNote(new Date(), content)
    if (!result) {
      return false
    }
    this.saveNotes()
    return true
  }

  saveNotes(): void {
    const notes = this.notes.getNotes()
    localStorage.setItem('notes', JSON.stringify(notes))
  }

  loadNotes(): void {
    const data = localStorage.getItem('notes')
    if (data === null) {
      return
    }
    const stored_notes: DailyNote[] = JSON.parse(data)
    const notes = new Array()
    stored_notes.forEach((note) => {
      const n_note: DailyNote = {
        date: new Date(note.date),
        notes: note.notes,
      }
      notes.push(n_note)
    })
    this.notes = new DailyNoteService(notes)
  }
}
