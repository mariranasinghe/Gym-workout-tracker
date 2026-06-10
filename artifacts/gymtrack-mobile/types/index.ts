export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "core"
  | "glutes"
  | "forearms"
  | "calves";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight"
  | "kettlebell"
  | "bands"
  | "other";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  instructions: string[];
  tips?: string[];
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  isWarmup?: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  exercises: WorkoutExercise[];
  notes?: string;
  duration?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: {
    exerciseId: string;
    targetSets: number;
    targetReps: string;
    notes?: string;
  }[];
  isCustom: boolean;
  category?: string;
  estimatedDuration?: number;
}

export interface PersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  date: string;
  workoutId: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalVolume: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: string;
  weeklyGoal: number;
  workoutsThisWeek: number;
}
