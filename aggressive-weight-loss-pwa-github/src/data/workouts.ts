import type { Workout } from '../types';

export const WORKOUT_DATABASE: Workout[] = [
  // ===== PHASE 1: FOUNDATION (Weeks 1-4) =====
  {
    id: 'w1', name: 'Full Body Foundation', phase: 1, week: 1, type: 'strength', difficulty: 2,
    estimatedCalories: 280, duration: 45, description: 'Building your base. Focus on form over weight.',
    tags: ['Full Body', 'Beginner', 'Strength'],
    exercises: [
      { id: 'e1', name: 'Bodyweight Squat', sets: 3, reps: 15, rest: 60, description: 'Full squat to parallel', formCues: 'Chest up, knees track over toes, weight in heels', muscleGroups: ['quads', 'glutes'] },
      { id: 'e2', name: 'Push-Up', sets: 3, reps: 12, rest: 60, description: 'Standard push-up', formCues: 'Straight body line, lower chest to floor', muscleGroups: ['chest', 'shoulders', 'triceps'] },
      { id: 'e3', name: 'Dumbbell Row', sets: 3, reps: 12, rest: 60, description: 'Bent-over single arm row', formCues: 'Flat back, pull elbow to hip, squeeze at top', muscleGroups: ['back', 'biceps'] },
      { id: 'e4', name: 'Plank', duration: 45, sets: 3, rest: 45, description: '45-second hold', formCues: 'Neutral spine, brace core, don\'t let hips sag', muscleGroups: ['core', 'shoulders'] },
      { id: 'e5', name: 'Glute Bridge', sets: 3, reps: 15, rest: 45, description: 'Hip thrust variation', formCues: 'Drive through heels, squeeze glutes at top', muscleGroups: ['glutes', 'hamstrings'] },
    ]
  },
  {
    id: 'w2', name: 'HIIT Starter #1', phase: 1, week: 1, type: 'hiit', difficulty: 2,
    estimatedCalories: 320, duration: 20, description: '20-min fat burning cardio circuit.',
    tags: ['HIIT', 'Cardio', 'Fat Burn'],
    exercises: [
      { id: 'e6', name: 'Jumping Jacks', duration: 45, sets: 4, rest: 15, description: '45s on, 15s off', formCues: 'Arms fully extend overhead, land soft', muscleGroups: ['full body'] },
      { id: 'e7', name: 'High Knees', duration: 45, sets: 4, rest: 15, description: 'Pump knees above hip level', formCues: 'Stay on balls of feet, drive arms', muscleGroups: ['core', 'hip flexors'] },
      { id: 'e8', name: 'Mountain Climbers', duration: 45, sets: 4, rest: 15, description: 'Fast alternating knee drives', formCues: 'Hips level, core tight, fast pace', muscleGroups: ['core', 'shoulders'] },
      { id: 'e9', name: 'Burpee', reps: 10, sets: 4, rest: 20, description: 'Full burpee with jump', formCues: 'Control descent, explosive jump, clap overhead', muscleGroups: ['full body'] },
      { id: 'e10', name: 'Jump Rope (or Simulate)', duration: 60, sets: 3, rest: 20, description: 'Continuous skip or simulate', formCues: 'Stay on toes, wrists lead the movement', muscleGroups: ['calves', 'cardio'] },
    ]
  },
  {
    id: 'w3', name: 'Upper Body Strength A', phase: 1, week: 2, type: 'strength', difficulty: 2,
    estimatedCalories: 260, duration: 40, description: 'Push-focused upper body.',
    tags: ['Upper Body', 'Push', 'Strength'],
    exercises: [
      { id: 'e11', name: 'Dumbbell Bench Press', sets: 4, reps: 12, rest: 75, description: 'Flat bench dumbbell press', formCues: 'Arch natural, elbows 45°, full range', muscleGroups: ['chest', 'shoulders', 'triceps'] },
      { id: 'e12', name: 'Overhead Press', sets: 3, reps: 12, rest: 75, description: 'Standing dumbbell press', formCues: 'Brace core, press straight up, don\'t flare elbows', muscleGroups: ['shoulders', 'triceps'] },
      { id: 'e13', name: 'Lateral Raise', sets: 3, reps: 15, rest: 45, description: 'Dumbbell lateral raise', formCues: 'Slight forward lean, lead with elbow, controlled eccentric', muscleGroups: ['shoulders'] },
      { id: 'e14', name: 'Tricep Pushdown', sets: 3, reps: 15, rest: 45, description: 'Cable or band pushdown', formCues: 'Elbows pinned to sides, full extension', muscleGroups: ['triceps'] },
      { id: 'e15', name: 'Diamond Push-Up', sets: 3, reps: 10, rest: 60, description: 'Close-grip push-up', formCues: 'Hands form diamond, elbows close to body', muscleGroups: ['triceps', 'chest'] },
    ]
  },
  {
    id: 'w4', name: 'Lower Body Strength A', phase: 1, week: 2, type: 'strength', difficulty: 2,
    estimatedCalories: 300, duration: 40, description: 'Leg and glute foundation.',
    tags: ['Lower Body', 'Legs', 'Strength'],
    exercises: [
      { id: 'e16', name: 'Goblet Squat', sets: 4, reps: 12, rest: 75, description: 'Squat holding dumbbell at chest', formCues: 'Elbows inside knees, depth below parallel', muscleGroups: ['quads', 'glutes'] },
      { id: 'e17', name: 'Romanian Deadlift', sets: 3, reps: 12, rest: 75, description: 'Hip hinge with dumbbells', formCues: 'Soft knee bend, push hips back, bar drags legs', muscleGroups: ['hamstrings', 'glutes'] },
      { id: 'e18', name: 'Walking Lunges', sets: 3, reps: 20, rest: 60, description: 'Alternating forward lunges', formCues: 'Long stride, front knee over ankle, tall chest', muscleGroups: ['quads', 'glutes'] },
      { id: 'e19', name: 'Calf Raises', sets: 3, reps: 20, rest: 45, description: 'Standing calf raises', formCues: 'Full range, pause at top', muscleGroups: ['calves'] },
      { id: 'e20', name: 'Hip Thrust', sets: 3, reps: 15, rest: 60, description: 'Barbell or bodyweight hip thrust', formCues: 'Shoulders on bench, drive through heels, squeeze glutes', muscleGroups: ['glutes', 'hamstrings'] },
    ]
  },
  {
    id: 'w5', name: 'Fasted Morning Cardio #1', phase: 1, week: 1, type: 'cardio', difficulty: 1,
    estimatedCalories: 250, duration: 30, description: 'Steady-state fasted cardio for max fat burn.',
    tags: ['Cardio', 'Fasted', 'Fat Burn'],
    exercises: [
      { id: 'e21', name: 'Incline Treadmill Walk', duration: 1800, sets: 1, rest: 0, description: '30 min at 3.5-4 mph, 10-15% incline', formCues: 'Don\'t hold the rails! Pump arms, full stride', muscleGroups: ['glutes', 'hamstrings', 'cardio'] },
    ]
  },
  {
    id: 'w6', name: 'Core Crusher #1', phase: 1, week: 2, type: 'core', difficulty: 2,
    estimatedCalories: 180, duration: 20, description: 'Full core circuit — upper, lower, obliques.',
    tags: ['Core', 'Abs', 'No Equipment'],
    exercises: [
      { id: 'e22', name: 'Crunch', sets: 3, reps: 20, rest: 30, description: 'Classic crunch', formCues: 'Lower back stays down, don\'t pull neck, exhale up', muscleGroups: ['upper abs'] },
      { id: 'e23', name: 'Leg Raise', sets: 3, reps: 15, rest: 30, description: 'Lying leg raise', formCues: 'Control the descent, don\'t arch lower back', muscleGroups: ['lower abs'] },
      { id: 'e24', name: 'Russian Twist', sets: 3, reps: 20, rest: 30, description: 'Oblique twist with weight', formCues: 'Feet off ground, rotate from core not arms', muscleGroups: ['obliques'] },
      { id: 'e25', name: 'Bicycle Crunch', sets: 3, reps: 30, rest: 30, description: 'Alternating elbow to knee', formCues: 'Full rotation, don\'t rush, controlled pace', muscleGroups: ['obliques', 'upper abs'] },
      { id: 'e26', name: 'Dead Bug', sets: 3, reps: 10, rest: 30, description: 'Opposite arm/leg extension', formCues: 'Lower back FLAT on floor, exhale as you extend', muscleGroups: ['core', 'stability'] },
      { id: 'e27', name: 'Plank to Failure', duration: 0, sets: 1, rest: 0, description: 'Hold until you break', formCues: 'Max effort, don\'t let form collapse', muscleGroups: ['core', 'shoulders'] },
    ]
  },

  // ===== PHASE 2: INTENSIFICATION (Weeks 5-8) =====
  {
    id: 'w7', name: 'HIIT Cardio Blast #2', phase: 2, week: 5, type: 'hiit', difficulty: 4,
    estimatedCalories: 480, duration: 30, description: 'Tabata-style intervals. This will break you.',
    tags: ['HIIT', 'Cardio', 'Tabata', 'Fat Burn'],
    exercises: [
      { id: 'e28', name: 'Sprint Intervals', duration: 20, sets: 8, rest: 10, description: '20s all-out sprint, 10s rest x8', formCues: 'TRUE max effort on sprints, full recovery during rest', muscleGroups: ['full body', 'cardio'] },
      { id: 'e29', name: 'Box Jumps', sets: 4, reps: 10, rest: 30, description: 'Jump onto box/platform', formCues: 'Land soft with bent knees, step down controlled', muscleGroups: ['quads', 'glutes', 'power'] },
      { id: 'e30', name: 'Kettlebell Swing', sets: 4, reps: 20, rest: 30, description: 'Two-hand KB swing', formCues: 'Hip hinge power, not a squat, shoulders stay packed', muscleGroups: ['glutes', 'hamstrings', 'core'] },
      { id: 'e31', name: 'Burpee to Pull-Up', sets: 3, reps: 8, rest: 45, description: 'Burpee then pull-up', formCues: 'Explosive transition, full pull-up at top', muscleGroups: ['full body'] },
      { id: 'e32', name: 'Battle Ropes', duration: 30, sets: 5, rest: 30, description: '30s alternating wave', formCues: 'Stay low in athletic stance, full arm extension', muscleGroups: ['shoulders', 'core', 'cardio'] },
    ]
  },
  {
    id: 'w8', name: 'Push Day (Advanced)', phase: 2, week: 6, type: 'strength', difficulty: 4,
    estimatedCalories: 350, duration: 55, description: 'Chest, shoulders, triceps — heavy.',
    tags: ['Push', 'Upper Body', 'Strength', 'Advanced'],
    exercises: [
      { id: 'e33', name: 'Barbell Bench Press', sets: 5, reps: 5, rest: 120, description: 'Heavy compound press', formCues: 'Arch back, retract scapula, bar touches lower chest', muscleGroups: ['chest', 'shoulders', 'triceps'] },
      { id: 'e34', name: 'Incline Dumbbell Press', sets: 4, reps: 10, rest: 90, description: '30-45° incline press', formCues: 'Control the descent, slight arc inward at top', muscleGroups: ['upper chest', 'shoulders'] },
      { id: 'e35', name: 'Arnold Press', sets: 3, reps: 12, rest: 75, description: 'Rotating shoulder press', formCues: 'Full rotation on the way up and down', muscleGroups: ['all shoulder heads'] },
      { id: 'e36', name: 'Weighted Dips', sets: 3, reps: 10, rest: 90, description: 'Parallel bar dips', formCues: 'Slight forward lean for chest, vertical for triceps', muscleGroups: ['chest', 'triceps', 'shoulders'] },
      { id: 'e37', name: 'Cable Crossover', sets: 3, reps: 15, rest: 60, description: 'Cable fly for chest', formCues: 'Keep slight elbow bend, squeeze at center', muscleGroups: ['chest'] },
    ]
  },
  {
    id: 'w9', name: 'Pull Day (Advanced)', phase: 2, week: 6, type: 'strength', difficulty: 4,
    estimatedCalories: 340, duration: 55, description: 'Back, biceps — build that V-taper.',
    tags: ['Pull', 'Upper Body', 'Strength', 'Advanced'],
    exercises: [
      { id: 'e38', name: 'Weighted Pull-Up', sets: 5, reps: 6, rest: 120, description: 'Add weight belt if needed', formCues: 'Dead hang start, chest to bar, controlled eccentric', muscleGroups: ['lats', 'biceps'] },
      { id: 'e39', name: 'Barbell Row', sets: 4, reps: 8, rest: 90, description: 'Bent-over barbell row', formCues: 'Hip hinge, bar to belly button, elbows past torso', muscleGroups: ['back', 'biceps'] },
      { id: 'e40', name: 'Lat Pulldown', sets: 3, reps: 12, rest: 75, description: 'Wide grip lat pulldown', formCues: 'Lean back slightly, pull to upper chest, full stretch', muscleGroups: ['lats', 'teres major'] },
      { id: 'e41', name: 'Face Pull', sets: 3, reps: 20, rest: 45, description: 'Cable face pull', formCues: 'Pull to forehead, elbows high, external rotation', muscleGroups: ['rear delts', 'rotator cuff'] },
      { id: 'e42', name: 'Barbell Curl', sets: 3, reps: 12, rest: 60, description: 'Bicep curl', formCues: 'Elbows pinned, full extension at bottom', muscleGroups: ['biceps'] },
    ]
  },
  {
    id: 'w10', name: 'Leg Day (Advanced)', phase: 2, week: 6, type: 'strength', difficulty: 5,
    estimatedCalories: 420, duration: 60, description: 'Heavy leg day. Bring a bucket.',
    tags: ['Legs', 'Lower Body', 'Strength', 'Advanced'],
    exercises: [
      { id: 'e43', name: 'Barbell Back Squat', sets: 5, reps: 5, rest: 180, description: 'Back squat, competition depth', formCues: 'Brace hard, knees out, break parallel', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
      { id: 'e44', name: 'Romanian Deadlift', sets: 4, reps: 10, rest: 90, description: 'Barbell RDL', formCues: 'Soft knees, push hips back, feel hamstring stretch', muscleGroups: ['hamstrings', 'glutes'] },
      { id: 'e45', name: 'Leg Press', sets: 4, reps: 15, rest: 90, description: 'Machine leg press', formCues: 'Feet shoulder width, don\'t lock knees at top', muscleGroups: ['quads', 'glutes'] },
      { id: 'e46', name: 'Bulgarian Split Squat', sets: 3, reps: 10, rest: 90, description: 'Rear foot elevated split squat', formCues: 'Upright torso, front knee tracks over toe', muscleGroups: ['quads', 'glutes'] },
      { id: 'e47', name: 'Leg Curl', sets: 3, reps: 15, rest: 60, description: 'Machine hamstring curl', formCues: 'Full extension, controlled curl, squeeze at top', muscleGroups: ['hamstrings'] },
    ]
  },
  {
    id: 'w11', name: 'HIIT Metabolic Circuit', phase: 2, week: 7, type: 'hiit', difficulty: 4,
    estimatedCalories: 450, duration: 35, description: 'No equipment metabolic burner.',
    tags: ['HIIT', 'Bodyweight', 'No Equipment', 'Fat Burn'],
    exercises: [
      { id: 'e48', name: 'Squat Jumps', sets: 5, reps: 15, rest: 30, description: 'Explosive jump squat', formCues: 'Squat deep, explode up, land soft and absorb', muscleGroups: ['quads', 'glutes', 'cardio'] },
      { id: 'e49', name: 'Plyometric Push-Up', sets: 4, reps: 10, rest: 45, description: 'Explosive push-up with clap', formCues: 'Explosive push to lift hands off ground', muscleGroups: ['chest', 'triceps', 'power'] },
      { id: 'e50', name: 'Skater Jumps', sets: 4, reps: 20, rest: 30, description: 'Lateral skating motion', formCues: 'One leg landing, soft knee, reach opposite hand to foot', muscleGroups: ['glutes', 'quads', 'cardio'] },
      { id: 'e51', name: 'V-Ups', sets: 3, reps: 15, rest: 30, description: 'Full sit-up with leg raise', formCues: 'Touch toes at top, control on the way down', muscleGroups: ['core', 'hip flexors'] },
      { id: 'e52', name: 'Tuck Jumps', sets: 3, reps: 12, rest: 45, description: 'Jump and tuck knees to chest', formCues: 'Full extension at top, land on toes', muscleGroups: ['legs', 'cardio'] },
    ]
  },
  {
    id: 'w12', name: 'Core Destroyer #2', phase: 2, week: 7, type: 'core', difficulty: 3,
    estimatedCalories: 220, duration: 25, description: 'Advanced core circuit for a steel midsection.',
    tags: ['Core', 'Abs', 'Advanced'],
    exercises: [
      { id: 'e53', name: 'Hanging Leg Raise', sets: 4, reps: 12, rest: 45, description: 'Bar hang, raise legs to parallel', formCues: 'Don\'t swing, slow controlled raise, exhale up', muscleGroups: ['lower abs', 'hip flexors'] },
      { id: 'e54', name: 'Ab Wheel Rollout', sets: 3, reps: 10, rest: 60, description: 'Kneeling rollout', formCues: 'Keep core braced, don\'t let lower back arch', muscleGroups: ['core', 'lats'] },
      { id: 'e55', name: 'Dragon Flag', sets: 3, reps: 6, rest: 60, description: 'Lying body lever', formCues: 'Keep body rigid, lower slowly, don\'t touch ground', muscleGroups: ['core', 'lats'] },
      { id: 'e56', name: 'Cable Crunch', sets: 3, reps: 20, rest: 45, description: 'Kneeling cable crunch', formCues: 'Crunch from ribs to hips, not pulling with arms', muscleGroups: ['upper abs'] },
      { id: 'e57', name: 'Pallof Press', sets: 3, reps: 12, rest: 45, description: 'Anti-rotation core press', formCues: 'Resist rotation, press straight out and return', muscleGroups: ['obliques', 'core stability'] },
    ]
  },

  // ===== PHASE 3: MAXIMUM AGGRESSION (Weeks 9-12) =====
  {
    id: 'w13', name: 'AM Fasted Cardio Blitz', phase: 3, week: 9, type: 'cardio', difficulty: 3,
    estimatedCalories: 400, duration: 45, description: 'Morning empty-stomach cardio. Burn pure fat.',
    tags: ['Cardio', 'Fasted', 'Fat Burn', 'Morning'],
    exercises: [
      { id: 'e58', name: 'Incline Treadmill Intervals', duration: 2700, sets: 1, rest: 0, description: '45 min alternating 5% and 15% incline every 5 min', formCues: 'NO handrails, pump arms, work up a real sweat', muscleGroups: ['full body', 'cardio'] },
    ]
  },
  {
    id: 'w14', name: 'PM Strength Destroyer', phase: 3, week: 9, type: 'strength', difficulty: 5,
    estimatedCalories: 480, duration: 70, description: 'Evening two-a-day strength session. Max effort.',
    tags: ['Strength', 'Advanced', 'Two-A-Day'],
    exercises: [
      { id: 'e59', name: 'Deadlift', sets: 5, reps: 3, rest: 180, description: 'Conventional barbell deadlift', formCues: 'Bar over mid-foot, hips down, drive floor away, lock out hips and knees together', muscleGroups: ['hamstrings', 'glutes', 'back', 'traps'] },
      { id: 'e60', name: 'Front Squat', sets: 4, reps: 6, rest: 120, description: 'Barbell front squat', formCues: 'High elbows, upright torso, knees out', muscleGroups: ['quads', 'core', 'upper back'] },
      { id: 'e61', name: 'Push Press', sets: 4, reps: 6, rest: 90, description: 'Drive from legs into press', formCues: 'Dip and drive, punch the ceiling, don\'t lean back excessively', muscleGroups: ['shoulders', 'triceps', 'legs'] },
      { id: 'e62', name: 'Weighted Pull-Up', sets: 4, reps: 8, rest: 90, description: 'Max weighted pull-up', formCues: 'Dead hang, chest to bar, scapular retraction', muscleGroups: ['lats', 'biceps', 'core'] },
      { id: 'e63', name: 'Farmer\'s Walk', duration: 40, sets: 4, rest: 60, description: '40m heavy carry', formCues: 'Shoulders packed, tall posture, march with purpose', muscleGroups: ['traps', 'grip', 'core', 'legs'] },
    ]
  },
  {
    id: 'w15', name: 'HIIT Hell #3 (Peak)', phase: 3, week: 10, type: 'hiit', difficulty: 5,
    estimatedCalories: 600, duration: 40, description: 'The hardest HIIT session. You wanted aggressive.',
    tags: ['HIIT', 'Advanced', 'Extreme', 'Fat Burn'],
    exercises: [
      { id: 'e64', name: 'Assault Bike Sprint', duration: 30, sets: 10, rest: 30, description: '30s all-out, 30s easy x10', formCues: 'Use arms and legs, every sprint is a personal record attempt', muscleGroups: ['full body', 'cardio'] },
      { id: 'e65', name: 'Thruster (Barbell)', sets: 5, reps: 8, rest: 60, description: 'Front squat to push press', formCues: 'One fluid movement, no pause at the top of squat', muscleGroups: ['quads', 'shoulders', 'full body'] },
      { id: 'e66', name: 'Rope Climb', sets: 5, reps: 3, rest: 90, description: '3 climbs per set', formCues: 'Use legs, J-hook technique, controlled descent', muscleGroups: ['lats', 'biceps', 'grip', 'core'] },
      { id: 'e67', name: 'Sprint + Burpee Complex', sets: 6, reps: 10, rest: 60, description: '100m sprint then 10 burpees', formCues: 'Max effort sprint, immediate burpees, no rest between sprint and burpees', muscleGroups: ['full body', 'cardio'] },
    ]
  },
  {
    id: 'w16', name: 'Bodyweight Only — Travel Edition', phase: 1, week: 1, type: 'bodyweight', difficulty: 2,
    estimatedCalories: 250, duration: 30, description: 'Zero equipment needed. No excuses.',
    tags: ['Bodyweight', 'No Equipment', 'Travel', 'Home'],
    exercises: [
      { id: 'e68', name: 'Push-Up Variations', sets: 4, reps: 15, rest: 45, description: 'Wide, normal, diamond rotation', formCues: 'Change grip each set, maintain straight body', muscleGroups: ['chest', 'triceps', 'shoulders'] },
      { id: 'e69', name: 'Pistol Squat Progression', sets: 3, reps: 8, rest: 60, description: 'Work toward single-leg squat', formCues: 'Use support if needed, keep heel on ground', muscleGroups: ['quads', 'glutes', 'balance'] },
      { id: 'e70', name: 'Inverted Row (Table/Bar)', sets: 3, reps: 12, rest: 60, description: 'Row using table edge or bar', formCues: 'Body straight, pull chest to bar, squeeze back', muscleGroups: ['back', 'biceps'] },
      { id: 'e71', name: 'Handstand Push-Up (Wall-Assisted)', sets: 3, reps: 6, rest: 75, description: 'Wall handstand press', formCues: 'Core tight, lower head toward ground, press back up', muscleGroups: ['shoulders', 'triceps', 'core'] },
      { id: 'e72', name: 'Superman Hold', sets: 3, duration: 30, rest: 30, description: 'Prone back extension hold', formCues: 'Lift arms, chest and legs simultaneously', muscleGroups: ['lower back', 'glutes'] },
    ]
  },
  {
    id: 'w17', name: '10K Step Challenge Walk', phase: 1, week: 1, type: 'cardio', difficulty: 1,
    estimatedCalories: 350, duration: 90, description: 'Get your 10,000 steps. Every single day.',
    tags: ['Walking', 'Cardio', 'Low Impact', 'Fat Burn'],
    exercises: [
      { id: 'e73', name: 'Brisk Walk', duration: 5400, sets: 1, rest: 0, description: '90-min brisk walk at 3.5+ mph', formCues: 'Swing arms, maintain good posture, use inclines when possible', muscleGroups: ['legs', 'cardio'] },
    ]
  },
  {
    id: 'w18', name: 'Upper/Lower Split — Upper', phase: 2, week: 5, type: 'strength', difficulty: 3,
    estimatedCalories: 300, duration: 45, description: 'Balanced upper body push/pull.',
    tags: ['Upper Body', 'Push/Pull', 'Strength'],
    exercises: [
      { id: 'e74', name: 'Incline Press', sets: 4, reps: 10, rest: 75, description: 'Dumbbell or barbell', formCues: 'Drive elbows together at top, controlled lowering', muscleGroups: ['upper chest', 'shoulders'] },
      { id: 'e75', name: 'T-Bar Row', sets: 4, reps: 10, rest: 75, description: 'Landmine row variation', formCues: 'Chest on pad, pull to lower chest, elbows back', muscleGroups: ['mid back', 'biceps'] },
      { id: 'e76', name: 'Cable Lateral Raise', sets: 3, reps: 15, rest: 45, description: 'Single arm cable raise', formCues: 'Lean slightly away, raise arm to shoulder height', muscleGroups: ['lateral deltoid'] },
      { id: 'e77', name: 'Hammer Curl', sets: 3, reps: 12, rest: 45, description: 'Neutral grip curl', formCues: 'Neutral thumb-up grip, controlled movement', muscleGroups: ['biceps', 'brachioradialis'] },
      { id: 'e78', name: 'Skull Crusher', sets: 3, reps: 12, rest: 60, description: 'Lying tricep extension', formCues: 'Elbows point to ceiling, lower bar to forehead, extend', muscleGroups: ['triceps'] },
    ]
  },
  {
    id: 'w19', name: 'Finisher: 100 Rep Burnout', phase: 2, week: 5, type: 'finisher', difficulty: 4,
    estimatedCalories: 200, duration: 10, description: '5-min burnout to finish any session.',
    tags: ['Finisher', 'Quick', 'Burnout'],
    exercises: [
      { id: 'e79', name: '100 Burpees for Time', reps: 100, sets: 1, rest: 0, description: 'Do 100 burpees as fast as possible', formCues: 'Don\'t break into sets — push through the pain, track your time', muscleGroups: ['full body'] },
    ]
  },
  {
    id: 'w20', name: 'Finisher: 300 Rep Challenge', phase: 3, week: 10, type: 'finisher', difficulty: 5,
    estimatedCalories: 280, duration: 15, description: '300 reps. 6 exercises. No mercy.',
    tags: ['Finisher', 'Advanced', 'Extreme'],
    exercises: [
      { id: 'e80', name: '25 Pull-Ups', reps: 25, sets: 1, rest: 0, description: 'As few sets as possible', formCues: 'Full range, dead hang to chin over bar', muscleGroups: ['back', 'biceps'] },
      { id: 'e81', name: '50 Deadlifts (135/65 lbs)', reps: 50, sets: 1, rest: 0, description: 'Straight sets', formCues: 'Maintain form even fatigued', muscleGroups: ['full body'] },
      { id: 'e82', name: '50 Push-Ups', reps: 50, sets: 1, rest: 0, description: 'No knee push-ups', formCues: 'Chest touches floor each rep', muscleGroups: ['chest', 'triceps'] },
      { id: 'e83', name: '50 Box Jumps', reps: 50, sets: 1, rest: 0, description: '24/20 inch box', formCues: 'Land soft, stand fully before next rep', muscleGroups: ['legs', 'power'] },
      { id: 'e84', name: '50 Floor Wipers', reps: 50, sets: 1, rest: 0, description: 'Lying leg circle', formCues: 'Keep lower back down, controlled movement', muscleGroups: ['core', 'hip flexors'] },
      { id: 'e85', name: '25 + 10 lbs Clean & Press', reps: 25, sets: 1, rest: 0, description: 'Clean barbell from floor to press', formCues: 'Explosive clean, press to full lockout', muscleGroups: ['full body', 'shoulders'] },
    ]
  },
];

export const EXERCISE_LIBRARY = [
  { id: 'ex1', name: 'Squat', category: 'Legs', difficulty: 2, muscleGroups: ['quads', 'glutes', 'hamstrings'], description: 'The king of all exercises. Develops total lower body strength and mass.', formCues: 'Feet shoulder-width, toes slightly out, sit between heels, keep chest up, drive knees out, break parallel' },
  { id: 'ex2', name: 'Deadlift', category: 'Back/Legs', difficulty: 3, muscleGroups: ['hamstrings', 'glutes', 'back', 'traps'], description: 'The ultimate full-body strength movement. Pick heavy things up.', formCues: 'Bar over mid-foot, hips above knees, shoulders over bar, big breath, drive floor away, hips and shoulders rise together' },
  { id: 'ex3', name: 'Bench Press', category: 'Chest', difficulty: 2, muscleGroups: ['chest', 'shoulders', 'triceps'], description: 'The premier upper body push exercise.', formCues: 'Plant feet, arch natural, retract scapula, bar touches lower chest, elbows ~45° from torso' },
  { id: 'ex4', name: 'Pull-Up', category: 'Back', difficulty: 3, muscleGroups: ['lats', 'biceps', 'core'], description: 'Best back exercise. Period.', formCues: 'Dead hang, retract shoulders, pull chest to bar, control the descent' },
  { id: 'ex5', name: 'Overhead Press', category: 'Shoulders', difficulty: 2, muscleGroups: ['shoulders', 'triceps', 'core'], description: 'Standing press builds functional overhead strength.', formCues: 'Bar on front delts, brace core, press straight up, shrug at top, don\'t lean back' },
  { id: 'ex6', name: 'Dip', category: 'Chest/Triceps', difficulty: 2, muscleGroups: ['chest', 'triceps', 'shoulders'], description: 'Upper body pushing movement on parallel bars.', formCues: 'Forward lean for chest, vertical for triceps, full range below parallel' },
  { id: 'ex7', name: 'Barbell Row', category: 'Back', difficulty: 2, muscleGroups: ['mid back', 'biceps', 'rear delts'], description: 'Heavy horizontal pull for back thickness.', formCues: '45° torso angle, bar to belly button, elbows past body at top, controlled eccentric' },
  { id: 'ex8', name: 'Lunge', category: 'Legs', difficulty: 1, muscleGroups: ['quads', 'glutes', 'hamstrings'], description: 'Unilateral leg exercise for balance and strength.', formCues: 'Long stride, front knee over ankle, back knee close to ground, drive off front heel' },
  { id: 'ex9', name: 'Plank', category: 'Core', difficulty: 1, muscleGroups: ['core', 'shoulders', 'glutes'], description: 'Anti-extension core stability exercise.', formCues: 'Elbows under shoulders, straight body line, brace core like a punch is coming, squeeze glutes' },
  { id: 'ex10', name: 'Romanian Deadlift', category: 'Legs', difficulty: 2, muscleGroups: ['hamstrings', 'glutes', 'lower back'], description: 'Hip hinge for posterior chain development.', formCues: 'Soft knee bend, push hips back as far as possible, bar drags down legs, feel the hamstring stretch' },
];
