
import { useMemo, useState } from 'react';
import type { Habit } from '../logic/HabitService';
import type { HabitRegister } from '../logic/HabitRegisterService';
import { Metric, getDailyMetrics } from '../logic/MetricService';
import type { HabitTrackerService } from '../logic/HabitTrackerService';
import '../styles/Metrics.css';

interface HabitMetricsProps {
    service: HabitTrackerService;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
    });
}

function getCompletedRegisters(
    habit: Habit,
    registers: HabitRegister[],
): number {
    return registers.filter(
        register =>
            register.realized >= habit.target,
    ).length;
}

function ActivityChart({
    metrics,
}: {
    metrics: Metric[];
}) {
    const maxValue = Math.max(
        1,
        ...metrics.map(metric => metric.totalRegisters),
    );

    return (
        <div className="activity-chart">
            <div className="activity-chart__legend">
                <span>
                    <i className="legend-dot legend-dot--total" />
                    Total de registros
                </span>
                <span>
                    <i className="legend-dot legend-dot--completed" />
                    Objetivo alcanzado
                </span>
            </div>

            <div
                className="activity-chart__bars"
                role="img"
                aria-label="Registros diarios totales y registros que alcanzan el objetivo"
            >
                {metrics.map(metric => (
                    <div
                        className="activity-chart__day"
                        key={metric.date.toISOString()}
                        title={`${formatDate(metric.date)}: ${metric.totalRegisters} registros, ${metric.completedRegisters} objetivos alcanzados`}
                    >
                        <div className="activity-chart__bar-group">
                            <div
                                className="activity-bar activity-bar--total"
                                style={{
                                    height: `${metric.totalRegisters / maxValue * 100}%`,
                                }}
                            />
                            <div
                                className="activity-bar activity-bar--completed"
                                style={{
                                    height: `${metric.completedRegisters / maxValue * 100}%`,
                                }}
                            />
                        </div>

                        <span className="activity-chart__date">
                            {formatDate(metric.date)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HabitDetail({
    habit,
    registers,
}: {
    habit: Habit;
    registers: HabitRegister[];
}) {
    const completed = getCompletedRegisters(habit, registers);

    const completionRate = registers.length > 0
        ? (completed / registers.length) * 100
        : 0;

    const averageRealized = registers.length > 0
        ? registers.reduce(
            (sum, register) => sum + register.realized,
            0,
        ) / registers.length
        : 0;

    const recentRegisters = useMemo(() => {
        const today = new Date();
        const firstDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 29,
        );

        return registers
            .filter(register => register.date >= firstDay)
            .sort(
                (a, b) => a.date.getTime() - b.date.getTime(),
            );
    }, [registers]);

    const maxRealized = Math.max(
        habit.target,
        1,
        ...recentRegisters.map(register => register.realized),
    );

    return (
        <section className="habit-detail">
            <header className="habit-detail__header">
                <div>
                    <h2>{habit.name}</h2>
                    <p>
                        Objetivo: {habit.target}{' '}
                        {habit.target_measure}
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

            <section className="habit-evolution">
                <h3>Realización reciente</h3>

                {recentRegisters.length === 0 ? (
                    <p className="metrics-empty">
                        No hay registros de este hábito en los
                        últimos 30 días.
                    </p>
                ) : (
                    <div className="habit-evolution__list">
                        {recentRegisters.map(register => (
                            <div
                                className="habit-evolution__row"
                                key={`${register.habitId}-${register.date.getTime()}`}
                            >
                                <time>
                                    {formatDate(register.date)}
                                </time>

                                <div className="habit-evolution__track">
                                    <div
                                        className="habit-evolution__bar"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                register.realized / maxRealized * 100,
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <span>
                                    {register.realized}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}

export function HabitMetrics({
    service,
}: HabitMetricsProps) {
    const habits = service.getTrackedHabits();
    const registers = service.getAllTrackedRegisters();

    const [selectedHabitId, setSelectedHabitId] =
        useState<number | null>(null);

    const selectedHabit = habits.find(
        habit => habit.habitId === selectedHabitId,
    ) ?? habits[0];

    const dailyMetrics = useMemo(
        () => getDailyMetrics(habits, registers, 30),
        [habits, registers],
    );

    const selectedRegisters = selectedHabit
        ? registers.filter(
            register => register.habitId === selectedHabit.habitId,
        )
        : [];

    return (
        <main className="metrics-panel">
            <section className="metrics-overview">
                <header className="metrics-section-header">
                    <div>
                        <h1>Actividad diaria</h1>
                        <p>
                            Registros y objetivos alcanzados
                            durante los últimos 30 días.
                        </p>
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
                            {habits.map(habit => (
                                <li key={habit.habitId}>
                                    <button
                                        type="button"
                                        className={
                                            selectedHabit?.habitId ===
                                            habit.habitId
                                                ? 'habit-option habit-option--selected'
                                                : 'habit-option'
                                        }
                                        aria-pressed={
                                            selectedHabit?.habitId ===
                                            habit.habitId
                                        }
                                        onClick={() =>
                                            setSelectedHabitId(
                                                habit.habitId,
                                            )
                                        }
                                    >
                                        <span>{habit.name}</span>
                                        <span className="habit-option__count">
                                            {
                                                registers.filter(
                                                    register =>
                                                        register.habitId ===
                                                        habit.habitId,
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
                        <HabitDetail
                            habit={selectedHabit}
                            registers={selectedRegisters}
                        />
                    ) : (
                        <p className="metrics-empty">
                            Crea un hábito para consultar sus métricas.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}

export default HabitMetrics;
