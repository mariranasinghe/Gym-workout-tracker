import { Exercise } from "@/types";

export const exercises: Exercise[] = [
  // CHEST
  { id: "bench-press", name: "Barbell Bench Press", muscleGroup: "chest", secondaryMuscles: ["shoulders", "triceps"], equipment: "barbell", instructions: ["Lie flat on a bench with feet firmly on the floor", "Grip the bar slightly wider than shoulder-width", "Unrack and lower the bar to mid-chest", "Press up until arms are fully extended"], tips: ["Keep your shoulder blades pinched together", "Maintain a slight arch in your lower back"] },
  { id: "incline-bench-press", name: "Incline Bench Press", muscleGroup: "chest", secondaryMuscles: ["shoulders", "triceps"], equipment: "barbell", instructions: ["Set bench to 30-45 degree angle", "Grip bar slightly wider than shoulders", "Lower to upper chest", "Press up to full extension"] },
  { id: "dumbbell-bench-press", name: "Dumbbell Bench Press", muscleGroup: "chest", secondaryMuscles: ["shoulders", "triceps"], equipment: "dumbbell", instructions: ["Lie on bench with dumbbells at chest level", "Press up until arms are extended", "Lower with control to chest level", "Keep elbows at 45-degree angle"] },
  { id: "dumbbell-flyes", name: "Dumbbell Flyes", muscleGroup: "chest", equipment: "dumbbell", instructions: ["Lie on bench with arms extended above chest", "Lower dumbbells in an arc motion", "Feel the stretch in your chest", "Bring back up squeezing chest"] },
  { id: "cable-crossover", name: "Cable Crossover", muscleGroup: "chest", equipment: "cable", instructions: ["Stand between cable stations", "Grab handles with arms out wide", "Bring hands together in front of chest", "Squeeze and slowly return"] },
  { id: "push-ups", name: "Push-Ups", muscleGroup: "chest", secondaryMuscles: ["shoulders", "triceps", "core"], equipment: "bodyweight", instructions: ["Start in plank position", "Lower body until chest nearly touches floor", "Push back up to starting position", "Keep core tight throughout"] },
  { id: "chest-dips", name: "Chest Dips", muscleGroup: "chest", secondaryMuscles: ["triceps", "shoulders"], equipment: "bodyweight", instructions: ["Grip parallel bars and lift yourself", "Lean forward slightly", "Lower until shoulders are below elbows", "Push back up to starting position"] },

  // BACK
  { id: "deadlift", name: "Deadlift", muscleGroup: "back", secondaryMuscles: ["legs", "glutes", "core"], equipment: "barbell", instructions: ["Stand with feet hip-width apart", "Grip bar just outside legs", "Keep back straight and chest up", "Drive through heels to stand"], tips: ["Keep bar close to body", "Engage lats before lifting"] },
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "back", secondaryMuscles: ["biceps"], equipment: "barbell", instructions: ["Bend at hips with slight knee bend", "Grip bar shoulder-width apart", "Pull bar to lower chest", "Lower with control"] },
  { id: "pull-ups", name: "Pull-Ups", muscleGroup: "back", secondaryMuscles: ["biceps"], equipment: "bodyweight", instructions: ["Hang from bar with overhand grip", "Pull yourself up until chin clears bar", "Lower with control", "Full arm extension at bottom"] },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "back", secondaryMuscles: ["biceps"], equipment: "cable", instructions: ["Sit at pulldown machine", "Grip bar wider than shoulders", "Pull bar to upper chest", "Control the weight back up"] },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "back", secondaryMuscles: ["biceps"], equipment: "cable", instructions: ["Sit with feet on platform", "Grip handle with arms extended", "Pull to midsection squeezing back", "Return with control"] },
  { id: "dumbbell-row", name: "Single Arm Dumbbell Row", muscleGroup: "back", secondaryMuscles: ["biceps"], equipment: "dumbbell", instructions: ["Place knee and hand on bench", "Hold dumbbell in opposite hand", "Pull to hip keeping elbow close", "Lower with control"] },
  { id: "t-bar-row", name: "T-Bar Row", muscleGroup: "back", secondaryMuscles: ["biceps"], equipment: "barbell", instructions: ["Straddle the T-bar or landmine", "Bend at hips with chest up", "Pull handle to chest", "Lower with control"] },

  // SHOULDERS
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "shoulders", secondaryMuscles: ["triceps"], equipment: "barbell", instructions: ["Hold bar at shoulder height", "Press straight overhead", "Lock out at the top", "Lower with control"] },
  { id: "dumbbell-shoulder-press", name: "Dumbbell Shoulder Press", muscleGroup: "shoulders", secondaryMuscles: ["triceps"], equipment: "dumbbell", instructions: ["Sit with back supported", "Hold dumbbells at shoulder height", "Press overhead until arms extended", "Lower to starting position"] },
  { id: "lateral-raises", name: "Lateral Raises", muscleGroup: "shoulders", equipment: "dumbbell", instructions: ["Stand with dumbbells at sides", "Raise arms to shoulder height", "Keep slight bend in elbows", "Lower with control"] },
  { id: "front-raises", name: "Front Raises", muscleGroup: "shoulders", equipment: "dumbbell", instructions: ["Stand with dumbbells in front of thighs", "Raise one arm to shoulder height", "Lower and alternate", "Keep core engaged"] },
  { id: "rear-delt-fly", name: "Rear Delt Fly", muscleGroup: "shoulders", secondaryMuscles: ["back"], equipment: "dumbbell", instructions: ["Bend at hips with flat back", "Let dumbbells hang below", "Raise arms out to sides", "Squeeze shoulder blades"] },
  { id: "face-pulls", name: "Face Pulls", muscleGroup: "shoulders", secondaryMuscles: ["back"], equipment: "cable", instructions: ["Set cable at face height", "Pull rope to face level", "Separate hands at end of movement", "Control the return"] },

  // BICEPS
  { id: "barbell-curl", name: "Barbell Curl", muscleGroup: "biceps", equipment: "barbell", instructions: ["Stand with barbell at hip level", "Curl bar up to shoulders", "Keep elbows at sides", "Lower with control"] },
  { id: "dumbbell-curl", name: "Dumbbell Curl", muscleGroup: "biceps", equipment: "dumbbell", instructions: ["Stand with dumbbells at sides", "Curl up rotating palms up", "Squeeze at the top", "Lower with control"] },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "biceps", secondaryMuscles: ["forearms"], equipment: "dumbbell", instructions: ["Hold dumbbells with neutral grip", "Curl up keeping palms facing in", "Squeeze at the top", "Lower with control"] },
  { id: "preacher-curl", name: "Preacher Curl", muscleGroup: "biceps", equipment: "barbell", instructions: ["Sit at preacher bench", "Rest arms on pad", "Curl bar up squeezing biceps", "Lower to full extension"] },
  { id: "cable-curl", name: "Cable Curl", muscleGroup: "biceps", equipment: "cable", instructions: ["Stand facing cable machine", "Grip bar with underhand grip", "Curl up keeping elbows fixed", "Lower with control"] },

  // TRICEPS
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "triceps", equipment: "cable", instructions: ["Stand at cable machine", "Grip bar with overhand grip", "Push down until arms straight", "Control the return"] },
  { id: "skull-crushers", name: "Skull Crushers", muscleGroup: "triceps", equipment: "barbell", instructions: ["Lie on bench holding bar overhead", "Lower bar to forehead by bending elbows", "Extend arms back up", "Keep upper arms stationary"] },
  { id: "tricep-dips", name: "Tricep Dips", muscleGroup: "triceps", secondaryMuscles: ["chest", "shoulders"], equipment: "bodyweight", instructions: ["Grip parallel bars with body upright", "Lower until elbows at 90 degrees", "Push back up to starting position", "Keep body vertical"] },
  { id: "overhead-tricep-extension", name: "Overhead Tricep Extension", muscleGroup: "triceps", equipment: "dumbbell", instructions: ["Hold dumbbell overhead with both hands", "Lower behind head by bending elbows", "Extend arms back up", "Keep upper arms close to ears"] },
  { id: "close-grip-bench", name: "Close Grip Bench Press", muscleGroup: "triceps", secondaryMuscles: ["chest", "shoulders"], equipment: "barbell", instructions: ["Lie on bench with narrow grip", "Lower bar to lower chest", "Press up keeping elbows tucked", "Focus on tricep contraction"] },

  // LEGS
  { id: "squat", name: "Barbell Squat", muscleGroup: "legs", secondaryMuscles: ["glutes", "core"], equipment: "barbell", instructions: ["Position bar on upper back", "Feet shoulder-width apart", "Squat down until thighs parallel", "Drive up through heels"], tips: ["Keep chest up", "Push knees out over toes"] },
  { id: "front-squat", name: "Front Squat", muscleGroup: "legs", secondaryMuscles: ["glutes", "core"], equipment: "barbell", instructions: ["Rest bar on front delts", "Keep elbows high", "Squat down staying upright", "Drive up through heels"] },
  { id: "leg-press", name: "Leg Press", muscleGroup: "legs", secondaryMuscles: ["glutes"], equipment: "machine", instructions: ["Sit in leg press machine", "Place feet shoulder-width on platform", "Lower weight with control", "Press back up without locking knees"] },
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "legs", secondaryMuscles: ["glutes", "back"], equipment: "barbell", instructions: ["Hold bar at hip level", "Hinge at hips pushing them back", "Lower bar along legs", "Return by driving hips forward"] },
  { id: "lunges", name: "Walking Lunges", muscleGroup: "legs", secondaryMuscles: ["glutes"], equipment: "dumbbell", instructions: ["Hold dumbbells at sides", "Step forward into lunge", "Lower until back knee nearly touches floor", "Step through to next lunge"] },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "legs", equipment: "machine", instructions: ["Lie face down on leg curl machine", "Position pad above ankles", "Curl weight up toward glutes", "Lower with control"] },
  { id: "leg-extension", name: "Leg Extension", muscleGroup: "legs", equipment: "machine", instructions: ["Sit in leg extension machine", "Position pad above ankles", "Extend legs fully", "Lower with control"] },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscleGroup: "legs", secondaryMuscles: ["glutes"], equipment: "dumbbell", instructions: ["Place rear foot on bench", "Hold dumbbells at sides", "Lower until back knee near floor", "Drive up through front heel"] },
  { id: "calf-raises", name: "Standing Calf Raises", muscleGroup: "calves", equipment: "machine", instructions: ["Stand on calf raise machine", "Lower heels below platform", "Raise up onto toes", "Squeeze at top and lower slowly"] },

  // GLUTES
  { id: "hip-thrust", name: "Hip Thrust", muscleGroup: "glutes", secondaryMuscles: ["legs"], equipment: "barbell", instructions: ["Sit with upper back against bench", "Position barbell over hips", "Drive hips up squeezing glutes", "Lower with control"] },
  { id: "glute-bridge", name: "Glute Bridge", muscleGroup: "glutes", equipment: "bodyweight", instructions: ["Lie on back with knees bent", "Drive hips up squeezing glutes", "Hold at top briefly", "Lower with control"] },
  { id: "cable-kickback", name: "Cable Kickback", muscleGroup: "glutes", equipment: "cable", instructions: ["Attach ankle strap to cable", "Face machine and brace yourself", "Kick leg back keeping it straight", "Squeeze glute at top"] },

  // CORE
  { id: "plank", name: "Plank", muscleGroup: "core", equipment: "bodyweight", instructions: ["Start in forearm plank position", "Keep body in straight line", "Engage core and hold", "Breathe steadily"] },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscleGroup: "core", equipment: "bodyweight", instructions: ["Hang from pull-up bar", "Raise legs until parallel to floor", "Lower with control", "Avoid swinging"] },
  { id: "cable-crunch", name: "Cable Crunch", muscleGroup: "core", equipment: "cable", instructions: ["Kneel facing cable machine", "Hold rope behind head", "Crunch down bringing elbows to knees", "Return with control"] },
  { id: "russian-twist", name: "Russian Twist", muscleGroup: "core", equipment: "bodyweight", instructions: ["Sit with knees bent, feet off floor", "Lean back slightly", "Rotate torso side to side", "Keep core engaged throughout"] },
  { id: "ab-wheel-rollout", name: "Ab Wheel Rollout", muscleGroup: "core", equipment: "other", instructions: ["Kneel holding ab wheel", "Roll forward extending body", "Keep core tight throughout", "Roll back to starting position"] },
  { id: "dead-bug", name: "Dead Bug", muscleGroup: "core", equipment: "bodyweight", instructions: ["Lie on back with arms up and knees bent 90°", "Lower opposite arm and leg", "Keep lower back pressed to floor", "Return and alternate sides"] },
];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
  if (muscleGroup === "all") return exercises;
  return exercises.filter(
    (e) =>
      e.muscleGroup === muscleGroup ||
      e.secondaryMuscles?.includes(muscleGroup as MuscleGroup)
  );
}

export const muscleGroups = [
  { id: "all", label: "All" },
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "shoulders", label: "Shoulders" },
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "legs", label: "Legs" },
  { id: "glutes", label: "Glutes" },
  { id: "core", label: "Core" },
  { id: "calves", label: "Calves" },
];

export const equipmentTypes = [
  { id: "all", label: "All" },
  { id: "barbell", label: "Barbell" },
  { id: "dumbbell", label: "Dumbbell" },
  { id: "cable", label: "Cable" },
  { id: "machine", label: "Machine" },
  { id: "bodyweight", label: "Bodyweight" },
  { id: "kettlebell", label: "Kettlebell" },
];

import { MuscleGroup } from "@/types";
