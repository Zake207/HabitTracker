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
    const modifiedhabit1: Habit = {
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
        expect(service.modifyHabit(1, modifiedhabit1)).toBe(true)
    });
});
