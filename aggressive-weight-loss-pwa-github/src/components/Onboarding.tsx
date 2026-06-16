import { useState } from 'react';
import { useStore } from '../store/useStore';
import { calculateDailyCalories, calculateDailyProtein } from '../utils/calculations';
import type { UserProfile } from '../types';

export default function Onboarding() {
  const { setProfile, setOnboardingComplete } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    currentWeight: '',
    goalWeight: '',
    height: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    activityLevel: 'moderate' as UserProfile['activityLevel'],
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 90);
      return d.toISOString().split('T')[0];
    })(),
  });

  const update = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

  const handleFinish = () => {
    const profile: UserProfile = {
      name: form.name || 'Warrior',
      startingWeight: parseFloat(form.currentWeight),
      currentWeight: parseFloat(form.currentWeight),
      goalWeight: parseFloat(form.goalWeight),
      height: parseFloat(form.height),
      age: parseInt(form.age),
      gender: form.gender,
      activityLevel: form.activityLevel,
      deadline: form.deadline,
      dailyCalorieTarget: 0,
      dailyProteinTarget: 0,
      units: 'imperial',
      colorTheme: 'blue',
      darkMode: true,
      startDate: new Date().toISOString().split('T')[0],
      onboardingComplete: true,
    };
    profile.dailyCalorieTarget = calculateDailyCalories(profile);
    profile.dailyProteinTarget = calculateDailyProtein(profile);
    setProfile(profile);
    setOnboardingComplete(true);
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="text-8xl mb-6">⚔️</div>
      <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">WARPATH</h1>
      <p className="text-cyan-400 text-xl font-bold mb-4">50 lbs. 90 days. No mercy.</p>
      <p className="text-gray-400 text-base mb-10 max-w-xs">
        This is not a diet app. This is a war. You will track everything, miss nothing, and become unstoppable.
      </p>
      <button
        onClick={() => setStep(1)}
        className="bg-cyan-500 text-black font-black text-xl px-10 py-4 rounded-2xl w-full max-w-xs active:scale-95 transition-transform"
      >
        I'M READY →
      </button>
    </div>,

    // Step 1: Name & basics
    <div key="basics" className="flex flex-col px-6 pt-8 gap-5">
      <h2 className="text-2xl font-black text-white">Who are you, Soldier?</h2>
      <div>
        <label className="text-gray-400 text-sm mb-1 block">YOUR NAME</label>
        <input
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg focus:border-cyan-500 outline-none"
          placeholder="Enter your name..."
          value={form.name}
          onChange={e => update('name', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">AGE</label>
          <input
            type="number"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg focus:border-cyan-500 outline-none"
            placeholder="25"
            value={form.age}
            onChange={e => update('age', e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">HEIGHT (inches)</label>
          <input
            type="number"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg focus:border-cyan-500 outline-none"
            placeholder='70"'
            value={form.height}
            onChange={e => update('height', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="text-gray-400 text-sm mb-1 block">GENDER</label>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as const).map(g => (
            <button
              key={g}
              onClick={() => update('gender', g)}
              className={`py-3 rounded-xl font-bold text-lg capitalize transition-all ${form.gender === g ? 'bg-cyan-500 text-black' : 'bg-gray-900 border border-gray-700 text-white'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => setStep(2)}
        disabled={!form.name || !form.age || !form.height}
        className="mt-4 bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-black font-black text-xl px-10 py-4 rounded-2xl w-full active:scale-95 transition-transform"
      >
        NEXT →
      </button>
    </div>,

    // Step 2: Weight goals
    <div key="weight" className="flex flex-col px-6 pt-8 gap-5">
      <h2 className="text-2xl font-black text-white">Set Your Targets</h2>
      <div>
        <label className="text-gray-400 text-sm mb-1 block">CURRENT WEIGHT (lbs)</label>
        <input
          type="number"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-2xl font-bold focus:border-cyan-500 outline-none"
          placeholder="220"
          value={form.currentWeight}
          onChange={e => update('currentWeight', e.target.value)}
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm mb-1 block">GOAL WEIGHT (lbs)</label>
        <input
          type="number"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-2xl font-bold focus:border-cyan-500 outline-none"
          placeholder="170"
          value={form.goalWeight}
          onChange={e => update('goalWeight', e.target.value)}
        />
      </div>
      {form.currentWeight && form.goalWeight && (
        <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-4">
          <p className="text-cyan-400 font-bold text-center">
            🎯 Goal: Lose {(parseFloat(form.currentWeight) - parseFloat(form.goalWeight)).toFixed(1)} lbs
          </p>
          <p className="text-gray-400 text-sm text-center mt-1">
            That's {((parseFloat(form.currentWeight) - parseFloat(form.goalWeight)) / 90 * 7).toFixed(1)} lbs/week
          </p>
        </div>
      )}
      <div>
        <label className="text-gray-400 text-sm mb-1 block">DEADLINE DATE</label>
        <input
          type="date"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg focus:border-cyan-500 outline-none"
          value={form.deadline}
          onChange={e => update('deadline', e.target.value)}
        />
      </div>
      <button
        onClick={() => setStep(3)}
        disabled={!form.currentWeight || !form.goalWeight}
        className="mt-4 bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-black font-black text-xl px-10 py-4 rounded-2xl w-full active:scale-95 transition-transform"
      >
        NEXT →
      </button>
    </div>,

    // Step 3: Activity level
    <div key="activity" className="flex flex-col px-6 pt-8 gap-4">
      <h2 className="text-2xl font-black text-white">Activity Level</h2>
      <p className="text-gray-400">Be honest. We'll calculate your exact calorie target.</p>
      {([
        { val: 'sedentary', label: 'Sedentary', sub: 'Little or no exercise' },
        { val: 'light', label: 'Light', sub: '1-3 days/week exercise' },
        { val: 'moderate', label: 'Moderate', sub: '3-5 days/week exercise' },
        { val: 'active', label: 'Active', sub: '6-7 days/week exercise' },
        { val: 'very_active', label: 'Very Active', sub: 'Intense daily training' },
      ] as const).map(opt => (
        <button
          key={opt.val}
          onClick={() => update('activityLevel', opt.val)}
          className={`flex justify-between items-center p-4 rounded-xl border transition-all ${form.activityLevel === opt.val ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 bg-gray-900'}`}
        >
          <div className="text-left">
            <div className="text-white font-bold">{opt.label}</div>
            <div className="text-gray-400 text-sm">{opt.sub}</div>
          </div>
          {form.activityLevel === opt.val && <span className="text-cyan-400 text-xl">✓</span>}
        </button>
      ))}
      <button
        onClick={() => setStep(4)}
        className="mt-2 bg-cyan-500 text-black font-black text-xl px-10 py-4 rounded-2xl w-full active:scale-95 transition-transform"
      >
        NEXT →
      </button>
    </div>,

    // Step 4: Plan preview
    <div key="plan" className="flex flex-col px-6 pt-8 gap-5">
      <h2 className="text-2xl font-black text-white">YOUR WAR PLAN</h2>
      {form.currentWeight && form.goalWeight && form.height && form.age && (
        (() => {
          const tempProfile: UserProfile = {
            name: form.name,
            startingWeight: parseFloat(form.currentWeight),
            currentWeight: parseFloat(form.currentWeight),
            goalWeight: parseFloat(form.goalWeight),
            height: parseFloat(form.height),
            age: parseInt(form.age),
            gender: form.gender,
            activityLevel: form.activityLevel,
            deadline: form.deadline,
            dailyCalorieTarget: 0,
            dailyProteinTarget: 0,
            units: 'imperial',
            colorTheme: 'blue',
            darkMode: true,
            startDate: new Date().toISOString().split('T')[0],
            onboardingComplete: false,
          };
          const cals = calculateDailyCalories(tempProfile);
          const protein = calculateDailyProtein(tempProfile);
          const lbsToLose = parseFloat(form.currentWeight) - parseFloat(form.goalWeight);
          const weeksNeeded = lbsToLose / 1.5;
          return (
            <div className="space-y-3">
              {[
                { label: '🔥 Daily Calories', val: `${cals} cal`, accent: true },
                { label: '🥩 Daily Protein', val: `${protein}g minimum` },
                { label: '⚖️ To Lose', val: `${lbsToLose.toFixed(0)} lbs` },
                { label: '📅 Projected Finish', val: `~${weeksNeeded.toFixed(0)} weeks at 1.5 lbs/week` },
                { label: '💪 Strategy', val: '1,000 cal/day deficit + training' },
              ].map(item => (
                <div key={item.label} className={`p-4 rounded-xl border ${item.accent ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 bg-gray-900'}`}>
                  <div className="text-gray-400 text-sm">{item.label}</div>
                  <div className="text-white font-black text-xl">{item.val}</div>
                </div>
              ))}
            </div>
          );
        })()
      )}
      <button
        onClick={handleFinish}
        className="mt-4 bg-red-500 text-white font-black text-2xl px-10 py-5 rounded-2xl w-full active:scale-95 transition-transform shadow-lg shadow-red-500/30"
      >
        LET'S GO ⚡
      </button>
    </div>,
  ];

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {step > 0 && (
        <div className="flex items-center px-6 pt-6 pb-2">
          <button onClick={() => setStep(s => s - 1)} className="text-gray-400 text-lg mr-4">← Back</button>
          <div className="flex gap-1 flex-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${step >= i ? 'bg-cyan-500' : 'bg-gray-800'}`} />
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto pb-8">
        {steps[step]}
      </div>
    </div>
  );
}
