import { HabitRegisterService, HabitRegister } from "./HabitRegisterService"
import { HabitService, Habit } from "./HabitService"


export class HabitTrackerService {
    private habits = new HabitService()
    private registers = new HabitRegisterService()

    constructor(habit_list: Map<number, Habit>) {
        this.habits = new HabitService(habit_list)
        habit_list.forEach((habit) => {
            this.registers.addEntry(habit.habitId)
        })
    }

    insertTrackedHabit(habit: Habit) : boolean {
        /** Cuando se quiera añadir un habito a trackear se debe insertar
         * en el atributo habits, y posterior a eso se debe crear una nueva 
         * entrada en el maps de registers, para ello hay que implementar un
         * metodo nuevo en dicha clase.
         */
        if (this.habits.insertHabit(habit)) {
            if (this.registers.addEntry(habit.habitId)) {
                return true
            }    
        }
        return false

    }

    eraseTrackedHabit(habit_id: number) : boolean {
        /** Se debe borrar del atributo habit y posterior a eso implementar
         * un metodo en la clase HabitRegisterService para eliminar entradas
         * completas dadas una id.
         */
        if (this.registers.dropEntry(habit_id)) {
            if (this.habits.eraseHabit(habit_id)) {
                return true                
            }
        }
        return false
    }

    addRegister(register: HabitRegister) {
        /** El usuario toma un habito realizado hoy, rellena sus credenciales
         * en la interfaz y estos datos se pasan a este metodo para meterlos en
         * el atributo y dejar reflejado su avance.
         */
        if (this.registers.insertRegister(register)) {
            return true
        }
        return false
    }
    // FALTA: MODIFICAR ATRIBUTOS DEL HABITO
    // PODER CONSULTAR INFORMACIÓN DEL HABITO
}