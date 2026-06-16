import { useState } from 'react';
import { useStore } from '../store/useStore';
import { PLATEAU_BUSTERS, CHALLENGES } from '../data/badges';
import { calculateDailyCalories, calculateDailyProtein } from '../utils/calculations';
import type { UserProfile } from '../types';

type MoreTab = 'warroom' | 'gamification' | 'settings' | 'weekly' | 'whatif';

export default function More() {
  const {
    profile, setProfile, badges, warRoom, setWarRoom, infractions, addInfraction,
    xp, level, currentStreak, taskHistory, workoutLogs, journalEntries,
    weeklyReviews, addWeeklyReview, visionBoardImages, addVisionImage, removeVisionImage,
    dailyFoodLogs, weightEntries,
  } = useStore();

  const [activeTab, setActiveTab] = useState<MoreTab>('warroom');
  const [warWhy, setWarWhy] = useState(warRoom.why);
  const [warRules, setWarRules] = useState(warRoom.rules.join('\n'));
  const [warNonNegs, setWarNonNegs] = useState(warRoom.nonNegotiables.join('\n'));
  const [warSaved, setWarSaved] = useState(false);
  const [whatIfCals, setWhatIfCals] = useState('');
  const [whatIfBurn, setWhatIfBurn] = useState('');
  const [showDataWipe, setShowDataWipe] = useState(false);
  const [weeklyNotes, setWeeklyNotes] = useState('');
  const [showInfractionForm, setShowInfractionForm] = useState(false);
  const [infractionDesc, setInfractionDesc] = useState('');
  const [showBadgeDetail, setShowBadgeDetail] = useState<string | null>(null);

  // Profile editing
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>(profile || {});

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const weekStart = monday.toISOString().split('T')[0];

  const thisWeekReview = weeklyReviews.find(r => r.weekStart === weekStart);

  // Weekly stats
  const weekLogs = dailyFoodLogs.filter(l => l.date >= weekStart);
  const weekWorkouts = workoutLogs.filter(l => l.date >= weekStart && l.completed);
  const weekJournals = journalEntries.filter(e => e.date >= weekStart);
  const weekTasks = taskHistory.filter(h => h.date >= weekStart);
  const weekTaskAvg = weekTasks.length > 0
    ? Math.round(weekTasks.reduce((s, h) => s + h.completionPercentage, 0) / weekTasks.length)
    : 0;
  const weekCalAvg = weekLogs.length > 0
    ? Math.round(weekLogs.reduce((s, l) => s + l.entries.reduce((ss, e) => ss + e.calories, 0), 0) / weekLogs.length)
    : 0;
  const weekWeightStart = weightEntries.find(e => e.date >= weekStart);
  const weekWeightEnd = weightEntries.filter(e => e.date >= weekStart).pop();
  const weekWeightChange = weekWeightStart && weekWeightEnd ? weekWeightEnd.weight - weekWeightStart.weight : null;

  // What-if calculation
  const whatIfResult = whatIfCals && profile ? (() => {
    const cals = parseInt(whatIfCals);
    const burn = parseInt(whatIfBurn) || 0;
    const netDeficit = (profile.dailyCalorieTarget + 1000) - cals + burn;
    const weeklyLoss = netDeficit / 3500 * 7;
    const lbsLeft = profile.currentWeight - profile.goalWeight;
    const weeksNeeded = lbsLeft / Math.max(weeklyLoss, 0.1);
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + weeksNeeded * 7);
    return { weeklyLoss: weeklyLoss.toFixed(2), finishDate: finishDate.toLocaleDateString() };
  })() : null;

  const handleSaveWarRoom = () => {
    setWarRoom({
      why: warWhy,
      rules: warRules.split('\n').filter(Boolean),
      nonNegotiables: warNonNegs.split('\n').filter(Boolean),
    });
    setWarSaved(true);
    setTimeout(() => setWarSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      addVisionImage(ev.target?.result as string, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (!profile) return;
    const updated = { ...profile, ...editProfile } as UserProfile;
    updated.dailyCalorieTarget = calculateDailyCalories(updated);
    updated.dailyProteinTarget = calculateDailyProtein(updated);
    setProfile(updated);
  };

  const handleExport = () => {
    const data = {
      profile,
      weightEntries,
      dailyFoodLogs,
      journalEntries,
      workoutLogs,
      taskHistory,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warpath-backup-${today.toISOString().split('T')[0]}.json`;
    a.click();
  };

  const PENALTY_MAP = [
    'You owe 50 burpees tomorrow morning.',
    'Add 20 min fasted cardio tomorrow.',
    'No rest day next scheduled rest day.',
    'Do 100 push-ups before bed.',
    'Wake up 1 hour earlier tomorrow for fasted cardio.',
    'Add a second workout session tomorrow.',
  ];

  const getGradeColor = (pct: number) => {
    if (pct >= 90) return 'text-green-400';
    if (pct >= 70) return 'text-yellow-400';
    if (pct >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="pb-24 px-4 space-y-4">
      <div className="pt-6">
        <h1 className="text-2xl font-black text-white">MORE</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {([
          { val: 'warroom', label: '⚔️ War Room' },
          { val: 'gamification', label: '🏆 Achievements' },
          { val: 'weekly', label: '📊 Weekly' },
          { val: 'whatif', label: '🧮 What-If' },
          { val: 'settings', label: '⚙️ Settings' },
        ] as const).map(tab => (
          <button
            key={tab.val}
            onClick={() => setActiveTab(tab.val)}
            className={`flex-none px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.val ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* WAR ROOM */}
      {activeTab === 'warroom' && (
        <div className="space-y-4">
          <div className="bg-red-950 border border-red-500 rounded-2xl p-4">
            <div className="text-red-400 font-black text-xs mb-1">⚔️ WAR ROOM — THIS IS YOUR MISSION</div>
            <div className="text-white text-sm">Write your WHY. When it's dark and you want to quit, come back here.</div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold mb-1 block">MY WHY (The real reason — go deep)</label>
            <textarea
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-red-500 min-h-32 resize-none"
              placeholder="I am doing this because..."
              value={warWhy}
              onChange={e => setWarWhy(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold mb-1 block">NON-NEGOTIABLES (One per line)</label>
            <textarea
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-red-500 min-h-24 resize-none"
              placeholder="I will NEVER skip a workout&#10;I will NEVER go over my calorie target&#10;I will weigh in EVERY morning"
              value={warNonNegs}
              onChange={e => setWarNonNegs(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold mb-1 block">MY RULES (One per line)</label>
            <textarea
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-red-500 min-h-24 resize-none"
              placeholder="No excuses. EVER.&#10;The alarm goes off — I GET UP&#10;Pain is temporary. Fat is not."
              value={warRules}
              onChange={e => setWarRules(e.target.value)}
            />
          </div>

          <button
            onClick={handleSaveWarRoom}
            className="w-full py-4 bg-red-600 rounded-2xl text-white font-black text-lg active:scale-95 transition-transform"
          >
            {warSaved ? '✓ WAR PLAN SAVED' : '🔒 SAVE WAR PLAN'}
          </button>

          {/* Vision Board */}
          <div className="border-t border-gray-800 pt-4">
            <div className="text-gray-400 text-xs font-bold mb-3">📌 VISION BOARD</div>
            <label className="block w-full py-3 bg-gray-900 border border-dashed border-gray-700 rounded-xl text-gray-400 text-center cursor-pointer hover:border-cyan-500 hover:text-cyan-400 transition-all">
              + Add Image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {visionBoardImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {visionBoardImages.map(img => (
                  <div key={img.id} className="relative rounded-xl overflow-hidden aspect-square">
                    <img src={img.dataUrl} alt={img.label} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeVisionImage(img.id)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Penalty System */}
          <div className="border-t border-gray-800 pt-4">
            <div className="text-gray-400 text-xs font-bold mb-3">⚠️ PUNISHMENT SYSTEM</div>
            {!showInfractionForm ? (
              <button
                onClick={() => setShowInfractionForm(true)}
                className="w-full py-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 font-bold"
              >
                + Log an Infraction
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  className="w-full bg-gray-900 border border-red-700 rounded-xl px-3 py-2 text-white outline-none"
                  placeholder="What did you fail to do?"
                  value={infractionDesc}
                  onChange={e => setInfractionDesc(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowInfractionForm(false)} className="flex-1 py-2 bg-gray-800 rounded-xl text-gray-300">Cancel</button>
                  <button
                    onClick={() => {
                      if (infractionDesc.trim()) {
                        const penalty = PENALTY_MAP[Math.floor(Math.random() * PENALTY_MAP.length)];
                        addInfraction(infractionDesc, penalty);
                        setInfractionDesc('');
                        setShowInfractionForm(false);
                      }
                    }}
                    className="flex-1 py-2 bg-red-600 rounded-xl text-white font-bold"
                  >
                    Assign Penalty
                  </button>
                </div>
              </div>
            )}
            {infractions.slice(-3).reverse().map(inf => (
              <div key={inf.id} className="bg-red-950 border border-red-800 rounded-xl p-3 mt-2">
                <div className="text-red-300 text-sm font-bold">{inf.date}: {inf.description}</div>
                <div className="text-orange-400 text-xs mt-1">🏋️ PENALTY: {inf.penalty}</div>
              </div>
            ))}
          </div>

          {/* Plateau Busters */}
          <div className="border-t border-gray-800 pt-4">
            <div className="text-gray-400 text-xs font-bold mb-3">🚀 PLATEAU BUSTERS</div>
            {PLATEAU_BUSTERS.map((pb, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-3 mb-2">
                <div className="text-white font-bold text-sm">{pb.title}</div>
                <div className="text-gray-400 text-xs mt-1">{pb.description}</div>
              </div>
            ))}
          </div>

          {/* 30-Day Challenges */}
          <div className="border-t border-gray-800 pt-4">
            <div className="text-gray-400 text-xs font-bold mb-3">🔥 30-DAY CHALLENGES</div>
            {CHALLENGES.map(c => (
              <div key={c.id} className="bg-gray-950 border border-gray-800 rounded-xl p-3 mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-bold text-sm">{c.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{c.description}</div>
                  </div>
                  <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full ml-2 shrink-0">{c.duration}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAMIFICATION */}
      {activeTab === 'gamification' && (
        <div className="space-y-4">
          {/* XP/Level */}
          <div className="bg-gray-950 border border-yellow-500/30 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-yellow-400 font-black text-xs">LEVEL</div>
                <div className="text-white font-black text-5xl">{level}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs">TOTAL XP</div>
                <div className="text-yellow-400 font-black text-3xl">{xp}</div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-full h-3 mb-1">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all"
                style={{ width: `${(xp % 500) / 500 * 100}%` }}
              />
            </div>
            <div className="text-gray-500 text-xs text-right">{500 - (xp % 500)} XP to Level {level + 1}</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-white font-black text-xl">{currentStreak}</div>
              <div className="text-gray-500 text-xs">day streak</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">💪</div>
              <div className="text-white font-black text-xl">{workoutLogs.length}</div>
              <div className="text-gray-500 text-xs">workouts logged</div>
            </div>
          </div>

          {/* Badges */}
          <div className="text-gray-400 text-xs font-bold">{badges.filter(b => b.unlocked).length}/{badges.length} BADGES UNLOCKED</div>
          <div className="space-y-2">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`border rounded-xl p-4 flex items-center gap-3 transition-all ${badge.unlocked ? 'bg-gray-900 border-yellow-500/40' : 'bg-gray-950 border-gray-800 opacity-50'}`}
                onClick={() => setShowBadgeDetail(showBadgeDetail === badge.id ? null : badge.id)}
              >
                <span className={`text-3xl ${badge.unlocked ? '' : 'grayscale'}`}>{badge.icon}</span>
                <div className="flex-1">
                  <div className={`font-bold ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.name}</div>
                  <div className="text-gray-500 text-xs">{badge.description}</div>
                  {badge.unlocked && badge.unlockedDate && (
                    <div className="text-yellow-500 text-xs mt-0.5">✓ Unlocked {badge.unlockedDate}</div>
                  )}
                </div>
                <div className="text-yellow-400 text-sm font-bold shrink-0">+{badge.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEEKLY REVIEW */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <div className="text-gray-400 text-xs">WEEK OF {weekStart}</div>

          {/* Weekly stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Weight Change', val: weekWeightChange !== null ? `${weekWeightChange > 0 ? '+' : ''}${weekWeightChange.toFixed(1)} lbs` : 'No data', color: weekWeightChange && weekWeightChange < 0 ? 'text-green-400' : 'text-red-400' },
              { label: 'Avg Calories', val: `${weekCalAvg}`, color: 'text-cyan-400' },
              { label: 'Workouts', val: String(weekWorkouts.length), color: 'text-blue-400' },
              { label: 'Task Completion', val: `${weekTaskAvg}%`, color: getGradeColor(weekTaskAvg) },
              { label: 'Journal Entries', val: String(weekJournals.length), color: 'text-purple-400' },
              { label: 'Days Tracked', val: String(weekLogs.length), color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">{s.label}</div>
                <div className={`font-black text-2xl ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Weekly grade */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 text-center">
            <div className="text-gray-400 text-xs mb-1">WEEKLY GRADE</div>
            <div className={`font-black text-6xl ${getGradeColor(weekTaskAvg)}`}>
              {weekTaskAvg >= 90 ? 'A' : weekTaskAvg >= 80 ? 'B' : weekTaskAvg >= 70 ? 'C' : weekTaskAvg >= 60 ? 'D' : 'F'}
            </div>
            <div className="text-gray-500 text-sm mt-1">Based on task completion, workouts & tracking</div>
          </div>

          {/* Weekly notes */}
          <div>
            <label className="text-gray-400 text-xs font-bold mb-1 block">WEEKLY REFLECTION</label>
            <textarea
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-cyan-500 min-h-24 resize-none"
              placeholder="What went well this week? What needs to improve?..."
              value={weeklyNotes || thisWeekReview?.notes || ''}
              onChange={e => setWeeklyNotes(e.target.value)}
            />
            <button
              onClick={() => addWeeklyReview(weekStart, weeklyNotes)}
              className="w-full mt-2 py-3 bg-cyan-500 rounded-xl text-black font-black"
            >
              Save Review
            </button>
          </div>
        </div>
      )}

      {/* WHAT-IF */}
      {activeTab === 'whatif' && (
        <div className="space-y-4">
          <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl p-5">
            <h3 className="text-white font-black text-lg mb-4">🧮 WHAT-IF CALCULATOR</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">IF I EAT (calories/day)</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-xl font-bold outline-none focus:border-cyan-500"
                  placeholder={String(profile?.dailyCalorieTarget || 1400)}
                  value={whatIfCals}
                  onChange={e => setWhatIfCals(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">EXTRA EXERCISE BURN (cal/day)</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-xl font-bold outline-none focus:border-cyan-500"
                  placeholder="0"
                  value={whatIfBurn}
                  onChange={e => setWhatIfBurn(e.target.value)}
                />
              </div>
            </div>

            {whatIfResult && (
              <div className="mt-4 space-y-3 border-t border-gray-800 pt-4">
                <div className="text-center">
                  <div className="text-gray-400 text-xs">PROJECTED WEEKLY LOSS</div>
                  <div className={`font-black text-4xl ${parseFloat(whatIfResult.weeklyLoss) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {parseFloat(whatIfResult.weeklyLoss) > 0 ? '-' : '+'}{Math.abs(parseFloat(whatIfResult.weeklyLoss))} lbs/wk
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs">PROJECTED GOAL DATE</div>
                  <div className="text-white font-black text-2xl">{whatIfResult.finishDate}</div>
                </div>
              </div>
            )}
          </div>

          {/* Deficit Calculator */}
          {profile && weightEntries.length >= 2 && (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
              <div className="text-gray-400 text-xs font-bold mb-3">ESTIMATED TDEE & DEFICIT</div>
              {(() => {
                const recent = weightEntries.slice(-7);
                const first = recent[0];
                const last = recent[recent.length - 1];
                if (!first || !last || first.id === last.id) return <div className="text-gray-500 text-sm">Need at least 7 days of data</div>;
                const days = (new Date(last.date).getTime() - new Date(first.date).getTime()) / 86400000;
                const lbs = first.weight - last.weight;
                const deficitEstimate = (lbs / days) * 3500;
                const tdeeEstimate = profile.dailyCalorieTarget + deficitEstimate;
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-400">Estimated TDEE:</span><span className="text-white font-bold">{Math.round(tdeeEstimate)} cal</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Actual Daily Deficit:</span><span className="text-green-400 font-bold">{Math.round(deficitEstimate)} cal</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Rate of Loss:</span><span className="text-cyan-400 font-bold">{((lbs / days) * 7).toFixed(2)} lbs/wk</span></div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {profile && (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-white font-bold">Profile</h3>
              {[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'currentWeight', label: 'Current Weight (lbs)', type: 'number' },
                { key: 'goalWeight', label: 'Goal Weight (lbs)', type: 'number' },
                { key: 'height', label: 'Height (inches)', type: 'number' },
                { key: 'age', label: 'Age', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-gray-500 text-xs">{f.label}</label>
                  <input
                    type={f.type}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 mt-1"
                    value={String(editProfile[f.key as keyof UserProfile] || '')}
                    onChange={e => setEditProfile(p => ({ ...p, [f.key]: f.type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="text-gray-500 text-xs">Deadline</label>
                <input
                  type="date"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 mt-1"
                  value={editProfile.deadline || ''}
                  onChange={e => setEditProfile(p => ({ ...p, deadline: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs">Daily Calorie Target (override)</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 mt-1"
                  value={editProfile.dailyCalorieTarget || ''}
                  onChange={e => setEditProfile(p => ({ ...p, dailyCalorieTarget: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs">Daily Protein Target (g)</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 mt-1"
                  value={editProfile.dailyProteinTarget || ''}
                  onChange={e => setEditProfile(p => ({ ...p, dailyProteinTarget: parseInt(e.target.value) }))}
                />
              </div>
              <button onClick={handleSaveProfile} className="w-full py-3 bg-cyan-500 rounded-xl text-black font-black">Save Profile</button>
            </div>
          )}

          {/* Data actions */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-white font-bold">Data</h3>
            <button onClick={handleExport} className="w-full py-3 bg-gray-800 rounded-xl text-white font-bold">
              📦 Export Data (JSON)
            </button>
            <button
              onClick={() => setShowDataWipe(true)}
              className="w-full py-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 font-bold"
            >
              💣 WIPE ALL DATA
            </button>
          </div>

          {/* App info */}
          <div className="text-center text-gray-600 text-xs py-4">
            <div className="font-black text-gray-500 text-base">WARPATH</div>
            <div>50 lbs. 90 days. No mercy.</div>
            <div>v1.0</div>
          </div>
        </div>
      )}

      {/* Data wipe modal */}
      {showDataWipe && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-6">
          <div className="bg-gray-900 border border-red-500 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-black text-xl mb-2">⚠️ WIPE ALL DATA?</h3>
            <p className="text-gray-400 mb-6">This will permanently delete EVERYTHING — weight logs, meals, workouts, journal entries, all of it. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDataWipe(false)} className="flex-1 py-3 bg-gray-800 rounded-xl text-white font-bold">Cancel</button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="flex-1 py-3 bg-red-600 rounded-xl text-white font-black"
              >
                WIPE IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
