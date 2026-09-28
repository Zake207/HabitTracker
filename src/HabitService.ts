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

    insertHabit(habit: Habit) : boolean {
        if(!this.searchHabit(habit.habitId).found) {
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
        if(this.searchHabit(habit_id).found && changed_habit.habitId == habit_id) {
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



