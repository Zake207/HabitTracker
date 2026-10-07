import { useState, type FormEvent } from 'react';

import type { Habit, measure_eng } from '../HabitService.ts';
import type { HabitRegister } from '../HabitRegisterService.ts';
import type { HabitTrackerService } from '../HabitTrackerService.ts';

interface HabitMetricsProps {
  service: HabitTrackerService;
}

export function HabitMetrics({ service }: HabitMetricsProps) {
    return (
        <section>
            <header>
                <h2>Metrics</h2>
            </header>
        </section>
    )
}