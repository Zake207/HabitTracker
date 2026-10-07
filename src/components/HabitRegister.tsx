import { useState, type FormEvent } from 'react';

import type { Habit, measure_eng } from '../HabitService.ts';
import type { HabitRegister } from '../HabitRegisterService.ts';
import type { HabitTrackerService } from '../HabitTrackerService.ts';

interface HabitRegisterProps {
  service: HabitTrackerService;
}

export function HabitRegister({ service }: HabitRegisterProps) {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    return (
        <section>
            <header>
                <h2>{formattedDate}</h2>
            </header>
        </section>
    )
}