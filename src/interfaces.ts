interface Habit {
    id: number
    name: string
    frecuency: number
    target: number
    target_measure: string
}

interface HabitEntry {
    habitId: number
    date: Date
    completed: boolean
    type: number
}

let habito_1: Habit = {
    id: 1,
    name: "Entrenar",
    frecuency: 4,
    target: 4,
    target_measure: "dias"
}