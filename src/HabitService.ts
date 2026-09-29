/**
 * Units used to measure a habit's target.
 */
export type measure_eng = "pages" | "minutes" | "times" | "amount"

/**
 * Represents a habit managed by {@link HabitService}.
 *
 * @property habitId - Unique positive integer identifying the habit.
 * @property name - Non-empty display name for the habit.
 * @property frequency - Positive integer describing how often the habit is performed.
 * @property target - Positive integer goal for each frequency period.
 * @property target_measure - Unit used to interpret the target value.
 */
export interface Habit {
    habitId: number
    name: string
    frequency: number
    target: number
    target_measure: measure_eng
}

/**
 * Checks whether a value is one of the supported target measurement units.
 *
 * @param value - Measurement value to check.
 * @returns `true` when the value is a supported {@link measure_eng}.
 */
function isValidTargetMeasure(value: string): boolean {
    return (
        value === "amount" ||
        value === "minutes" ||
        value === "pages" ||
        value === "times"
    );
}

/**
 * Stores and validates habits in an in-memory map keyed by habit ID.
 * Invalid habits are rejected during insertion and modification. Existing
 * habits can be searched for or removed by their unique identifier.
 */
export class HabitService {
    /** Habits currently managed by this service, indexed by habit ID. */
    private habits: Map<number, Habit> = new Map<number, Habit>

    /**
     * Creates a service, optionally initialized with a map of habits.
     *
     * @param habits_list - Initial habits keyed by their IDs.
     */
    constructor(habits_list: Map<number, Habit> = new Map<number, Habit>) {
        habits_list.forEach((habit) => {
            if (!this.validateHabit(habit)) {
                return undefined
            }
        })
        this.habits = habits_list
    }

    /**
     * Validates all required fields of a habit.
     *
     * IDs, frequencies, and targets must be positive integers; names must be
     * non-empty strings; and target measurements must be supported units.
     *
     * @param habit - Habit to validate.
     * @returns `true` if the habit satisfies all validation rules.
     */
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

    /**
     * Adds a valid habit when its ID is not already in use.
     *
     * @param habit - Habit to add.
     * @returns `true` if inserted; otherwise `false`.
     */
    insertHabit(habit: Habit) : boolean {

        if(this.validateHabit(habit) && !this.searchHabit(habit.habitId).found) {
            this.habits.set(habit.habitId, habit)
            return true
        }
        return false
    }

    /**
     * Removes a habit by ID.
     *
     * @param habit_id - ID of the habit to remove.
     * @returns `true` if a habit was removed; otherwise `false`.
     */
    eraseHabit(habit_id: number) : boolean {
        if(this.searchHabit(habit_id).found) {
            this.habits.delete(habit_id)
            return true
        }
        return false
    }

    /**
     * Replaces an existing habit with a valid habit using the same ID.
     *
     * @param habit_id - ID of the existing habit.
     * @param changed_habit - Replacement habit data.
     * @returns `true` if modified; otherwise `false`.
     */
    modifyHabit(habit_id: number, changed_habit: Habit) : boolean {
        if(this.searchHabit(habit_id).found 
        && changed_habit.habitId == habit_id
        && this.validateHabit(changed_habit)) {
            this.habits.set(habit_id, changed_habit)
            return true
        }
        return false
    }

    /**
     * Looks up a habit by ID without modifying the collection.
     *
     * @param habit_id - ID to search for.
     * @returns An object indicating whether the habit was found and, when
     * found, the corresponding habit.
     */
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



