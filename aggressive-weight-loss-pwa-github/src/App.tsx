import { useEffect, useCallback } from 'react';
import { useStore } from './store/useStore';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Meals from './components/Meals';
import Workouts from './components/Workouts';
import Tracker from './components/Tracker';
import Journal from './components/Journal';
import Calories from './components/Calories';
import More from './components/More';
import BadgeNotification from './components/BadgeNotification';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: HomeIcon },
  { id: 'tasks', label: 'Tasks', icon: CheckIcon },
  { id: 'tracker', label: 'Track', icon: ScaleIcon },
  { id: 'workouts', label: 'Train', icon: BoltIcon },
  { id: 'more', label: 'More', icon: GridIcon },
];

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 3v19" />
      <path d="M5 8l7-5 7 5" />
      <path d="M3 21h18" />
      <path d="M3 12s2-2 4.5-2 4 2 4.5 2 2-2 4.5-2 4.5 2 4.5 2" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

const PAGE_MAP: Record<string, React.FC> = {
  dashboard: Dashboard,
  tasks: Tasks,
  meals: Meals,
  calories: Calories,
  workouts: Workouts,
  tracker: Tracker,
  journal: Journal,
  more: More,
};

export default function App() {
  const { onboardingComplete, currentTab, setCurrentTab, autoReset, resetTasks, taskHistory } = useStore();

  // Auto-reset tasks at midnight
  const checkMidnightReset = useCallback(() => {
    if (!autoReset) return;
    const today = new Date().toISOString().split('T')[0];
    const lastRecord = taskHistory.find(h => h.date === today);
    const lastReset = localStorage.getItem('warpath-last-reset');
    if (lastReset !== today) {
      localStorage.setItem('warpath-last-reset', today);
      if (!lastRecord) {
        resetTasks();
      }
    }
  }, [autoReset, resetTasks, taskHistory]);

  useEffect(() => {
    checkMidnightReset();
    const interval = setInterval(checkMidnightReset, 60000);
    return () => clearInterval(interval);
  }, [checkMidnightReset]);

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  const ActivePage = PAGE_MAP[currentTab] || Dashboard;

  return (
    <div className="bg-black min-h-screen text-white">
      <BadgeNotification />
      {/* Main content */}
      <div className="max-w-lg mx-auto relative">
        <div className="overflow-y-auto" style={{ height: '100dvh', paddingBottom: '80px' }}>
          <ActivePage />
        </div>

        {/* Bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-gray-800">
          <div className="max-w-lg mx-auto">
            <div className="flex">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all active:scale-90 ${
                      isActive ? 'text-cyan-400' : 'text-gray-600'
                    }`}
                  >
                    <Icon />
                    <span className="text-xs font-bold">{item.label}</span>
                    {isActive && <span className="w-1 h-1 bg-cyan-400 rounded-full" />}
                  </button>
                );
              })}
            </div>
            {/* Safe area */}
            <div style={{ height: 'env(safe-area-inset-bottom)' }} />
          </div>
        </nav>
      </div>

      {/* Floating quick-nav for extra pages - always visible */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-30">
        {[
          { id: 'calories', label: '🔥' },
          { id: 'meals', label: '🍽️' },
          { id: 'journal', label: '📔' },
        ].filter(item => item.id !== currentTab).map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className="w-11 h-11 bg-gray-900/90 border border-gray-700 rounded-xl text-xl flex items-center justify-center active:scale-90 transition-transform shadow-lg"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
