export type measure_eng = "pages" | "minutes" | "times" | "amount"

export interface Habit {
    habitId: number
    name: string
    frequency: number
    target: number
    target_measure: measure_eng
}

export interface HabitEntry {
    habitId: number
    date: Date
    completed: boolean
    type: number
}

function isValidTargetMeasure(value: string): boolean {
    return (
        value === "amount" ||
        value === "minutes" ||
        value === "pages" ||
        value === "times"
    );
}

export class HabitService {
    private habits: Map<number, Habit> = new Map<number, Habit>

    constructor(habits_list: Map<number, Habit> = new Map<number, Habit>) {
        habits_list.forEach((habit) => {
            if (!this.validateHabit(habit)) {
                return undefined
            }
        })
        this.habits = habits_list
    }

    validateHabit(habit: Habit) : boolean {
        const i_check = typeof habit.habitId === "number"
        && Number.isInteger(habit.habitId)
        && habit.habitId > 0
        
        const f_check = typeof habit.frequency === "number"
        && Number.isInteger(habit.frequency)
        && habit.frequency > 0

        const t_check = typeof habit.target === "number"
        && Number.isInteger(habit.target)
        && habit.target > 0

        const n_check = typeof habit.name === "string"
        && habit.name.trim().length > 0

        const tm_check = isValidTargetMeasure(habit.target_measure)

        if (i_check && f_check && t_check && n_check && tm_check) {
            return true
        }
        return false
    }

    insertHabit(habit: Habit) : boolean {

        if(this.validateHabit(habit) && !this.searchHabit(habit.habitId).found) {
            this.habits.set(habit.habitId, habit)
            return true
        }
        return false
    }

    eraseHabit(habit_id: number) : boolean {
        if(this.searchHabit(habit_id).found) {
            this.habits.delete(habit_id)
            return true
        }
        return false
    }

    modifyHabit(habit_id: number, changed_habit: Habit) : boolean {
        if(this.searchHabit(habit_id).found 
        && changed_habit.habitId == habit_id
        && this.validateHabit(changed_habit)) {
            this.habits.set(habit_id, changed_habit)
            return true
        }
        return false
    }

    searchHabit(habit_id: number) : {found: boolean, habit: Habit | undefined} {
        if (!this.habits.has(habit_id)) {
            return {found: false, habit: undefined}
        }
        else {
            return {found: true, habit: this.habits.get(habit_id)}
        }
    }
}


//////////////////////////////////////////////////////////////////



