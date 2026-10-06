import type { View } from '../App.tsx';

export interface SidebarProps {
    view: View;
    setView: (view: View) => void;
}

export function Sidebar({ view, setView }: SidebarProps) {
    return (
        <aside>
            <h2>Habit Tracker</h2>

            <nav>
                <button
                    onClick={() => setView('habits')}
                    disabled={view === 'habits'}
                >
                    Hábitos
                </button>

                <button
                    onClick={() => setView('registers')}
                    disabled={view === 'registers'}
                >
                    Registros
                </button>

                <button
                    onClick={() => setView('metrics')}
                    disabled={view === 'metrics'}
                >
                    Métricas
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;