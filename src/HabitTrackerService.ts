import { HabitRegisterService, HabitRegister } from "./HabitRegisterService"
import { HabitService, Habit, measure_eng } from "./HabitService"


export class HabitTrackerService {
    private habits = new HabitService()
    private registers = new HabitRegisterService()

    constructor(habit_list: Map<number, Habit>) {
        this.habits = new HabitService(habit_list)
        habit_list.forEach((habit) => {
            this.registers.addEntry(habit.habitId)
        })
    }

    insertTrackedHabit( habit_id: number, name: string, frequency: number, 
        target: number, target_measure: measure_eng ): boolean { 
        const new_habit: Habit = { 
            habitId: habit_id, 
            name: name, 
            frequency: frequency, 
            target: target, 
            target_measure: target_measure 
        }
        if (this.habits.insertHabit(new_habit)) { 
            if (this.registers.addEntry(habit_id)) { 
                return true } 
            } 
            return false 
    }

    eraseTrackedHabit(habit_id: number, date: Date, completed: boolean, realized: number) : boolean {
        const new_register: HabitRegister = { 
            habitId: habit_id, 
            date: date, 
            completed: completed, 
            realized: realized 
        } 
        if (this.registers.insertRegister(new_register)) { 
            return true 
        } 
        return false
    }

    addRegister(register: HabitRegister) {
        if (this.registers.insertRegister(register)) {
            return true
        }
        return false
    }
    
    modifyTrackedHabit(habit_id: number, new_name: string, new_frequency: number,
        new_target: number, new_target_measure: measure_eng) : boolean {
            const habit_to_modify = this.habits.searchHabit(habit_id)
            if (!habit_to_modify.found) {
                return false
            }
            const modified_habit : Habit = {
                habitId: habit_id,
                name: new_name, 
                frequency: new_frequency, 
                target: new_target, 
                target_measure: new_target_measure
            }
            if (this.habits.modifyHabit(habit_id, modified_habit)) {
                return true
            }
            return false
    }

    getTrackedHabits() : HabitService {
        return this.habits
    }

    getRegisters() : HabitRegisterService {
        return this.registers
    }
}