import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { FoodLogEntry } from '../types';

const MEAL_TIMES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const MEAL_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

export default function Calories() {
  const { profile, dailyFoodLogs, addFoodEntry, removeFoodEntry, supplements, toggleSupplement, addSupplement, deleteSupplement, getTodaySupplements } = useStore();
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'supplements'>('today');
  const [quickName, setQuickName] = useState('');
  const [quickCals, setQuickCals] = useState('');
  const [quickProtein, setQuickProtein] = useState('');
  const [quickMealTime, setQuickMealTime] = useState<FoodLogEntry['mealTime']>('lunch');
  const [fastingStart, setFastingStart] = useState('');
  const [newSupp, setNewSupp] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyFoodLogs.find(l => l.date === today);
  const entries = todayLog?.entries || [];

  const totalCals = entries.reduce((s, e) => s + e.calories, 0);
  const totalProtein = entries.reduce((s, e) => s + e.protein, 0);
  const totalCarbs = entries.reduce((s, e) => s + e.carbs, 0);
  const totalFat = entries.reduce((s, e) => s + e.fat, 0);

  const calTarget = profile?.dailyCalorieTarget || 1400;
  const proteinTarget = profile?.dailyProteinTarget || 150;
  const caloriesLeft = calTarget - totalCals;
  const proteinLeft = proteinTarget - totalProtein;

  const pieData = [
    { name: 'Protein', value: totalProtein * 4, color: '#3b82f6' },
    { name: 'Carbs', value: totalCarbs * 4, color: '#eab308' },
    { name: 'Fat', value: totalFat * 9, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const handleQuickAdd = () => {
    if (!quickName || !quickCals) return;
    addFoodEntry({
      name: quickName,
      calories: parseInt(quickCals),
      protein: parseInt(quickProtein) || 0,
      carbs: 0,
      fat: 0,
      mealTime: quickMealTime,
    });
    setQuickName('');
    setQuickCals('');
    setQuickProtein('');
  };

  const fastingHours = useMemo(() => {
    if (!fastingStart) return null;
    const start = new Date(fastingStart);
    const now = new Date();
    const hours = (now.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(0, hours);
  }, [fastingStart]);

  const todaySupplementIds = getTodaySupplements();
  const weeklyCalorieData = useMemo(() => {
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const log = dailyFoodLogs.find(l => l.date === ds);
      const cals = log?.entries.reduce((s, e) => s + e.calories, 0) || 0;
      last7.push({ date: ds.slice(5), cals });
    }
    return last7;
  }, [dailyFoodLogs]);

  const weeklyAvg = weeklyCalorieData.reduce((s, d) => s + d.cals, 0) / 7;

  const damageReport = caloriesLeft < 0 ? {
    over: Math.abs(caloriesLeft),
    extraDays: (Math.abs(caloriesLeft) / 3500 * 7).toFixed(2),
  } : null;

  return (
    <div className="pb-24 px-4 space-y-4">
      <div className="pt-6">
        <h1 className="text-2xl font-black text-white">CALORIES</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {(['today', 'history', 'supplements'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-none px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}
          >
            {tab === 'today' ? '📋 Today' : tab === 'history' ? '📅 History' : '💊 Supplements'}
          </button>
        ))}
      </div>

      {/* TODAY TAB */}
      {activeTab === 'today' && (
        <div className="space-y-4">
          {/* Big calorie display */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-gray-400 text-xs">CONSUMED</div>
                <div className="text-white font-black text-4xl">{totalCals}</div>
                <div className="text-gray-500 text-sm">of {calTarget} cal goal</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs">REMAINING</div>
                <div className={`font-black text-3xl ${caloriesLeft >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {caloriesLeft >= 0 ? '+' : ''}{caloriesLeft}
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${totalCals > calTarget ? 'bg-red-500' : 'bg-cyan-500'}`}
                style={{ width: `${Math.min(100, (totalCals / calTarget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Damage Report */}
          {damageReport && (
            <div className="bg-red-950 border border-red-500 rounded-2xl p-4">
              <div className="text-red-400 font-black text-sm mb-1">⚠️ DAMAGE REPORT</div>
              <div className="text-white font-bold">{damageReport.over} calories OVER your goal</div>
              <div className="text-red-300 text-sm">This extends your deadline by ~{damageReport.extraDays} days. Get back on track tomorrow.</div>
            </div>
          )}

          {/* Macros */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'PROTEIN', val: totalProtein, target: proteinTarget, color: 'text-blue-400', unit: 'g' },
              { label: 'CARBS', val: totalCarbs, color: 'text-yellow-400', unit: 'g' },
              { label: 'FAT', val: totalFat, color: 'text-red-400', unit: 'g' },
            ].map(m => (
              <div key={m.label} className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">{m.label}</div>
                <div className={`font-black text-xl ${m.color}`}>{m.val}g</div>
                {m.target && <div className="text-gray-600 text-xs">/{m.target}g</div>}
              </div>
            ))}
          </div>

          {/* Protein progress */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Protein: {totalProtein}g / {proteinTarget}g</span>
              <span className={proteinLeft <= 0 ? 'text-green-400 font-bold' : 'text-gray-500'}>{proteinLeft > 0 ? `${proteinLeft}g left` : '✓ Goal hit!'}</span>
            </div>
            <div className="bg-gray-800 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (totalProtein / proteinTarget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Pie chart */}
          {pieData.length > 0 && (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
              <div className="text-gray-400 text-xs mb-3">MACRO BREAKDOWN</div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }} formatter={(val) => [`${Math.round(Number(val) / 4)}g (${val} cal)`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Protein', color: '#3b82f6', val: totalProtein },
                    { name: 'Carbs', color: '#eab308', val: totalCarbs },
                    { name: 'Fat', color: '#ef4444', val: totalFat },
                  ].map(m => (
                    <div key={m.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: m.color }} />
                      <span className="text-gray-300 text-sm">{m.name}: {m.val}g</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Add */}
          <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
            <h3 className="text-white font-bold">Quick Add Food</h3>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
              placeholder="Food name..."
              value={quickName}
              onChange={e => setQuickName(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-gray-500 text-xs">Calories</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-white text-sm outline-none focus:border-cyan-500"
                  placeholder="0"
                  value={quickCals}
                  onChange={e => setQuickCals(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs">Protein (g)</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-white text-sm outline-none focus:border-cyan-500"
                  placeholder="0"
                  value={quickProtein}
                  onChange={e => setQuickProtein(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs">Meal</label>
                <select
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-white text-sm outline-none"
                  value={quickMealTime}
                  onChange={e => setQuickMealTime(e.target.value as FoodLogEntry['mealTime'])}
                >
                  {MEAL_TIMES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleQuickAdd}
              disabled={!quickName || !quickCals}
              className="w-full py-3 bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl text-black font-black"
            >
              + ADD TO LOG
            </button>
          </div>

          {/* Food entries by meal time */}
          {MEAL_TIMES.map(mealTime => {
            const mealEntries = entries.filter(e => e.mealTime === mealTime);
            if (mealEntries.length === 0) return null;
            const mealCals = mealEntries.reduce((s, e) => s + e.calories, 0);
            return (
              <div key={mealTime} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                  <span className="text-gray-300 font-bold capitalize">{MEAL_ICONS[mealTime]} {mealTime}</span>
                  <span className="text-cyan-400 font-bold">{mealCals} cal</span>
                </div>
                {mealEntries.map(entry => (
                  <div key={entry.id} className="px-4 py-3 flex items-center justify-between border-b border-gray-800/50">
                    <div>
                      <div className="text-white text-sm font-medium">{entry.name}</div>
                      <div className="text-gray-500 text-xs">{entry.protein}g protein</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300 font-bold">{entry.calories}</span>
                      <button onClick={() => removeFoodEntry(today, entry.id)} className="text-red-500 text-lg">×</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Fasting Timer */}
          <div className="bg-gray-950 border border-purple-500/30 rounded-2xl p-4">
            <div className="text-purple-400 text-xs font-bold mb-3">⏰ FASTING TRACKER (Optional)</div>
            {!fastingStart ? (
              <button
                onClick={() => setFastingStart(new Date().toISOString())}
                className="w-full py-3 bg-purple-600 rounded-xl text-white font-bold"
              >
                Start Fast Now
              </button>
            ) : (
              <div className="text-center">
                <div className="text-white font-black text-3xl">{fastingHours?.toFixed(1)}h</div>
                <div className="text-gray-400 text-sm">hours fasted</div>
                <div className={`text-sm font-bold mt-1 ${fastingHours && fastingHours >= 16 ? 'text-green-400' : 'text-gray-400'}`}>
                  {fastingHours && fastingHours >= 16 ? '✓ 16h+ REACHED!' : `${(16 - (fastingHours || 0)).toFixed(1)}h until 16h`}
                </div>
                <button onClick={() => setFastingStart('')} className="mt-3 px-4 py-2 bg-gray-800 rounded-xl text-gray-300 text-sm">
                  End Fast
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
            <div className="text-gray-400 text-xs mb-1">7-DAY AVERAGE</div>
            <div className="text-white font-black text-3xl">{Math.round(weeklyAvg)} <span className="text-gray-500 text-lg font-normal">cal/day</span></div>
            <div className={`text-sm mt-1 ${weeklyAvg <= calTarget ? 'text-green-400' : 'text-red-400'}`}>
              {weeklyAvg <= calTarget ? `${Math.round(calTarget - weeklyAvg)} below target` : `${Math.round(weeklyAvg - calTarget)} over target`}
            </div>
          </div>

          {[...dailyFoodLogs].reverse().map(log => {
            const dayCals = log.entries.reduce((s, e) => s + e.calories, 0);
            const dayProtein = log.entries.reduce((s, e) => s + e.protein, 0);
            return (
              <div key={log.date} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">{log.date}</div>
                    <div className="text-gray-400 text-sm">{log.entries.length} foods • {dayProtein}g protein</div>
                  </div>
                  <div className={`font-black text-xl ${dayCals <= calTarget ? 'text-green-400' : 'text-red-400'}`}>{dayCals}</div>
                </div>
                <div className="bg-gray-800 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${dayCals <= calTarget ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (dayCals / calTarget) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUPPLEMENTS TAB */}
      {activeTab === 'supplements' && (
        <div className="space-y-3">
          <div className="text-gray-400 text-sm">{todaySupplementIds.length}/{supplements.length} taken today</div>
          {supplements.map(supp => {
            const checked = todaySupplementIds.includes(supp.id);
            return (
              <div key={supp.id} className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSupplement(supp.id)}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'}`}
                  >
                    {checked && <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  <span className={`font-medium ${checked ? 'text-gray-400 line-through' : 'text-white'}`}>{supp.name}</span>
                </div>
                {supp.custom && (
                  <button onClick={() => deleteSupplement(supp.id)} className="text-red-500">×</button>
                )}
              </div>
            );
          })}

          <div className="flex gap-2">
            <input
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="Add supplement..."
              value={newSupp}
              onChange={e => setNewSupp(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newSupp.trim()) { addSupplement(newSupp.trim()); setNewSupp(''); } }}
            />
            <button
              onClick={() => { if (newSupp.trim()) { addSupplement(newSupp.trim()); setNewSupp(''); } }}
              className="px-4 py-3 bg-cyan-500 rounded-xl text-black font-bold"
            >+</button>
          </div>
        </div>
      )}
    </div>
  );
}
