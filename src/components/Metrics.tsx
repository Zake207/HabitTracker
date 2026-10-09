import { useState, type FormEvent } from 'react'

import type { Habit, measure_eng } from '../logic/HabitService.ts'
import type { HabitRegister } from '../logic/HabitRegisterService.ts'
import type { HabitTrackerService } from '../logic/HabitTrackerService.ts'

interface HabitMetricsProps {
  service: HabitTrackerService
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
