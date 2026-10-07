import { useState, type FormEvent } from 'react';

import type { Habit, measure_eng } from '../HabitService.ts';
import type { HabitRegister } from '../HabitRegisterService.ts';
import type { HabitTrackerService } from '../HabitTrackerService.ts';

interface HabitRegisterProps {
  service: HabitTrackerService;
}

export function HabitRegister({ service }: HabitRegisterProps) {
    const today = new Date();
    const [habits, setHabits] = useState<Habit[]>(
        service.getTrackedHabits(),
      );

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
            <ul className="habits">
        {habits.map((habit) => (
          <li>
            <div>
              <span>
                {habit.name}
                <button>
                Registro
            </button>
              </span>
            </div>
          </li>
        ))}
      </ul>
        </section>
    )
}