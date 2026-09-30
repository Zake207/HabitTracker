/**
 * Represents a registration of a habit for a specific calendar day.
 *
 * @interface HabitRegister
 * @property {number} habitId - Identifier of the associated habit.
 * @property {Date} date - Calendar day on which the habit was registered.
 * @property {boolean} completed - Indicates whether the habit was completed.
 * @property {number} realized - Amount of the habit that was realized.
 */
export interface HabitRegister {
    habitId: number
    date: Date
    completed: boolean
    realized: number
}

/**
 * Determines whether the specified date is after the current calendar day.
 * Time components are ignored during the comparison.
 *
 * @param {Date} date - Date to be evaluated.
 * @returns {boolean} True if the date is in the future; otherwise, false.
 */
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

/**
 * Provides operations for managing habit registrations.
 *
 * @class HabitRegisterService
 */
export class HabitRegisterService {
    /**
     * Collection of habit registrations indexed by habit identifier.
     *
     * @private
     */
    private habit_register: Map<number, Array<HabitRegister>> =
        new Map<number, Array<HabitRegister>>()
    /**
     * Creates a new HabitRegisterService.
     *
     * @param {Map<number, Array<HabitRegister>>} habit_resgisters
     * Initial collection of habit registrations.
     * @throws {Error} If any provided registration is invalid.
     */
    constructor( habit_resgisters: Map<number, Array<HabitRegister>> = new Map<number, []>) {
        this.habit_register = habit_resgisters
        habit_resgisters.forEach((registers) => {
            registers.forEach((register) => {
                if (!this.validateRegister(register)) {
                    throw new Error("Invalid HabitRegister");
                }
            })
        })
    }

    /**
     * Validates whether a habit registration satisfies all domain constraints.
     *
     * @param {HabitRegister} register - Registration to validate.
     * @returns {boolean} True if the registration is valid; otherwise, false.
     */
    validateRegister(register: HabitRegister): boolean {
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

    /**
     * Inserts a new habit registration.
     *
     * @param {HabitRegister} register - Registration to insert.
     * @returns {boolean} True if the registration was inserted; otherwise, false.
     */
    insertRegister(register: HabitRegister): boolean {
        if (
            this.validateRegister(register)
            && !this.searchRegister(register.habitId, register.date).found
        ) {
            this.habit_register.get(register.habitId)!.push(register)
            return true
        }
        return false
    }

    /**
     * Modifies an existing habit registration.
     *
     * @param {HabitRegister} new_register - Registration containing the updated data.
     * @returns {boolean} True if the registration was modified; otherwise, false.
     */
    modifyRegister(new_register: HabitRegister): boolean {
        const register = this.searchRegister(
            new_register.habitId,
            new_register.date
        )
        if (
            this.validateRegister(new_register)
            && register.found
        ) {
            this.habit_register.get(new_register.habitId)![register.index] =
                new_register
            return true
        }
        return false
    }

    /**
     * Removes a habit registration for a specific habit and calendar day.
     *
     * @param {number} habit_id - Identifier of the habit.
     * @param {Date} date - Calendar day associated with the registration.
     * @returns {boolean} True if the registration was removed; otherwise, false.
     */
    eraseRegister(habit_id: number, date: Date): boolean {
        const register_to_erase = this.searchRegister(
            habit_id,
            date
        )
        if (register_to_erase.found) {
            this.habit_register
                .get(habit_id)!
                .splice(register_to_erase.index, 1)
            return true
        }
        return false
    }

    /**
     * Searches for a habit registration by habit identifier and calendar day.
     * Time components of the dates are ignored during the comparison.
     *
     * @param {number} habit_id - Identifier of the habit.
     * @param {Date} date - Calendar day to search for.
     * @returns {{
     *     found: boolean,
     *     register: HabitRegister | undefined,
     *     index: number
     * }} Search result containing the registration status, the matching
     * registration and its index.
     */
    searchRegister(
        habit_id: number,
        date: Date
    ): {
        found: boolean,
        register: HabitRegister | undefined,
        index: number
    } {
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