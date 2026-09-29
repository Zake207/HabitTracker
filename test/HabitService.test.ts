import {describe, it, expect} from "vitest"
import {Habit, HabitService} from "../src/HabitService";

describe("HabitService", () => {
	const service: HabitService = new HabitService;
    const habit1: Habit = {
        habitId: 1,
        name: "Leer",
        frequency: 5,
        target: 30,
        target_measure: "minutes"
    }
    const modified_habit1: Habit = {
        habitId: 1,
        name: "Leer",
        frequency: 3,
        target: 60,
        target_measure: "minutes"
    }
    
    const habit2: Habit = {
        habitId: 2,
        name: "Entrenar",
        frequency: 5,
        target: 4,
        target_measure: "times"
    }

    const invalid_habit_id: Habit = {
        habitId: 0,
        name: "Entrenar",
        frequency: 5,
        target: 4,
        target_measure: "times"
    }
    const invalid_habit_name: Habit = {
        habitId: 1,
        name: " ",
        frequency: 5,
        target: 4,
        target_measure: "times"
    }
    const invalid_habit_freq: Habit = {
        habitId: 1,
        name: " ",
        frequency: -4,
        target: 4,
        target_measure: "times"
    }
    const invalid_habit_tar: Habit = {
        habitId: 1,
        name: " ",
        frequency: 5,
        target: 3.2,
        target_measure: "times"
    }
    

    it("validates an habit", () => {
        expect(service.validateHabit(habit1)).toBe(true)
        expect(service.validateHabit(habit2)).toBe(true)

        expect(service.validateHabit(invalid_habit_id)).toBe(false)
        expect(service.validateHabit(invalid_habit_name)).toBe(false)
        expect(service.validateHabit(invalid_habit_freq)).toBe(false)
        expect(service.validateHabit(invalid_habit_tar)).toBe(false)
    });

	it("inserts an habit", () => {
        expect(service.insertHabit(habit1)).toBe(true)
        expect(service.insertHabit(habit2)).toBe(true)
        expect(service.insertHabit(habit1)).toBe(false)

    });

	it("deletes an habit", () => {
        expect(service.eraseHabit(1)).toBe(true)
        expect(service.eraseHabit(2)).toBe(true)
        expect(service.eraseHabit(1)).toBe(false)

    });

    it ("modifies an habit", () => {
        service.insertHabit(habit1)
        expect(service.modifyHabit(1, habit2)).toBe(false)
        expect(service.modifyHabit(1, modified_habit1)).toBe(true)
    });
});
