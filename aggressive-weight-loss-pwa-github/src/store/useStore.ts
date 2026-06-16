import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserProfile, WeightEntry, FoodLogEntry, Task, DailyTaskRecord,
  WorkoutLogEntry, JournalEntry, BodyMeasurement, Habit, Badge, WaterLog,
  Supplement, DailyFoodLog
} from '../types';
import { BADGE_DEFINITIONS } from '../data/badges';
import { v4 as uuid } from './uuid';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

interface AppStore {
  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;

  // Profile
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;

  // XP & Level
  xp: number;
  level: number;
  addXP: (amount: number) => void;

  // Badges
  badges: Badge[];
  unlockBadge: (id: string) => void;

  // Weight
  weightEntries: WeightEntry[];
  addWeightEntry: (weight: number, note?: string) => void;
  deleteWeightEntry: (id: string) => void;

  // Food Log
  dailyFoodLogs: DailyFoodLog[];
  addFoodEntry: (entry: Omit<FoodLogEntry, 'id' | 'date'>, date?: string) => void;
  removeFoodEntry: (date: string, entryId: string) => void;
  getFoodLog: (date: string) => DailyFoodLog | undefined;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  toggleTask: (id: string) => void;
  addTask: (name: string, category: Task['category']) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, name: string) => void;
  resetTasks: () => void;
  taskHistory: DailyTaskRecord[];
  saveTodayTaskHistory: () => void;
  autoReset: boolean;
  setAutoReset: (v: boolean) => void;

  // Workout Log
  workoutLogs: WorkoutLogEntry[];
  addWorkoutLog: (log: Omit<WorkoutLogEntry, 'id'>) => void;
  updateWorkoutLog: (id: string, updates: Partial<WorkoutLogEntry>) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'wordCount'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  futureLetter: { text: string; unlockDate: string; locked: boolean } | null;
  setFutureLetter: (letter: { text: string; unlockDate: string; locked: boolean }) => void;

  // Body Measurements
  measurements: BodyMeasurement[];
  addMeasurement: (m: Omit<BodyMeasurement, 'id'>) => void;

  // Habits
  habits: Habit[];
  habitLogs: { habitId: string; dates: string[] }[];
  addHabit: (h: Omit<Habit, 'id'>) => void;
  toggleHabitDate: (habitId: string, date: string) => void;
  deleteHabit: (id: string) => void;

  // Water
  waterLogs: WaterLog[];
  addWater: (oz: number, date?: string) => void;
  setWater: (oz: number, date?: string) => void;
  getTodayWater: () => number;

  // Supplements
  supplements: Supplement[];
  supplementLogs: { date: string; ids: string[] }[];
  addSupplement: (name: string) => void;
  toggleSupplement: (id: string) => void;
  deleteSupplement: (id: string) => void;
  getTodaySupplements: () => string[];

  // Favorites
  favoriteMealIds: string[];
  toggleFavoriteMeal: (id: string) => void;

  // Infractions
  infractions: { id: string; date: string; description: string; penalty: string }[];
  addInfraction: (description: string, penalty: string) => void;

  // War Room
  warRoom: { why: string; rules: string[]; nonNegotiables: string[] };
  setWarRoom: (w: AppStore['warRoom']) => void;

  // Affirmations
  customAffirmations: string[];
  addAffirmation: (text: string) => void;
  deleteAffirmation: (text: string) => void;

  // Streak
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string;
  updateStreak: () => void;

  // Current tab
  currentTab: string;
  setCurrentTab: (tab: string) => void;

  // Vision board images (base64 stored)
  visionBoardImages: { id: string; dataUrl: string; label: string }[];
  addVisionImage: (dataUrl: string, label: string) => void;
  removeVisionImage: (id: string) => void;

  // Weekly review
  weeklyReviews: { weekStart: string; notes: string }[];
  addWeeklyReview: (weekStart: string, notes: string) => void;
}

