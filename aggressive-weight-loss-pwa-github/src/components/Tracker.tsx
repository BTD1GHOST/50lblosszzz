import { useState } from 'react';
import { useStore } from '../store/useStore';
import { calculateBMI, calculateNavyBodyFat } from '../utils/calculations';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

type TrackerTab = 'weight' | 'measurements' | 'water' | 'habits';

export default function Tracker() {
  const {
    profile, weightEntries, addWeightEntry, deleteWeightEntry,
    measurements, addMeasurement,
    waterLogs, addWater,
    habits, habitLogs, addHabit, toggleHabitDate, deleteHabit,
    getTodayWater,
  } = useStore();

  const [activeTab, setActiveTab] = useState<TrackerTab>('weight');
  const [newWeight, setNewWeight] = useState('');
  const [weightNote, setWeightNote] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [newMeasurement, setNewMeasurement] = useState({
    neck: '', chest: '', waist: '', hips: '', leftArm: '', rightArm: '', leftThigh: '', rightThigh: '', bodyFat: ''
  });
  const [showMeasForm, setShowMeasForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayWater = getTodayWater();
  const waterGoal = 128;
  const waterPct = Math.min(100, (todayWater / waterGoal) * 100);

  const chartData = weightEntries.slice(-30).map(e => ({
    date: e.date.slice(5),
    weight: e.weight,
    goal: profile?.goalWeight,
  }));

  const bmi = profile ? calculateBMI(profile.currentWeight, profile.height) : null;
  const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;
  const firstMeasurement = measurements.length > 0 ? measurements[0] : null;

  const bodyFat = latestMeasurement && profile && latestMeasurement.neck && latestMeasurement.waist
    ? calculateNavyBodyFat(
        profile.gender,
        latestMeasurement.waist,
        latestMeasurement.neck,
        profile.height,
        latestMeasurement.hips
      )
    : null;

  const handleAddWeight = () => {
    if (!newWeight) return;
    addWeightEntry(parseFloat(newWeight), weightNote);
    setNewWeight('');
    setWeightNote('');
  };

  const handleAddMeasurement = () => {
    const m: Parameters<typeof addMeasurement>[0] = { date: today };
    Object.entries(newMeasurement).forEach(([k, v]) => {
      if (v) (m as Record<string, number | string>)[k] = parseFloat(v);
    });
    addMeasurement(m);
    setNewMeasurement({ neck: '', chest: '', waist: '', hips: '', leftArm: '', rightArm: '', leftThigh: '', rightThigh: '', bodyFat: '' });
    setShowMeasForm(false);
  };

  // 90-day grid
  const getDayGrid = (habitId: string) => {
    const log = habitLogs.find(l => l.habitId === habitId);
    const days: { date: string; completed: boolean }[] = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      days.push({ date: ds, completed: log?.dates.includes(ds) || false });
    }
    return days;
  };

  return (
    <div className="pb-24 px-4 space-y-4">
      <div className="pt-6">
        <h1 className="text-2xl font-black text-white">TRACKING</h1>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {(['weight', 'measurements', 'water', 'habits'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-none px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}
          >
            {tab === 'weight' ? '⚖️' : tab === 'measurements' ? '📏' : tab === 'water' ? '💧' : '📊'} {tab}
          </button>
        ))}
      </div>

      {/* WEIGHT TAB */}
      {activeTab === 'weight' && (
        <div className="space-y-4">
          {/* Quick log */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-white font-bold">Log Weight</h3>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.1"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-2xl font-black outline-none focus:border-cyan-500"
                placeholder="220.0"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
              />
              <span className="flex items-center text-gray-400 font-bold">lbs</span>
            </div>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"
              placeholder="Optional note..."
              value={weightNote}
              onChange={e => setWeightNote(e.target.value)}
            />
            <button
              onClick={handleAddWeight}
              disabled={!newWeight}
              className="w-full py-3 bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl text-black font-black text-lg"
            >
              LOG WEIGHT
            </button>
          </div>

          {/* Stats cards */}
          {profile && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Current', val: `${profile.currentWeight} lbs`, color: 'text-white' },
                { label: 'Goal', val: `${profile.goalWeight} lbs`, color: 'text-cyan-400' },
                { label: 'Lost', val: `${Math.max(0, profile.startingWeight - profile.currentWeight).toFixed(1)} lbs`, color: 'text-green-400' },
                { label: 'BMI', val: `${bmi}`, color: bmi && bmi < 25 ? 'text-green-400' : bmi && bmi < 30 ? 'text-yellow-400' : 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-center">
                  <div className="text-gray-500 text-xs">{s.label}</div>
                  <div className={`font-black text-2xl ${s.color}`}>{s.val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          {chartData.length > 1 && profile && (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
              <div className="text-gray-400 text-xs mb-3">WEIGHT OVER TIME</div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} width={40} />
                    <Tooltip
                      contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    />
                    <ReferenceLine y={profile.goalWeight} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Goal', fill: '#f59e0b', fontSize: 10 }} />
                    <Line type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Weight log */}
          <div className="space-y-2">
            <div className="text-gray-400 text-xs font-bold">ALL ENTRIES ({weightEntries.length})</div>
            {[...weightEntries].reverse().map(entry => (
              <div key={entry.id} className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{entry.weight} lbs</div>
                  <div className="text-gray-500 text-sm">{entry.date}{entry.note && ` — ${entry.note}`}</div>
                </div>
                <button onClick={() => deleteWeightEntry(entry.id)} className="text-red-500 text-xl px-2">×</button>
              </div>
            ))}
            {weightEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">Log your first weight above!</div>
            )}
          </div>
        </div>
      )}

      {/* MEASUREMENTS TAB */}
      {activeTab === 'measurements' && (
        <div className="space-y-4">
          {bodyFat && (
            <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl p-4 text-center">
              <div className="text-gray-400 text-xs">EST. BODY FAT (Navy Method)</div>
              <div className="text-white font-black text-4xl mt-1">{bodyFat}%</div>
            </div>
          )}

          {!showMeasForm ? (
            <button
              onClick={() => setShowMeasForm(true)}
              className="w-full py-3 bg-cyan-500 rounded-xl text-black font-black"
            >
              + ADD MEASUREMENTS
            </button>
          ) : (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-3">
              <div className="text-white font-bold">New Measurements (inches)</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'neck', label: 'Neck' },
                  { key: 'chest', label: 'Chest' },
                  { key: 'waist', label: 'Waist' },
                  { key: 'hips', label: 'Hips' },
                  { key: 'leftArm', label: 'L. Arm' },
                  { key: 'rightArm', label: 'R. Arm' },
                  { key: 'leftThigh', label: 'L. Thigh' },
                  { key: 'rightThigh', label: 'R. Thigh' },
                  { key: 'bodyFat', label: 'Body Fat %' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-gray-500 text-xs">{f.label}</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-white text-sm outline-none focus:border-cyan-500"
                      placeholder="0.0"
                      value={newMeasurement[f.key as keyof typeof newMeasurement]}
                      onChange={e => setNewMeasurement(m => ({ ...m, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowMeasForm(false)} className="flex-1 py-2.5 bg-gray-800 rounded-xl text-gray-300 font-bold">Cancel</button>
                <button onClick={handleAddMeasurement} className="flex-1 py-2.5 bg-cyan-500 rounded-xl text-black font-bold">Save</button>
              </div>
            </div>
          )}

          {/* Measurement comparison */}
          {latestMeasurement && firstMeasurement && firstMeasurement.id !== latestMeasurement.id && (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
              <div className="text-gray-400 text-xs font-bold mb-3">CHANGES (Start → Latest)</div>
              {[
                { key: 'waist', label: 'Waist' },
                { key: 'chest', label: 'Chest' },
                { key: 'hips', label: 'Hips' },
              ].map(f => {
                const first = (firstMeasurement as unknown as Record<string, number>)[f.key];
                const latest = (latestMeasurement as unknown as Record<string, number>)[f.key];
                if (!first || !latest) return null;
                const change = latest - first;
                return (
                  <div key={f.key} className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-300">{f.label}</span>
                    <span className={change < 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}"
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {measurements.slice().reverse().map(m => (
            <div key={m.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-xs mb-2">{m.date}</div>
              <div className="grid grid-cols-3 gap-2">
                {m.waist && <div><div className="text-gray-500 text-xs">Waist</div><div className="text-white font-bold">{m.waist}"</div></div>}
                {m.chest && <div><div className="text-gray-500 text-xs">Chest</div><div className="text-white font-bold">{m.chest}"</div></div>}
                {m.hips && <div><div className="text-gray-500 text-xs">Hips</div><div className="text-white font-bold">{m.hips}"</div></div>}
                {m.neck && <div><div className="text-gray-500 text-xs">Neck</div><div className="text-white font-bold">{m.neck}"</div></div>}
                {m.leftArm && <div><div className="text-gray-500 text-xs">L.Arm</div><div className="text-white font-bold">{m.leftArm}"</div></div>}
                {m.bodyFat && <div><div className="text-gray-500 text-xs">BF%</div><div className="text-white font-bold">{m.bodyFat}%</div></div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WATER TAB */}
      {activeTab === 'water' && (
        <div className="space-y-4">
          <div className="bg-gray-950 border border-blue-500/30 rounded-2xl p-6 text-center">
            <div className="text-gray-400 text-sm mb-2">TODAY'S WATER</div>
            <div className="text-5xl font-black text-white mb-1">{todayWater}<span className="text-gray-500 text-2xl"> oz</span></div>
            <div className="text-gray-500 text-sm mb-4">Goal: {waterGoal} oz (1 gallon)</div>
            {/* Water bottle visual */}
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-40 border-2 border-blue-500 rounded-b-2xl overflow-hidden bg-gray-900">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-500/60 transition-all duration-700"
                  style={{ height: `${waterPct}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-lg">{waterPct.toFixed(0)}%</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${waterPct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[8, 16, 32].map(oz => (
              <button
                key={oz}
                onClick={() => addWater(oz)}
                className="py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black text-lg active:scale-95 transition-all"
              >
                +{oz}oz
              </button>
            ))}
          </div>

          {todayWater >= waterGoal && (
            <div className="text-center text-blue-400 font-black text-xl animate-pulse">💧 GALLON DONE! 💧</div>
          )}

          <div className="space-y-2">
            <div className="text-gray-400 text-xs font-bold">WATER LOG (last 7 days)</div>
            {waterLogs.slice(-7).reverse().map(log => (
              <div key={log.date} className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-gray-300">{log.date}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${log.oz >= waterGoal ? 'text-green-400' : 'text-gray-400'}`}>{log.oz} oz</span>
                  {log.oz >= waterGoal && <span className="text-green-400">✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HABITS TAB */}
      {activeTab === 'habits' && (
        <div className="space-y-4">
          {!showAddHabit ? (
            <button onClick={() => setShowAddHabit(true)} className="w-full py-3 bg-cyan-500 rounded-xl text-black font-black">
              + ADD HABIT TRACKER
            </button>
          ) : (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-3">
              <input
                autoFocus
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                placeholder="Habit name..."
                value={habitName}
                onChange={e => setHabitName(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => setShowAddHabit(false)} className="flex-1 py-2 bg-gray-800 rounded-xl text-gray-300">Cancel</button>
                <button
                  onClick={() => {
                    if (habitName.trim()) {
                      addHabit({ name: habitName.trim(), color: '#06b6d4', startDate: today, active: true });
                      setHabitName('');
                      setShowAddHabit(false);
                    }
                  }}
                  className="flex-1 py-2 bg-cyan-500 rounded-xl text-black font-bold"
                >Add</button>
              </div>
            </div>
          )}

          {habits.map(habit => {
            const days = getDayGrid(habit.id);
            const doneCount = days.filter(d => d.completed).length;
            return (
              <div key={habit.id} className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-white font-bold">{habit.name}</div>
                    <div className="text-gray-400 text-sm">{doneCount}/90 days</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleHabitDate(habit.id, today)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                        days[days.length - 1]?.completed ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {days[days.length - 1]?.completed ? '✓ Done' : 'Mark Today'}
                    </button>
                    <button onClick={() => deleteHabit(habit.id)} className="text-red-500 px-1">🗑️</button>
                  </div>
                </div>
                {/* 90-day grid */}
                <div className="flex flex-wrap gap-0.5">
                  {days.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => toggleHabitDate(habit.id, day.date)}
                      title={day.date}
                      className={`w-3 h-3 rounded-sm transition-all ${day.completed ? 'bg-green-500' : 'bg-gray-800'}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {habits.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">📊</div>
              <div>No habits tracked yet.</div>
              <div className="text-sm">Add one above to start your 90-day grid!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
