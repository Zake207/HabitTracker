import {describe, it, expect, beforeEach} from "vitest"
import {HabitService} from "../src/HabitService";

describe("HabitService", () => {
	let service: HabitService;

	beforeEach(() => {
		service = new HabitService();
	});

	it("starts with no habits", () => {});

	it("creates and returns a habit", () => {});

	it("deletes a habit", () => {});
});
