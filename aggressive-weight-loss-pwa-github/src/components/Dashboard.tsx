import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getDailyQuote } from '../data/quotes';
import {
  calculateDaysRemaining, formatCountdown, getPaceStatus,
  calculateWeeklyLossRate, calculateProjectedDate, getDailyGrade, getWeeklyAverage, calculateBMI
} from '../utils/calculations';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

export default function Dashboard() {
  const {
    profile, weightEntries, taskHistory, workoutLogs, dailyFoodLogs,
    xp, level, badges, currentStreak, tasks,
    addWater, getTodayWater, addWeightEntry
  } = useStore();

  const [countdown, setCountdown] = useState('');
  const [quickWeight, setQuickWeight] = useState('');
  const [weightLogged, setWeightLogged] = useState(false);
  const todayWater = getTodayWater();
  const waterGoal = 128;

  useEffect(() => {
    if (!profile) return;
    const update = () => setCountdown(formatCountdown(profile.deadline));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [profile]);

  if (!profile) return null;

  const quote = getDailyQuote();
  const daysLeft = calculateDaysRemaining(profile.deadline);
  const lostSoFar = profile.startingWeight - profile.currentWeight;
  const lbsRemaining = profile.currentWeight - profile.goalWeight;
  const progressPct = Math.min(100, Math.max(0, (lostSoFar / (profile.startingWeight - profile.goalWeight)) * 100));
  const weeklyRate = calculateWeeklyLossRate(weightEntries);
  const paceStatus = getPaceStatus(profile.currentWeight, profile.goalWeight, profile.startingWeight, profile.startDate, profile.deadline);
  const projectedDate = weeklyRate > 0 ? calculateProjectedDate(profile.currentWeight, profile.goalWeight, weeklyRate) : null;
  const weeklyAvg = getWeeklyAverage(weightEntries);
  const bmi = calculateBMI(profile.currentWeight, profile.height);

  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyFoodLogs.find(l => l.date === today);
  const todayCalories = todayLog?.entries.reduce((sum, e) => sum + e.calories, 0) || 0;
  const caloriesRemaining = profile.dailyCalorieTarget - todayCalories;
  const todayProtein = todayLog?.entries.reduce((sum, e) => sum + e.protein, 0) || 0;

  const todayTasks = taskHistory.find(h => h.date === today);
  const completedTaskCount = tasks.filter(t => t.completed).length;
  const taskPct = tasks.length > 0 ? Math.round((completedTaskCount / tasks.length) * 100) : (todayTasks?.completionPercentage || 0);
  const workedOut = workoutLogs.some(l => l.date === today && l.completed);
  const grade = getDailyGrade(taskPct, caloriesRemaining, workedOut, profile.dailyCalorieTarget);

  const chartData = weightEntries.slice(-14).map(e => ({ date: e.date.slice(5), weight: e.weight }));
  const unlockedBadges = badges.filter(b => b.unlocked);

  const paceConfig = {
    ahead: { color: 'text-green-400', bg: 'border-green-500/30 bg-green-500/10', icon: '🚀', label: 'AHEAD' },
    'on-track': { color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10', icon: '🎯', label: 'ON TRACK' },
    behind: { color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10', icon: '⚠️', label: 'BEHIND' },
  };
  const pace = paceConfig[paceStatus];

  const gradeColor = grade.startsWith('A') ? 'text-green-400' : grade.startsWith('B') ? 'text-yellow-400' : grade.startsWith('C') ? 'text-orange-400' : 'text-red-500';

  const handleQuickLogWeight = () => {
    if (!quickWeight) return;
    addWeightEntry(parseFloat(quickWeight));
    setWeightLogged(true);
    setQuickWeight('');
    setTimeout(() => setWeightLogged(false), 2000);
  };

  const waterPct = Math.min(100, (todayWater / waterGoal) * 100);

  return (
    <div className="pb-28 px-4 space-y-4">
      {/* Header */}
      <div className="pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">WARPATH</h1>
            <p className="text-gray-500 text-sm">GM, {profile.name} 🔥</p>
          </div>
          <div className="text-right">
            <div className="text-cyan-400 font-black text-lg">Lvl {level}</div>
            <div className="text-gray-500 text-xs">{xp.toLocaleString()} XP</div>
          </div>
        </div>
        <div className="mt-2 bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(xp % 500) / 500 * 100}%` }}
          />
        </div>
      </div>

      {/* Quick Weight Log */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
        <div className="text-gray-400 text-xs font-bold mb-2">⚖️ MORNING WEIGH-IN</div>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-xl font-bold outline-none focus:border-cyan-500"
            placeholder={`${profile.currentWeight}`}
            value={quickWeight}
            onChange={e => setQuickWeight(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuickLogWeight()}
          />
          <button
            onClick={handleQuickLogWeight}
            className={`px-5 py-3 rounded-xl font-black text-lg transition-all ${weightLogged ? 'bg-green-500 text-white' : 'bg-cyan-500 text-black'}`}
          >
            {weightLogged ? '✓' : 'LOG'}
          </button>
        </div>
        {weightEntries.length > 0 && (
          <div className="text-gray-500 text-xs mt-2">
            Last: {weightEntries[weightEntries.length - 1]?.weight} lbs on {weightEntries[weightEntries.length - 1]?.date}
          </div>
        )}
      </div>

      {/* Progress Ring + Key Stats */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#ringGrad)" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{progressPct.toFixed(0)}%</span>
              <span className="text-gray-500 text-xs">done</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <div className="text-gray-400 text-xs">CURRENT WEIGHT</div>
              <div className="text-white font-black text-2xl">{profile.currentWeight} <span className="text-gray-500 text-sm font-normal">lbs</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-600 text-xs">LOST</div>
                <div className="text-green-400 font-bold">{Math.max(0, lostSoFar).toFixed(1)} lbs</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">TO GO</div>
                <div className="text-red-400 font-bold">{Math.max(0, lbsRemaining).toFixed(1)} lbs</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">GOAL</div>
                <div className="text-white font-bold">{profile.goalWeight} lbs</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">BMI</div>
                <div className="text-white font-bold">{bmi}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown + Pace */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
          <div className="text-gray-500 text-xs mb-1">⏰ DEADLINE</div>
          <div className="text-cyan-400 font-black text-2xl">{daysLeft}<span className="text-gray-500 text-sm font-normal"> days</span></div>
          <div className="text-gray-600 text-xs">{countdown}</div>
        </div>
        <div className={`border rounded-2xl p-4 ${pace.bg}`}>
          <div className="text-gray-500 text-xs mb-1">PACE</div>
          <div className={`font-black text-xl ${pace.color}`}>{pace.icon} {pace.label}</div>
          <div className="text-gray-600 text-xs">{weeklyRate > 0 ? `${weeklyRate.toFixed(1)} lbs/wk` : 'Need more data'}</div>
        </div>
      </div>

      {/* Daily Calorie + Protein */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-gray-500 text-xs">CALORIES TODAY</div>
            <div className="text-white font-black text-2xl">{todayCalories}<span className="text-gray-500 text-sm font-normal"> / {profile.dailyCalorieTarget}</span></div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-xs">REMAINING</div>
            <div className={`font-black text-xl ${caloriesRemaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {caloriesRemaining >= 0 ? '+' : ''}{caloriesRemaining}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${todayCalories > profile.dailyCalorieTarget ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${Math.min(100, (todayCalories / profile.dailyCalorieTarget) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-xs">PROTEIN: <span className="text-blue-400 font-bold">{todayProtein}g / {profile.dailyProteinTarget}g</span></div>
          {todayProtein >= profile.dailyProteinTarget && <span className="text-green-400 text-xs font-bold">✓ GOAL HIT</span>}
        </div>
        <div className="bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full"
            style={{ width: `${Math.min(100, (todayProtein / profile.dailyProteinTarget) * 100)}%` }}
          />
        </div>
      </div>

      {/* Water Tracker */}
      <div className="bg-gray-950 border border-blue-500/20 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-gray-500 text-xs">💧 WATER</div>
            <div className="text-white font-black text-xl">{todayWater}<span className="text-gray-500 text-sm font-normal"> / {waterGoal} oz</span></div>
          </div>
          <div className={`text-sm font-bold ${todayWater >= waterGoal ? 'text-green-400' : 'text-blue-400'}`}>
            {todayWater >= waterGoal ? '✓ DONE' : `${waterGoal - todayWater} oz left`}
          </div>
        </div>
        <div className="bg-gray-800 rounded-full h-2 mb-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${waterPct}%` }}
          />
        </div>
        <div className="flex gap-2">
          {[8, 16, 32].map(oz => (
            <button
              key={oz}
              onClick={() => addWater(oz)}
              className="flex-1 py-2 bg-blue-600/30 border border-blue-600/50 rounded-xl text-blue-300 font-bold text-sm active:scale-95 transition-transform"
            >
              +{oz}oz
            </button>
          ))}
        </div>
      </div>

      {/* Streak + Grade + Badges */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-950 border border-orange-500/30 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-white font-black text-xl">{currentStreak}</div>
          <div className="text-gray-500 text-xs">streak</div>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 text-center">
          <div className={`font-black text-3xl ${gradeColor}`}>{grade}</div>
          <div className="text-gray-500 text-xs mt-1">grade</div>
        </div>
        <div className="bg-gray-950 border border-yellow-500/20 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-white font-black text-xl">{unlockedBadges.length}</div>
          <div className="text-gray-500 text-xs">badges</div>
        </div>
      </div>

      {/* Today's Tasks Progress */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-400 text-xs font-bold">TODAY'S TASKS</div>
          <div className="text-white font-black">{completedTaskCount}/{tasks.length}</div>
        </div>
        <div className="bg-gray-800 rounded-full h-2.5 mb-3">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${taskPct === 100 ? 'bg-green-500' : 'bg-cyan-500'}`}
            style={{ width: `${taskPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {tasks.slice(0, 6).map(task => (
            <div
              key={task.id}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${task.completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}
            >
              <span>{task.completed ? '✓' : '○'}</span>
              <span>{task.name.split(' ').slice(0, 2).join(' ')}</span>
            </div>
          ))}
          {tasks.length > 6 && (
            <div className="px-2.5 py-1.5 rounded-lg text-xs text-gray-600">+{tasks.length - 6} more</div>
          )}
        </div>
      </div>

      {/* Weekly avg + projected */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
          <div className="text-gray-500 text-xs mb-1">WEEKLY AVG</div>
          <div className="text-white font-black text-xl">{weeklyAvg ? `${weeklyAvg}` : '—'} <span className="text-gray-500 text-sm font-normal">lbs</span></div>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
          <div className="text-gray-500 text-xs mb-1">PROJECTED DONE</div>
          <div className="text-white font-black text-base">
            {projectedDate ? projectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
          </div>
        </div>
      </div>

      {/* Weight Chart */}
      {chartData.length > 1 && (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
          <div className="text-gray-400 text-xs mb-3">WEIGHT TREND (last 14 days)</div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  formatter={(val) => [`${val} lbs`, 'Weight']}
                />
                <Area type="monotone" dataKey="weight" stroke="#06b6d4" fill="url(#wGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Daily Quote */}
      <div className="bg-gray-950 border border-cyan-500/20 rounded-2xl p-5">
        <div className="text-cyan-500 text-xs font-bold mb-2">💬 DAILY FUEL</div>
        <p className="text-white text-base font-semibold leading-snug italic">"{quote.text}"</p>
        <p className="text-gray-600 text-sm mt-2">— {quote.author}</p>
      </div>

      {/* Recent Badges */}
      {unlockedBadges.length > 0 && (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
          <div className="text-gray-400 text-xs mb-3">RECENT ACHIEVEMENTS</div>
          <div className="flex flex-wrap gap-2">
            {unlockedBadges.slice(-6).map(b => (
              <div key={b.id} className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                <span className="text-xl">{b.icon}</span>
                <span className="text-white text-xs font-bold">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