const DEFAULT_TASKS: Task[] = [
  { id: 't1', name: 'Morning weigh-in', category: 'habits', completed: false, streak: 0, order: 0 },
  { id: 't2', name: 'Logged all meals', category: 'nutrition', completed: false, streak: 0, order: 1 },
  { id: 't3', name: 'Stayed under calorie goal', category: 'nutrition', completed: false, streak: 0, order: 2 },
  { id: 't4', name: 'Hit protein target (150g+)', category: 'nutrition', completed: false, streak: 0, order: 3 },
  { id: 't5', name: 'Drank 1 gallon of water', category: 'nutrition', completed: false, streak: 0, order: 4 },
  { id: 't6', name: 'Completed workout', category: 'fitness', completed: false, streak: 0, order: 5 },
  { id: 't7', name: '10,000+ steps', category: 'fitness', completed: false, streak: 0, order: 6 },
  { id: 't8', name: 'No sugar', category: 'nutrition', completed: false, streak: 0, order: 7 },
  { id: 't9', name: 'No alcohol', category: 'habits', completed: false, streak: 0, order: 8 },
  { id: 't10', name: 'No fast food', category: 'nutrition', completed: false, streak: 0, order: 9 },
  { id: 't11', name: 'Took progress photo', category: 'habits', completed: false, streak: 0, order: 10 },
  { id: 't12', name: '8 hours of sleep', category: 'habits', completed: false, streak: 0, order: 11 },
  { id: 't13', name: 'Cold shower', category: 'habits', completed: false, streak: 0, order: 12 },
  { id: 't14', name: 'Read/listened to something motivational', category: 'mindset', completed: false, streak: 0, order: 13 },
  { id: 't15', name: 'Journaled today', category: 'mindset', completed: false, streak: 0, order: 14 },
];

