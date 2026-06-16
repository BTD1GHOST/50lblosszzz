import type { UserProfile } from '../types';

export function calculateTDEE(profile: UserProfile): number {
  const { weight, height, age, gender, activityLevel } = {
    weight: profile.currentWeight,
    height: profile.height,
    age: profile.age,
    gender: profile.gender,
    activityLevel: profile.activityLevel,
  };

  // Mifflin-St Jeor
  let bmr: number;
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;

  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * multipliers[activityLevel]);
}

export function calculateDailyCalories(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  // 1000 calorie deficit = aggressive cut
  return Math.max(1200, tdee - 1000);
}

export function calculateDailyProtein(profile: UserProfile): number {
  // 1g per lb of bodyweight
  return Math.round(profile.currentWeight * 1.0);
}

export function calculateProjectedDate(
  currentWeight: number,
  goalWeight: number,
  weeklyLossRate: number
): Date {
  const lbsToLose = currentWeight - goalWeight;
  const weeksNeeded = lbsToLose / Math.max(weeklyLossRate, 0.5);
  const projected = new Date();
  projected.setDate(projected.getDate() + weeksNeeded * 7);
  return projected;
}

export function calculateWeeklyLossRate(
  entries: { date: string; weight: number }[]
): number {
  if (entries.length < 2) return 0;
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const daysDiff = (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24);
  const weeksDiff = daysDiff / 7;
  if (weeksDiff < 0.5) return 0;
  return (first.weight - last.weight) / weeksDiff;
}

export function calculateDaysRemaining(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(deadline);
  end.setHours(0, 0, 0, 0);
  const diff = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function calculateBMI(weightLbs: number, heightInches: number): number {
  return Math.round(((weightLbs / (heightInches * heightInches)) * 703) * 10) / 10;
}

export function calculateNavyBodyFat(
  gender: 'male' | 'female',
  waist: number,
  neck: number,
  height: number,
  hips?: number
): number {
  if (gender === 'male') {
    return Math.round((495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450) * 10) / 10;
  } else {
    if (!hips) return 0;
    return Math.round((495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450) * 10) / 10;
  }
}

export function getDailyGrade(
  completionPct: number,
  caloriesRemaining: number,
  workedOut: boolean,
  calorieTarget: number
): string {
  let score = 0;
  score += (completionPct / 100) * 40;
  if (caloriesRemaining >= 0) score += 30;
  else score += Math.max(0, 30 + (caloriesRemaining / calorieTarget) * 30);
  if (workedOut) score += 30;
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function getWeeklyAverage(
  entries: { date: string; weight: number }[]
): number | null {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recent = entries.filter(e => new Date(e.date) >= weekAgo);
  if (recent.length === 0) return null;
  return Math.round((recent.reduce((sum, e) => sum + e.weight, 0) / recent.length) * 10) / 10;
}

export function formatCountdown(deadline: string): string {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return '0d 0h 0m';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${days}d ${hours}h ${mins}m`;
}

export function getPaceStatus(
  currentWeight: number,
  goalWeight: number,
  startWeight: number,
  startDate: string,
  deadline: string
): 'ahead' | 'on-track' | 'behind' {
  const totalDays = (new Date(deadline).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
  const daysPassed = (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
  const totalToLose = startWeight - goalWeight;
  const expectedLost = (daysPassed / totalDays) * totalToLose;
  const actualLost = startWeight - currentWeight;
  const diff = actualLost - expectedLost;
  if (diff > 1) return 'ahead';
  if (diff < -1) return 'behind';
  return 'on-track';
}
