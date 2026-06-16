import { useState, useEffect, useRef } from 'react';
import { WORKOUT_DATABASE, EXERCISE_LIBRARY } from '../data/workouts';
import { useStore } from '../store/useStore';
import type { Workout } from '../types';

const PHASE_COLORS = {
  1: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400', label: 'FOUNDATION' },
  2: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'INTENSIFICATION' },
  3: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400', label: 'MAX AGGRESSION' },
};

type WorkoutTab = 'plans' | 'log' | 'timer' | 'library';

export default function Workouts() {
  const { workoutLogs, addWorkoutLog } = useStore();
  const [activeTab, setActiveTab] = useState<WorkoutTab>('plans');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<0 | 1 | 2 | 3>(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchEx, setSearchEx] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState('60');
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  const today = new Date().toISOString().split('T')[0];

  const filtered = WORKOUT_DATABASE.filter(w => {
    if (phaseFilter !== 0 && w.phase !== phaseFilter) return false;
    if (typeFilter !== 'all' && w.type !== typeFilter) return false;
    return true;
  });

  const filteredExercises = EXERCISE_LIBRARY.filter(e =>
    !searchEx || e.name.toLowerCase().includes(searchEx.toLowerCase())
  );

  const logWorkout = (workout: Workout) => {
    addWorkoutLog({
      date: today,
      workoutId: workout.id,
      workoutName: workout.name,
      exercises: workout.exercises.map(e => ({
        exerciseId: e.id,
        name: e.name,
        sets: Array.from({ length: e.sets || 3 }, () => ({ reps: e.reps || 0, weight: 0, completed: false })),
        completed: false,
      })),
      completed: true,
      caloriesBurned: workout.estimatedCalories,
    });
    setSelectedWorkout(null);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="pb-24 px-4 space-y-4">
      <div className="pt-6">
        <h1 className="text-2xl font-black text-white">WORKOUTS</h1>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {(['plans', 'log', 'timer', 'library'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-none px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}
          >
            {tab === 'plans' ? '📋 Plans' : tab === 'log' ? '📅 Log' : tab === 'timer' ? '⏱️ Timer' : '📚 Library'}
          </button>
        ))}
      </div>

      {/* PLANS TAB */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {/* Phase Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {([0, 1, 2, 3] as const).map(p => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`flex-none px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${phaseFilter === p ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}
              >
                {p === 0 ? 'All Phases' : `Phase ${p}`}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {['all', 'hiit', 'strength', 'cardio', 'core', 'bodyweight', 'finisher'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`flex-none px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${typeFilter === t ? 'bg-gray-300 text-black' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {filtered.map(workout => {
            const phaseConfig = PHASE_COLORS[workout.phase];
            const isExpanded = selectedWorkout?.id === workout.id;
            return (
              <div key={workout.id} className={`bg-gray-950 border ${phaseConfig.border} rounded-2xl overflow-hidden`}>
                <button
                  onClick={() => setSelectedWorkout(isExpanded ? null : workout)}
                  className="w-full px-4 py-4 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`text-xs font-black mb-1 ${phaseConfig.text}`}>
                        PHASE {workout.phase} — {phaseConfig.label}
                      </div>
                      <h3 className="text-white font-bold text-lg">{workout.name}</h3>
                      <p className="text-gray-400 text-sm mt-0.5">{workout.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-gray-300 text-sm">⏱ {workout.duration}min</span>
                        <span className="text-orange-400 text-sm">🔥 ~{workout.estimatedCalories} cal</span>
                        <span className="text-gray-500 text-sm capitalize">• {workout.type}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div key={i} className={`w-5 h-1.5 rounded-full ${i < workout.difficulty ? 'bg-red-500' : 'bg-gray-800'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-600 ml-2">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-800 px-4 py-4 space-y-4">
                    <div className="space-y-3">
                      {workout.exercises.map((ex, i) => (
                        <div key={ex.id} className="bg-gray-900 rounded-xl p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-bold">{i + 1}. {ex.name}</div>
                              <div className="text-cyan-400 text-sm">
                                {ex.duration
                                  ? `${ex.sets}x ${ex.duration}s`
                                  : `${ex.sets}x${ex.reps} reps`
                                }
                                {ex.rest > 0 && <span className="text-gray-500 ml-2">rest: {ex.rest}s</span>}
                              </div>
                            </div>
                            <button
                              onClick={() => { setTimerInput(String(ex.rest || 60)); setActiveTab('timer'); }}
                              className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-lg"
                            >
                              ⏱ Set Timer
                            </button>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">{ex.formCues}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => logWorkout(workout)}
                      className="w-full py-3.5 bg-cyan-500 rounded-xl text-black font-black text-lg active:scale-95 transition-transform"
                    >
                      ✓ LOG THIS WORKOUT
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* LOG TAB */}
      {activeTab === 'log' && (
        <div className="space-y-3">
          <h2 className="text-gray-400 font-bold text-sm">WORKOUT HISTORY</h2>
          {[...workoutLogs].reverse().map(log => (
            <div key={log.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-bold">{log.workoutName}</div>
                  <div className="text-gray-400 text-sm">{log.date}</div>
                </div>
                <div className="text-right">
                  {log.completed && <div className="text-green-400 font-bold">✓ Completed</div>}
                  <div className="text-orange-400 text-sm">{log.caloriesBurned} cal</div>
                </div>
              </div>
            </div>
          ))}
          {workoutLogs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">💪</div>
              <div>No workouts logged yet.</div>
              <div className="text-sm">Log your first session in Plans tab!</div>
            </div>
          )}
        </div>
      )}

      {/* TIMER TAB */}
      {activeTab === 'timer' && (
        <div className="flex flex-col items-center gap-6 py-8">
          <h2 className="text-white font-black text-2xl">REST TIMER</h2>
          <div className="relative w-52 h-52">
            <svg className="w-52 h-52 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="#06b6d4" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - timeLeft / timerSeconds)}`}
                strokeLinecap="round" className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black text-5xl">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {[30, 60, 90, 120].map(s => (
              <button
                key={s}
                onClick={() => { setTimerInput(String(s)); setTimeLeft(s); setTimerSeconds(s); setTimerRunning(false); }}
                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm font-bold"
              >
                {s}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-center outline-none focus:border-cyan-500"
              value={timerInput}
              onChange={e => { setTimerInput(e.target.value); setTimeLeft(parseInt(e.target.value) || 0); setTimerSeconds(parseInt(e.target.value) || 60); }}
            />
            <span className="text-gray-400">seconds</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setTimerRunning(!timerRunning); }}
              className={`px-8 py-4 rounded-2xl font-black text-lg transition-all active:scale-95 ${timerRunning ? 'bg-yellow-500 text-black' : 'bg-cyan-500 text-black'}`}
            >
              {timerRunning ? '⏸ PAUSE' : '▶ START'}
            </button>
            <button
              onClick={() => { setTimerRunning(false); setTimeLeft(timerSeconds); }}
              className="px-6 py-4 rounded-2xl bg-gray-800 text-white font-bold"
            >
              ↺ Reset
            </button>
          </div>

          {timeLeft === 0 && !timerRunning && (
            <div className="text-green-400 font-black text-2xl animate-bounce">🔔 REST OVER! GET BACK TO IT!</div>
          )}
        </div>
      )}

      {/* LIBRARY TAB */}
      {activeTab === 'library' && (
        <div className="space-y-3">
          <input
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            placeholder="🔍 Search exercises..."
            value={searchEx}
            onChange={e => setSearchEx(e.target.value)}
          />
          {filteredExercises.map(ex => (
            <div key={ex.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-bold">{ex.name}</div>
                  <div className="text-cyan-400 text-xs">{ex.category}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className={`w-3 h-1.5 rounded-full ${i < ex.difficulty ? 'bg-orange-500' : 'bg-gray-800'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-2">{ex.description}</p>
              <p className="text-gray-500 text-xs mt-1 italic">📌 {ex.formCues}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {ex.muscleGroups.map(mg => (
                  <span key={mg} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{mg}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
