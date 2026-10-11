
import { describe, expect, it } from "vitest";
import { getDailyMetrics } from "../src/logic/MetricService";
import type { Habit } from "../src/logic/HabitService";
import type { HabitRegister } from "../src/logic/HabitRegisterService";

describe("getDailyMetrics", () => {
    const habits: Habit[] = [
        {
            habitId: 1,
            name: "Lectura",
            frequency: 1,
            target: 20,
            target_measure: "pages"
        },
        {
            habitId: 2,
            name: "Ejercicio",
            frequency: 1,
            target: 30,
            target_measure: "minutes"
        }
    ];

    it("should count total and completed registers", () => {
        const referenceDate = new Date(2026, 9, 11);

        const registers: HabitRegister[] = [
            {
                habitId: 1,
                date: new Date(2026, 9, 11),
                completed: true,
                realized: 25
            },
            {
                habitId: 2,
                date: new Date(2026, 9, 11),
                completed: false,
                realized: 20
            }
        ];

        const result = getDailyMetrics(
            habits,
            registers,
            1,
            referenceDate
        );

        expect(result).toHaveLength(1);
        expect(result[0].totalRegisters).toBe(2);
        expect(result[0].completedRegisters).toBe(1);
    });

    it("should include days without registers", () => {
        const result = getDailyMetrics(
            habits,
            [],
            3,
            new Date(2026, 9, 11)
        );

        expect(result).toHaveLength(3);

        for (const metric of result) {
            expect(metric.totalRegisters).toBe(0);
            expect(metric.completedRegisters).toBe(0);
        }
    });

    it("should count a register as completed when realized equals target", () => {
        const result = getDailyMetrics(
            habits,
            [
                {
                    habitId: 1,
                    date: new Date(2026, 9, 11),
                    completed: false,
                    realized: 20
                }
            ],
            1,
            new Date(2026, 9, 11)
        );

        expect(result[0].completedRegisters).toBe(1);
    });
});
