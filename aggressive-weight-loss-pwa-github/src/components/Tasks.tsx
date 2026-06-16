import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Task } from '../types';

const CATEGORY_CONFIG = {
  nutrition: { label: 'NUTRITION', color: 'text-green-400', border: 'border-green-500/30', icon: '🥗' },
  fitness: { label: 'FITNESS', color: 'text-blue-400', border: 'border-blue-500/30', icon: '💪' },
  habits: { label: 'HABITS', color: 'text-purple-400', border: 'border-purple-500/30', icon: '⚡' },
  mindset: { label: 'MINDSET', color: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🧠' },
};

export default function Tasks() {
  const { tasks, toggleTask, addTask, deleteTask, editTask, resetTasks, autoReset, setAutoReset, taskHistory } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Task['category']>('habits');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);

  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const categories = ['nutrition', 'fitness', 'habits', 'mindset'] as const;

  const handleReset = () => {
    resetTasks();
    setShowConfirm(false);
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      addTask(newTaskName.trim(), newTaskCategory);
      setNewTaskName('');
      setShowAdd(false);
    }
  };

  const handleEditSave = (id: string) => {
    if (editingName.trim()) {
      editTask(id, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="pb-24 px-4 space-y-4">
      <div className="pt-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">DAILY TASKS</h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-cyan-400 text-sm font-bold"
        >
          {showHistory ? 'Today' : 'History'}
        </button>
      </div>

      {showHistory ? (
        <div className="space-y-3">
          <h2 className="text-gray-400 font-bold">Task History</h2>
          {[...taskHistory].reverse().map(record => (
            <div key={record.date}>
              <button
                onClick={() => setSelectedHistoryDate(selectedHistoryDate === record.date ? null : record.date)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="text-left">
                  <div className="text-white font-bold">{record.date}</div>
                  <div className="text-gray-400 text-sm">{record.completionPercentage}% complete</div>
                </div>
                <div className={`text-2xl font-black ${record.completionPercentage === 100 ? 'text-green-400' : record.completionPercentage >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {record.completionPercentage === 100 ? '✓' : `${record.completionPercentage}%`}
                </div>
              </button>
              {selectedHistoryDate === record.date && (
                <div className="bg-gray-900 rounded-xl mt-1 p-3 space-y-1">
                  {record.tasks.map(t => (
                    <div key={t.id} className="flex items-center gap-2">
                      <span className={t.completed ? 'text-green-400' : 'text-red-400'}>{t.completed ? '✓' : '✗'}</span>
                      <span className={`text-sm ${t.completed ? 'text-white' : 'text-gray-500'}`}>{t.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {taskHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">No history yet. Complete today's tasks!</div>
          )}
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-white font-black text-2xl">{completed}/{total}</div>
                <div className="text-gray-500 text-sm">tasks completed today</div>
              </div>
              <div className={`text-4xl font-black ${pct === 100 ? 'text-green-400' : pct >= 70 ? 'text-yellow-400' : 'text-white'}`}>
                {pct}%
              </div>
            </div>
            <div className="bg-gray-800 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : 'bg-cyan-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {pct === 100 && (
              <div className="text-center mt-2 text-green-400 font-bold animate-pulse">🔥 PERFECT DAY! 🔥</div>
            )}
          </div>

          {/* Auto-reset toggle */}
          <div className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-xl p-3">
            <span className="text-gray-300 text-sm">Auto-reset at midnight</span>
            <button
              onClick={() => setAutoReset(!autoReset)}
              className={`w-12 h-6 rounded-full transition-all relative ${autoReset ? 'bg-cyan-500' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoReset ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Tasks by category */}
          {categories.map(cat => {
            const catTasks = tasks.filter(t => t.category === cat).sort((a, b) => a.order - b.order);
            if (catTasks.length === 0) return null;
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <div key={cat} className={`bg-gray-950 border ${cfg.border} rounded-2xl overflow-hidden`}>
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className={`text-xs font-black ${cfg.color}`}>{cfg.icon} {cfg.label}</div>
                </div>
                <div className="divide-y divide-gray-800">
                  {catTasks.map(task => (
                    <div key={task.id} className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                            task.completed
                              ? 'bg-cyan-500 border-cyan-500 scale-110'
                              : 'border-gray-600 hover:border-cyan-500'
                          }`}
                        >
                          {task.completed && (
                            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        {editingId === task.id ? (
                          <input
                            autoFocus
                            className="flex-1 bg-gray-800 rounded-lg px-2 py-1 text-white outline-none border border-cyan-500"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            onBlur={() => handleEditSave(task.id)}
                            onKeyDown={e => e.key === 'Enter' && handleEditSave(task.id)}
                          />
                        ) : (
                          <span
                            className={`flex-1 font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}
                            onDoubleClick={() => { setEditingId(task.id); setEditingName(task.name); }}
                          >
                            {task.name}
                          </span>
                        )}

                        {task.streak > 0 && (
                          <span className="text-orange-400 text-xs font-bold shrink-0">🔥{task.streak}</span>
                        )}

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => { setEditingId(task.id); setEditingName(task.name); }}
                            className="text-gray-600 hover:text-gray-300 text-xs px-1"
                          >✏️</button>
                          {task.custom && (
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-gray-600 hover:text-red-400 text-xs px-1"
                            >🗑️</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Add task */}
          {showAdd ? (
            <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
              <input
                autoFocus
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                placeholder="Task name..."
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
              />
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewTaskCategory(cat)}
                    className={`py-2 rounded-lg text-sm font-bold capitalize transition-all ${newTaskCategory === cat ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-300'}`}
                  >
                    {CATEGORY_CONFIG[cat].icon} {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 bg-gray-800 rounded-xl text-gray-300 font-bold">Cancel</button>
                <button onClick={handleAddTask} className="flex-1 py-2 bg-cyan-500 rounded-xl text-black font-bold">Add Task</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full py-3 bg-gray-900 border border-dashed border-gray-700 rounded-2xl text-gray-400 font-bold hover:border-cyan-500 hover:text-cyan-400 transition-all"
            >
              + Add Custom Task
            </button>
          )}

          {/* BIG RED RESET */}
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black text-lg active:scale-95 transition-all shadow-lg shadow-red-900/50 mt-4"
          >
            🔴 RESET TODAY'S TASKS
          </button>
        </>
      )}

      {/* Confirm Reset Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
          <div className="bg-gray-900 border border-red-500 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-black text-xl mb-2">Reset Today's Tasks?</h3>
            <p className="text-gray-400 mb-6">This will uncheck all tasks for today. Today's completion record will be saved first.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-gray-800 rounded-xl text-white font-bold">Cancel</button>
              <button onClick={handleReset} className="flex-1 py-3 bg-red-600 rounded-xl text-white font-black">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
