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
        habit_resgisters.forEach((registers, id) => {
            registers.forEach((register) => {
                if (!this.validateRegister(register)) {
                    return false
                }
            })
        })
        this.habit_register = habit_resgisters
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
        // validar, buscar que no exista, luego insertar en el id correspondiente
        return false 
    }
    
    modifyRegister(habit_id: number, date: Date) : boolean {
        // para un habito, modifica el de una fecha en concreto (por lo que la fecha queda intacta)
        return false 
    }

    eraseRegister(habit_id: number, date: Date) : boolean {
        // para un habito borra el registro de un dia concreto 
        return false 
    }

    searchRegister(habit_id: number, date: Date) : {found: boolean, register: HabitRegister | undefined} { 
        // dado un habito, se le pasa una fecha y encuentra en el array la unica instancia que debe de haber
        return {found: false, register: undefined} 
    }

}