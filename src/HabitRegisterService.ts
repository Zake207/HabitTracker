export interface HabitRegister {
    habitId: number
    date: Date
    completed: boolean
    realized: number
}

function isFutureDay(date: Date): boolean {
    const today = new Date();

    const dateToCompare = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
    const currentDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    return dateToCompare > currentDay;
}

export class HabitRegisterService {
    private habit_register: Map<number,Array<HabitRegister>> = new Map<number, Array<HabitRegister>>()

    constructor(habit_resgisters : Map<number,Array<HabitRegister>> = new Map<number,[]>) {
        this.habit_register = habit_resgisters
        habit_resgisters.forEach((registers, id) => {
            registers.forEach((register) => {
                if (!this.validateRegister(register)) {
                    throw new Error("Invalid HabitRegister");
                }
            })
        })
    }

    validateRegister(register: HabitRegister) : boolean {
        const d_check = !isNaN(register.date.getTime()) 
        && !isFutureDay(register.date)

        const r_check = typeof register.realized === "number"
        && register.realized > 0

        const c_check = typeof register.completed === "boolean"

        const h_check = this.habit_register.has(register.habitId)
        && typeof register.habitId === "number"
        && Number.isInteger(register.habitId)
        && register.habitId > 0

        if (d_check && r_check && c_check && h_check) {
            return true
        }
        return false 
    }
    
    insertRegister(register: HabitRegister) : boolean {
        if (this.validateRegister(register)
        && !this.searchRegister(register.habitId, register.date).found) {
            this.habit_register.get(register.habitId)!.push(register)
            return true
        }
        return false 
    }
    
    modifyRegister(new_register: HabitRegister) : boolean {
        const register = this.searchRegister(new_register.habitId,new_register.date)
        if(this.validateRegister(new_register)
        && register.found) {
            this.habit_register.get(new_register.habitId)![register.index] = new_register
            return true
        }
        return false 
    }

    eraseRegister(habit_id: number, date: Date) : boolean {
        const register_to_erase = this.searchRegister(habit_id, date)
        if (register_to_erase.found) {
            this.habit_register.get(habit_id)!.splice(register_to_erase.index, 1)
            return true
        } 
        return false 
    }

    searchRegister(habit_id: number,date: Date) : 
    { found: boolean, register: HabitRegister | undefined, index: number } {
        const registers = this.habit_register.get(habit_id);
        if (registers === undefined) {
            return {
                found: false,
                register: undefined,
                index: -1
            };
        }
        const index = registers.findIndex(
            register =>
                register.date.getFullYear() === date.getFullYear() &&
                register.date.getMonth() === date.getMonth() &&
                register.date.getDate() === date.getDate()
        );
        if (index === -1) {
            return {
                found: false,
                register: undefined,
                index: -1
            };
        }
        return {
            found: true,
            register: registers[index],
            index: index
        };
    }
}