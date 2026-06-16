export interface UserProfile {
  name: string;
  startingWeight: number;
  currentWeight: number;
  goalWeight: number;
  height: number; // inches
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  deadline: string; // ISO date string
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  units: 'imperial' | 'metric';
  colorTheme: 'blue' | 'red';
  darkMode: boolean;
  startDate: string;
  onboardingComplete: boolean;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface Meal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'shake' | 'zero_cal';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  prepTime: number; // minutes
  ingredients: string[];
  instructions: string[];
  tags: string[];
  favorite?: boolean;
  custom?: boolean;
}

export interface FoodLogEntry {
  id: string;
  date: string;
  mealId?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyFoodLog {
  date: string;
  entries: FoodLogEntry[];
}

export interface Task {
  id: string;
  name: string;
  category: 'nutrition' | 'fitness' | 'habits' | 'mindset';
  completed: boolean;
  streak: number;
  lastCompleted?: string;
  order: number;
  custom?: boolean;
}

export interface DailyTaskRecord {
  date: string;
  tasks: { id: string; name: string; completed: boolean }[];
  completionPercentage: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // seconds
  rest: number; // seconds
  description: string;
  formCues: string;
  muscleGroups: string[];
}

export interface Workout {
  id: string;
  name: string;
  phase: 1 | 2 | 3;
  week: number;
  type: 'hiit' | 'strength' | 'cardio' | 'core' | 'bodyweight' | 'finisher';
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedCalories: number;
  duration: number; // minutes
  exercises: Exercise[];
  description: string;
  tags: string[];
}

export interface WorkoutLogEntry {
  id: string;
  date: string;
  workoutId: string;
  workoutName: string;
  exercises: {
    exerciseId: string;
    name: string;
    sets: { reps: number; weight: number; completed: boolean }[];
    completed: boolean;
  }[];
  completed: boolean;
  duration?: number;
  caloriesBurned?: number;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  wordCount: number;
  prompt?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  neck?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  bodyFat?: number;
}

export interface HabitEntry {
  habitId: string;
  dates: string[];
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  startDate: string;
  active: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  xp: number;
}

export interface WaterLog {
  date: string;
  oz: number;
}

export interface Supplement {
  id: string;
  name: string;
  completed: boolean;
  custom?: boolean;
}

export interface DailySupplementLog {
  date: string;
  supplements: { id: string; completed: boolean }[];
}

export interface AppState {
  currentTab: string;
  profile: UserProfile | null;
  xp: number;
  level: number;
  badges: Badge[];
  infractions: { date: string; description: string; penalty: string }[];
}
