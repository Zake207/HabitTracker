import { useMemo, useState } from 'react'
import type { Habit } from '../logic/HabitService'
import type { HabitRegister } from '../logic/HabitRegisterService'
import { Metric, getDailyMetrics } from '../logic/MetricService'
import type { HabitTrackerService } from '../logic/HabitTrackerService'
import '../styles/Metrics.css'

interface HabitMetricsProps {
  service: HabitTrackerService
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  })
}

function getCompletedRegisters(
  habit: Habit,
  registers: HabitRegister[]
): number {
  return registers.filter((register) => register.realized >= habit.target)
    .length
}


function ActivityChart({ metrics }: { metrics: Metric[] }) {
  const maxValue = Math.max(
    1,
    ...metrics.map((metric) => metric.completedRegisters),
  )

  const chartWidth = 1000
  const chartTop = 30
  const chartBottom = 200
  const chartHeight = chartBottom - chartTop

  function isToday(date: Date): boolean {
    const today = new Date()

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  function getX(index: number): number {
    if (metrics.length <= 1) return chartWidth / 2

    return (index / (metrics.length - 1)) * chartWidth
  }

  function getY(value: number): number {
    return chartBottom - (value / maxValue) * chartHeight
  }

  const points = metrics
    .map(
      (metric, index) =>
        `${getX(index)},${getY(metric.completedRegisters)}`,
    )
    .join(' ')

  return (
    <div className="activity-chart">

      <div
        className="activity-chart__plot"
        role="img"
        aria-label="Gráfico lineal de objetivos de hábitos alcanzados cada día del mes"
      >
        <svg
          className="activity-chart__svg"
          viewBox={`0 0 ${chartWidth} 220`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((step) => {
            const y = chartTop + (chartHeight / 4) * step

            return (
              <line
                key={step}
                x1="0"
                y1={y}
                x2={chartWidth}
                y2={y}
                className="activity-chart__gridline"
              />
            )
          })}

          <polyline
            points={points}
            className="activity-chart__line"
          />

          {metrics.map((metric, index) => (
            <circle
              key={metric.date.toISOString()}
              cx={getX(index)}
              cy={getY(metric.completedRegisters)}
              r={isToday(metric.date) ? 7 : 4}
              className={
                isToday(metric.date)
                  ? 'activity-chart__point activity-chart__point--today'
                  : 'activity-chart__point'
              }
            >
              <title>
                {`${formatDate(metric.date)}: ${metric.completedRegisters} objetivos alcanzados`}
              </title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="activity-chart__dates">
        {metrics.map((metric) => (
          <div
            key={metric.date.toISOString()}
            className={
              isToday(metric.date)
                ? 'activity-chart__date activity-chart__date--today'
                : 'activity-chart__date'
            }
            title={formatDate(metric.date)}
          >
            {metric.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  )
}


function HabitDetail({
  habit,
  registers,
}: {
  habit: Habit
  registers: HabitRegister[]
}) {
  const completed = getCompletedRegisters(habit, registers)

  const completionRate =
    registers.length > 0 ? (completed / registers.length) * 100 : 0

  const averageRealized =
    registers.length > 0
      ? registers.reduce((sum, register) => sum + register.realized, 0) /
        registers.length
      : 0

  const weeksWithFrequency = (() => {
    const weeklyCounts = new Map<string, number>()

    for (const register of registers) {
      const weekStart = new Date(register.date)
      weekStart.setHours(0, 0, 0, 0)

      // La semana comienza el lunes.
      const daysSinceMonday = (weekStart.getDay() + 6) % 7
      weekStart.setDate(weekStart.getDate() - daysSinceMonday)

      const weekKey = [
        weekStart.getFullYear(),
        String(weekStart.getMonth() + 1).padStart(2, '0'),
        String(weekStart.getDate()).padStart(2, '0'),
      ].join('-')

      weeklyCounts.set(weekKey, (weeklyCounts.get(weekKey) ?? 0) + 1)
    }

    return [...weeklyCounts.values()].filter(
      (count) => count >= habit.frequency
    ).length
  })()

  const recentRegisters = useMemo(() => {
    const today = new Date()
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 29
    )

    return registers
      .filter((register) => register.date >= firstDay)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [registers])

  const maxRealized = Math.max(
    habit.target,
    1,
    ...recentRegisters.map((register) => register.realized)
  )

  return (
    <section className="habit-detail">
      <header className="habit-detail__header">
        <div>
          <h2>{habit.name}</h2>
          <p>
            Objetivo: {habit.target} {habit.target_measure}
          </p>
        </div>
      </header>

      <div className="metric-cards">
        <article className="metric-card">
          <span>Total de registros</span>
          <strong>{registers.length}</strong>
        </article>

        <article className="metric-card">
          <span>Objetivos alcanzados</span>
          <strong>{completed}</strong>
        </article>

        <article className="metric-card">
          <span>Tasa de cumplimiento</span>
          <strong>{completionRate.toFixed(1)}%</strong>
        </article>

        <article className="metric-card">
          <span>Media realizada</span>
          <strong>{averageRealized.toFixed(1)}</strong>
        </article>
      </div>

      <article className="metric-card">
        <span>Semanas con frecuencia alcanzada</span>
        <strong>{weeksWithFrequency}</strong>
      </article>

      <section className="habit-evolution">
        <h3>Realización reciente</h3>

        {recentRegisters.length === 0 ? (
          <p className="metrics-empty">
            No hay registros de este hábito en los últimos 30 días.
          </p>
        ) : (
          <div className="habit-evolution__list">
            {recentRegisters.map((register) => (
              <div
                className="habit-evolution__row"
                key={`${register.habitId}-${register.date.getTime()}`}
              >
                <time>{formatDate(register.date)}</time>

                <div className="habit-evolution__track">
                  <div
                    className="habit-evolution__bar"
                    style={{
                      width: `${Math.min(
                        100,
                        (register.realized / maxRealized) * 100
                      )}%`,
                    }}
                  />
                </div>

                <span>{register.realized}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}

export function HabitMetrics({ service }: HabitMetricsProps) {
  const habits = service.getTrackedHabits()
  const registers = service.getAllTrackedRegisters()

  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null)

  const selectedHabit =
    habits.find((habit) => habit.habitId === selectedHabitId) ?? habits[0]

  const dailyMetrics = useMemo(
    () => getDailyMetrics(habits, registers),
    [habits, registers]
  )

  const selectedRegisters = selectedHabit
    ? registers.filter((register) => register.habitId === selectedHabit.habitId)
    : []

  return (
    <main className="metrics-panel">
      <section className="metrics-overview">
        <header className="metrics-section-header">
          <div>
            <h1>Actividad diaria</h1>
            <p>Registros y objetivos alcanzados durante los últimos 30 días.</p>
          </div>
        </header>

        {registers.length === 0 ? (
          <p className="metrics-empty">
            Todavía no hay registros para mostrar.
          </p>
        ) : (
          <ActivityChart metrics={dailyMetrics} />
        )}
      </section>

      <section className="metrics-details">
        <aside className="metrics-habit-list">
          <h2>Mis hábitos</h2>

          {habits.length === 0 ? (
            <p className="metrics-empty">
              Todavía no has creado ningún hábito.
            </p>
          ) : (
            <ul>
              {habits.map((habit) => (
                <li key={habit.habitId}>
                  <button
                    type="button"
                    className={
                      selectedHabit?.habitId === habit.habitId
                        ? 'habit-option habit-option--selected'
                        : 'habit-option'
                    }
                    aria-pressed={selectedHabit?.habitId === habit.habitId}
                    onClick={() => setSelectedHabitId(habit.habitId)}
                  >
                    <span>{habit.name}</span>
                    <span className="habit-option__count">
                      {
                        registers.filter(
                          (register) => register.habitId === habit.habitId
                        ).length
                      }
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="metrics-habit-detail">
          {selectedHabit ? (
            <HabitDetail habit={selectedHabit} registers={selectedRegisters} />
          ) : (
            <p className="metrics-empty">
              Crea un hábito para consultar sus métricas.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default HabitMetrics
