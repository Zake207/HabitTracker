import type { Habit } from './HabitService'
import type { HabitRegister } from './HabitRegisterService'

/**
 * @interface Metric
 * @description Represents the daily activity metrics displayed in the global chart.
 */
export interface Metric {
  date: Date
  totalRegisters: number
  completedRegisters: number
}

/**
 * @function getDayKey
 * @description Returns a local calendar date as a YYYY-MM-DD key.
 * @param date - Date to normalize.
 * @returns The date key without time information.
 */
export function getDayKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * @function getDailyMetrics
 * @description Calculates total and completed registers for each day
 * in the selected period, including days without activity.
 * @param habits - Existing habits and their targets.
 * @param registers - Existing habit registers.
 * @param numberOfDays - Number of calendar days to include.
 * @param referenceDate - Date used as the final day of the period.
 * @returns Daily metrics ordered chronologically.
 */

export function getDailyMetrics(
  habits: readonly Habit[],
  registers: readonly HabitRegister[],
  referenceDate = new Date()
): Metric[] {
  const targets = new Map(habits.map((habit) => [habit.habitId, habit.target]))

  const metricsByDay = new Map<string, Metric>()

  const firstDay = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1
  )

  const lastDay = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    0
  )

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), day)

    metricsByDay.set(getDayKey(date), {
      date,
      totalRegisters: 0,
      completedRegisters: 0,
    })
  }

  for (const register of registers) {
    const metric = metricsByDay.get(getDayKey(register.date))

    if (!metric) {
      continue
    }

    metric.totalRegisters++

    const target = targets.get(register.habitId)

    if (target !== undefined && register.realized >= target) {
      metric.completedRegisters++
    }
  }

  return Array.from(metricsByDay.values())
}
