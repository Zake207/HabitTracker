interface Habit {
    habitId: number
    name: string
    frequency: number
    target: number
    target_measure: string
}

interface HabitEntry {
    habitId: number
    date: Date
    completed: boolean
    type: number
}

class HabitService {
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
        if(this.searchHabit(habit_id).found) {
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