const DEFAULT_SUPPLEMENTS: Supplement[] = [
  { id: 'sup1', name: 'Multivitamin', completed: false },
  { id: 'sup2', name: 'Fish Oil', completed: false },
  { id: 'sup3', name: 'Creatine', completed: false },
  { id: 'sup4', name: 'Protein Powder', completed: false },
  { id: 'sup5', name: 'Electrolytes', completed: false },
];

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),

      profile: null,
      setProfile: (p) => set({ profile: p }),

      xp: 0,
      level: 1,
      addXP: (amount) => {
        const newXP = get().xp + amount;
        const newLevel = Math.floor(newXP / 500) + 1;
        set({ xp: newXP, level: newLevel });
      },

      badges: BADGE_DEFINITIONS.map(b => ({ ...b })),
      unlockBadge: (id) => {
        const badges = get().badges.map(b =>
          b.id === id && !b.unlocked ? { ...b, unlocked: true, unlockedDate: todayStr() } : b
        );
        set({ badges });
        const badge = badges.find(b => b.id === id);
        if (badge) get().addXP(badge.xp);
      },

      weightEntries: [],
      addWeightEntry: (weight, note) => {
        const entry: WeightEntry = { id: uuid(), date: todayStr(), weight, note };
        const entries = [...get().weightEntries, entry].sort((a, b) => a.date.localeCompare(b.date));
        // Update current weight in profile
        const profile = get().profile;
        if (profile) {
          set({ weightEntries: entries, profile: { ...profile, currentWeight: weight } });
        } else {
          set({ weightEntries: entries });
        }
        // check weight badges inline
        const lost = (get().profile?.startingWeight || 0) - weight;
        if (get().weightEntries.length >= 1) get().unlockBadge('b001');
        if (lost >= 5) get().unlockBadge('b002');
        if (lost >= 10) get().unlockBadge('b003');
        if (lost >= 25) get().unlockBadge('b004');
        if (lost >= 50) get().unlockBadge('b005');
      },
      deleteWeightEntry: (id) => set({ weightEntries: get().weightEntries.filter(e => e.id !== id) }),
    

      dailyFoodLogs: [],
      addFoodEntry: (entry, date) => {
        const d = date || todayStr();
        const logs = [...get().dailyFoodLogs];
        const idx = logs.findIndex(l => l.date === d);
        const fullEntry: FoodLogEntry = { ...entry, id: uuid(), date: d };
        if (idx >= 0) {
          logs[idx] = { ...logs[idx], entries: [...logs[idx].entries, fullEntry] };
        } else {
          logs.push({ date: d, entries: [fullEntry] });
        }
        set({ dailyFoodLogs: logs });
        get().addXP(5);
      },
      removeFoodEntry: (date, entryId) => {
        const logs = get().dailyFoodLogs.map(l =>
          l.date === date ? { ...l, entries: l.entries.filter(e => e.id !== entryId) } : l
        );
        set({ dailyFoodLogs: logs });
      },
      getFoodLog: (date) => get().dailyFoodLogs.find(l => l.date === date),

      tasks: DEFAULT_TASKS,
      setTasks: (tasks) => set({ tasks }),
      toggleTask: (id) => {
        const today = todayStr();
        const tasks = get().tasks.map(t => {
          if (t.id !== id) return t;
          const wasCompleted = t.completed;
          const newCompleted = !wasCompleted;
          let newStreak = t.streak;
          if (newCompleted) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            newStreak = t.lastCompleted === yesterdayStr ? t.streak + 1 : 1;
          }
          return { ...t, completed: newCompleted, lastCompleted: newCompleted ? today : t.lastCompleted, streak: newStreak };
        });
        set({ tasks });
        if (tasks.find(t => t.id === id)?.completed) get().addXP(10);
        get().saveTodayTaskHistory();
      },
      addTask: (name, category) => {
        const tasks = [...get().tasks, {
          id: uuid(), name, category, completed: false, streak: 0, order: get().tasks.length, custom: true
        }];
        set({ tasks });
      },
      deleteTask: (id) => set({ tasks: get().tasks.filter(t => t.id !== id) }),
      editTask: (id, name) => set({ tasks: get().tasks.map(t => t.id === id ? { ...t, name } : t) }),
      resetTasks: () => {
        get().saveTodayTaskHistory();
        set({ tasks: get().tasks.map(t => ({ ...t, completed: false })) });
      },
      taskHistory: [],
      saveTodayTaskHistory: () => {
        const today = todayStr();
        const tasks = get().tasks;
        const completed = tasks.filter(t => t.completed).length;
        const pct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
        const record: DailyTaskRecord = {
          date: today,
          tasks: tasks.map(t => ({ id: t.id, name: t.name, completed: t.completed })),
          completionPercentage: pct,
        };
        const history = get().taskHistory.filter(h => h.date !== today);
        set({ taskHistory: [...history, record] });
        get().updateStreak();
      },
      autoReset: true,
      setAutoReset: (v) => set({ autoReset: v }),

      workoutLogs: [],
      addWorkoutLog: (log) => {
        set({ workoutLogs: [...get().workoutLogs, { ...log, id: uuid() }] });
        get().addXP(50);
        const total = get().workoutLogs.length + 1;
        if (total >= 1) get().unlockBadge('b010');
        if (total >= 10) get().unlockBadge('b011');
        if (total >= 25) get().unlockBadge('b012');
        if (total >= 50) get().unlockBadge('b013');
        if (total >= 100) get().unlockBadge('b014');
      },
      updateWorkoutLog: (id, updates) => {
        set({ workoutLogs: get().workoutLogs.map(l => l.id === id ? { ...l, ...updates } : l) });
      },

      journalEntries: [],
      addJournalEntry: (entry) => {
        const wordCount = entry.text.trim().split(/\s+/).filter(Boolean).length;
        const full: JournalEntry = { ...entry, id: uuid(), wordCount };
        set({ journalEntries: [full, ...get().journalEntries] });
        get().addXP(20);
        const total = get().journalEntries.length + 1;
        if (total >= 30) get().unlockBadge('b023');
      },
      updateJournalEntry: (id, updates) => {
        set({
          journalEntries: get().journalEntries.map(e => {
            if (e.id !== id) return e;
            const merged = { ...e, ...updates };
            return { ...merged, wordCount: merged.text.trim().split(/\s+/).filter(Boolean).length };
          })
        });
      },
      deleteJournalEntry: (id) => set({ journalEntries: get().journalEntries.filter(e => e.id !== id) }),
      futureLetter: null,
      setFutureLetter: (letter) => set({ futureLetter: letter }),

      measurements: [],
      addMeasurement: (m) => set({ measurements: [...get().measurements, { ...m, id: uuid() }] }),

      habits: [],
      habitLogs: [],
      addHabit: (h) => {
        const id = uuid();
        set({ habits: [...get().habits, { ...h, id }] });
      },
      toggleHabitDate: (habitId, date) => {
        const logs = [...get().habitLogs];
        const idx = logs.findIndex(l => l.habitId === habitId);
        if (idx >= 0) {
          const dates = logs[idx].dates.includes(date)
            ? logs[idx].dates.filter(d => d !== date)
            : [...logs[idx].dates, date];
          logs[idx] = { ...logs[idx], dates };
        } else {
          logs.push({ habitId, dates: [date] });
        }
        set({ habitLogs: logs });
      },
      deleteHabit: (id) => {
        set({
          habits: get().habits.filter(h => h.id !== id),
          habitLogs: get().habitLogs.filter(l => l.habitId !== id),
        });
      },

      waterLogs: [],
      addWater: (oz, date) => {
        const d = date || todayStr();
        const logs = [...get().waterLogs];
        const idx = logs.findIndex(l => l.date === d);
        if (idx >= 0) {
          logs[idx] = { ...logs[idx], oz: logs[idx].oz + oz };
        } else {
          logs.push({ date: d, oz });
        }
        set({ waterLogs: logs });
        // Check hydration badge
        const daysHit = logs.filter(l => l.oz >= 128).length;
        if (daysHit >= 30) get().unlockBadge('b017');
      },
      setWater: (oz, date) => {
        const d = date || todayStr();
        const logs = [...get().waterLogs];
        const idx = logs.findIndex(l => l.date === d);
        if (idx >= 0) {
          logs[idx] = { ...logs[idx], oz };
        } else {
          logs.push({ date: d, oz });
        }
        set({ waterLogs: logs });
      },
      getTodayWater: () => get().waterLogs.find(l => l.date === todayStr())?.oz || 0,

      supplements: DEFAULT_SUPPLEMENTS,
      supplementLogs: [],
      addSupplement: (name) => {
        set({ supplements: [...get().supplements, { id: uuid(), name, completed: false, custom: true }] });
      },
      toggleSupplement: (id) => {
        const today = todayStr();
        const logs = [...get().supplementLogs];
        const idx = logs.findIndex(l => l.date === today);
        let todayIds = idx >= 0 ? [...logs[idx].ids] : [];
        if (todayIds.includes(id)) {
          todayIds = todayIds.filter(i => i !== id);
        } else {
          todayIds.push(id);
        }
        if (idx >= 0) {
          logs[idx] = { date: today, ids: todayIds };
        } else {
          logs.push({ date: today, ids: todayIds });
        }
        set({ supplementLogs: logs });
      },
      deleteSupplement: (id) => set({ supplements: get().supplements.filter(s => s.id !== id) }),
      getTodaySupplements: () => {
        const today = todayStr();
        return get().supplementLogs.find(l => l.date === today)?.ids || [];
      },

      favoriteMealIds: [],
      toggleFavoriteMeal: (id) => {
        const favs = get().favoriteMealIds;
        set({ favoriteMealIds: favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id] });
      },

      infractions: [],
      addInfraction: (description, penalty) => {
        set({ infractions: [...get().infractions, { id: uuid(), date: todayStr(), description, penalty }] });
      },

      warRoom: { why: '', rules: [], nonNegotiables: [] },
      setWarRoom: (w) => set({ warRoom: w }),

      customAffirmations: [],
      addAffirmation: (text) => set({ customAffirmations: [...get().customAffirmations, text] }),
      deleteAffirmation: (text) => set({ customAffirmations: get().customAffirmations.filter(a => a !== text) }),

      currentStreak: 0,
      longestStreak: 0,
      lastStreakDate: '',
      updateStreak: () => {
        const today = todayStr();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        const { lastStreakDate, currentStreak, longestStreak } = get();
        const todayRecord = get().taskHistory.find(h => h.date === today);
        if (!todayRecord || todayRecord.completionPercentage < 100) return;
        let newStreak = currentStreak;
        if (lastStreakDate === yStr || lastStreakDate === today) {
          newStreak = lastStreakDate === today ? currentStreak : currentStreak + 1;
        } else {
          newStreak = 1;
        }
        const newLongest = Math.max(newStreak, longestStreak);
        set({ currentStreak: newStreak, longestStreak: newLongest, lastStreakDate: today });
        if (newStreak >= 7) get().unlockBadge('b006');
        if (newStreak >= 30) get().unlockBadge('b007');
        if (newStreak >= 60) get().unlockBadge('b008');
        if (newStreak >= 90) get().unlockBadge('b009');
      },

      currentTab: 'dashboard',
      setCurrentTab: (tab) => set({ currentTab: tab }),

      visionBoardImages: [],
      addVisionImage: (dataUrl, label) => {
        set({ visionBoardImages: [...get().visionBoardImages, { id: uuid(), dataUrl, label }] });
      },
      removeVisionImage: (id) => set({ visionBoardImages: get().visionBoardImages.filter(i => i.id !== id) }),

      weeklyReviews: [],
      addWeeklyReview: (weekStart, notes) => {
        const reviews = get().weeklyReviews.filter(r => r.weekStart !== weekStart);
        set({ weeklyReviews: [...reviews, { weekStart, notes }] });
      },
    }),
    {
      name: 'warpath-storage',
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { currentTab, ...rest } = state;
        return rest;
      },
    }
  )
);


