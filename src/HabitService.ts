export interface Habit {
    habitId: number
    name: string
    frequency: number
    target: number
    target_measure: string
}

export interface HabitEntry {
    habitId: number
    date: Date
    completed: boolean
    type: number
}

export class HabitService {
    private habits: Map<number, Habit>

    constructor(habits_list: Map<number, Habit> = new Map<number, Habit>) {
        this.habits = habits_list
    }

    insertHabit(habit: Habit){
        if(!this.searchHabit(habit.habitId).found) {
            this.habits.set(habit.habitId, habit)
            return true
        }
        return false
    }

    eraseHabit(habit_id: number) {
        if(this.searchHabit(habit_id).found) {
            this.habits.delete(habit_id)
            return true
        }
        return false
    }

    modifyHabit(habit_id: number, changed_habit: Habit) {
        if(this.searchHabit(habit_id).found && changed_habit.habitId == habit_id) {
            this.habits.set(habit_id, changed_habit)
            return true
        }
        return false
    }

    searchHabit(habit_id: number) {
        if (!this.habits.has(habit_id)) {
            return {found: false, habit: null}
        }
        else {
            return {found: true, habit: this.habits.get(habit_id)}
        }
    }
}


//////////////////////////////////////////////////////////////////

const habit1: Habit = {
    habitId: 1,
    name: "Leer",
    frequency: 5,
    target: 30,
    target_measure: "minutos"
}
const modifiedhabit1: Habit = {
    habitId: 1,
    name: "Leer",
    frequency: 3,
    target: 60,
    target_measure: "minutos"
}

const habit2: Habit = {
    habitId: 2,
    name: "Entrenar",
    frequency: 5,
    target: 4,
    target_measure: "días en semana"
}

const habitService = new HabitService()
console.log("insert")
console.log(habitService.insertHabit(habit1))
console.log(habitService.insertHabit(habit2))
console.log(habitService.insertHabit(habit1))
console.log("erase")
console.log(habitService.eraseHabit(1))
console.log(habitService.insertHabit(habit1))
console.log("modify")
console.log(habitService.modifyHabit(1, habit2))
console.log(habitService.modifyHabit(1,modifiedhabit1))



