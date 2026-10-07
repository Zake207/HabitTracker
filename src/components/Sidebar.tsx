import type { View } from '../App.tsx';

export interface SidebarProps {
  view: View;
  setView: (view: View) => void;
}

export function Sidebar({ view, setView }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Habit Tracker</h2>

      <nav className="sidebar-nav">
        <button
          className="sidebar-button"
          onClick={() => setView('habits')}
          disabled={view === 'habits'}
        >
          Hábitos
        </button>

        <button
          className="sidebar-button"
          onClick={() => setView('registers')}
          disabled={view === 'registers'}
        >
          Registros
        </button>

        <button
          className="sidebar-button"
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