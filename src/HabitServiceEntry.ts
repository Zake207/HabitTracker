export interface HabitEntry {
    habitId: number
    date: Date
    completed: boolean
    realized: number
}

export class HabitEntryService {
    private habit_register: Map<number,Array<HabitEntry>> = new Map<number,[]>

    constructor(habit_resgisters : Map<number,Array<HabitEntry>> = new Map<number,[]>) {
        this.habit_register = habit_resgisters
    }

}