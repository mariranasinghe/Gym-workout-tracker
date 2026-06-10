import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { defaultTemplates } from "@/data/templates";
import {
  PersonalRecord,
  UserStats,
  Workout,
  WorkoutExercise,
  WorkoutSet,
  WorkoutTemplate,
} from "@/types";

const STORAGE_KEY = "gymtrack-data";

function genId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

interface AppState {
  workouts: Workout[];
  activeWorkout: Workout | null;
  templates: WorkoutTemplate[];
  personalRecords: PersonalRecord[];
  stats: UserStats;
}

type Action =
  | { type: "LOAD"; payload: AppState }
  | { type: "START_WORKOUT"; payload: { name: string } }
  | { type: "START_FROM_TEMPLATE"; payload: { templateId: string } }
  | { type: "ADD_EXERCISE"; payload: { exerciseId: string } }
  | { type: "REMOVE_EXERCISE"; payload: { workoutExerciseId: string } }
  | { type: "ADD_SET"; payload: { workoutExerciseId: string } }
  | {
      type: "UPDATE_SET";
      payload: {
        workoutExerciseId: string;
        setId: string;
        updates: Partial<WorkoutSet>;
      };
    }
  | { type: "REMOVE_SET"; payload: { workoutExerciseId: string; setId: string } }
  | { type: "END_WORKOUT" }
  | { type: "DISCARD_WORKOUT" }
  | { type: "DELETE_WORKOUT"; payload: { workoutId: string } }
  | { type: "ADD_TEMPLATE"; payload: WorkoutTemplate }
  | { type: "DELETE_TEMPLATE"; payload: { templateId: string } }
  | { type: "SET_WEEKLY_GOAL"; payload: { goal: number } };

const defaultStats: UserStats = {
  totalWorkouts: 0,
  totalVolume: 0,
  currentStreak: 0,
  longestStreak: 0,
  weeklyGoal: 4,
  workoutsThisWeek: 0,
};

function computeStats(workouts: Workout[], weeklyGoal: number): UserStats {
  if (workouts.length === 0) {
    return { ...defaultStats, weeklyGoal };
  }

  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let totalVolume = 0;
  for (const w of workouts) {
    for (const ex of w.exercises) {
      for (const s of ex.sets) {
        if (s.completed) totalVolume += s.weight * s.reps;
      }
    }
  }

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const workoutsThisWeek = workouts.filter(
    (w) => new Date(w.date) >= startOfWeek
  ).length;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 86400000;
  const workoutDays = new Set(
    workouts.map((w) => {
      const d = new Date(w.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  let check = today.getTime();
  if (!workoutDays.has(check)) check -= dayMs;
  while (workoutDays.has(check)) {
    streak++;
    check -= dayMs;
  }

  return {
    totalWorkouts: workouts.length,
    totalVolume,
    currentStreak: streak,
    longestStreak: streak,
    lastWorkoutDate: sorted[0]?.date,
    weeklyGoal,
    workoutsThisWeek,
  };
}

function updatePRs(
  prs: PersonalRecord[],
  workout: Workout
): PersonalRecord[] {
  const updated = [...prs];
  for (const ex of workout.exercises) {
    for (const s of ex.sets) {
      if (!s.completed || s.weight <= 0) continue;
      const existing = updated.find((r) => r.exerciseId === ex.exerciseId);
      const score = s.weight * s.reps;
      const existingScore = existing ? existing.weight * existing.reps : 0;
      if (!existing || score > existingScore) {
        const idx = updated.findIndex((r) => r.exerciseId === ex.exerciseId);
        const newPR: PersonalRecord = {
          exerciseId: ex.exerciseId,
          weight: s.weight,
          reps: s.reps,
          date: workout.date,
          workoutId: workout.id,
        };
        if (idx >= 0) updated[idx] = newPR;
        else updated.push(newPR);
      }
    }
  }
  return updated;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOAD":
      return action.payload;

    case "START_WORKOUT": {
      const now = new Date();
      const workout: Workout = {
        id: genId(),
        name: action.payload.name,
        date: now.toISOString().split("T")[0],
        startTime: now.toISOString(),
        exercises: [],
      };
      return { ...state, activeWorkout: workout };
    }

    case "START_FROM_TEMPLATE": {
      const template = state.templates.find(
        (t) => t.id === action.payload.templateId
      );
      if (!template) return state;
      const now = new Date();
      const exercises: WorkoutExercise[] = template.exercises.map((te) => ({
        id: genId(),
        exerciseId: te.exerciseId,
        sets: Array.from({ length: te.targetSets }, () => ({
          id: genId(),
          weight: 0,
          reps: parseInt(te.targetReps.split("-")[0]) || 0,
          completed: false,
        })),
      }));
      const workout: Workout = {
        id: genId(),
        name: template.name,
        date: now.toISOString().split("T")[0],
        startTime: now.toISOString(),
        exercises,
      };
      return { ...state, activeWorkout: workout };
    }

    case "ADD_EXERCISE": {
      if (!state.activeWorkout) return state;
      const newEx: WorkoutExercise = {
        id: genId(),
        exerciseId: action.payload.exerciseId,
        sets: [{ id: genId(), weight: 0, reps: 0, completed: false }],
      };
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: [...state.activeWorkout.exercises, newEx],
        },
      };
    }

    case "REMOVE_EXERCISE": {
      if (!state.activeWorkout) return state;
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.filter(
            (e) => e.id !== action.payload.workoutExerciseId
          ),
        },
      };
    }

    case "ADD_SET": {
      if (!state.activeWorkout) return state;
      const exercises = state.activeWorkout.exercises.map((ex) => {
        if (ex.id !== action.payload.workoutExerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: genId(),
              weight: lastSet?.weight ?? 0,
              reps: lastSet?.reps ?? 0,
              completed: false,
            },
          ],
        };
      });
      return {
        ...state,
        activeWorkout: { ...state.activeWorkout, exercises },
      };
    }

    case "UPDATE_SET": {
      if (!state.activeWorkout) return state;
      const exercises = state.activeWorkout.exercises.map((ex) => {
        if (ex.id !== action.payload.workoutExerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) =>
            s.id === action.payload.setId
              ? { ...s, ...action.payload.updates }
              : s
          ),
        };
      });
      return {
        ...state,
        activeWorkout: { ...state.activeWorkout, exercises },
      };
    }

    case "REMOVE_SET": {
      if (!state.activeWorkout) return state;
      const exercises = state.activeWorkout.exercises.map((ex) => {
        if (ex.id !== action.payload.workoutExerciseId) return ex;
        if (ex.sets.length <= 1) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((s) => s.id !== action.payload.setId),
        };
      });
      return {
        ...state,
        activeWorkout: { ...state.activeWorkout, exercises },
      };
    }

    case "END_WORKOUT": {
      if (!state.activeWorkout) return state;
      const endTime = new Date();
      const start = new Date(state.activeWorkout.startTime);
      const duration = Math.round(
        (endTime.getTime() - start.getTime()) / 60000
      );
      const finishedWorkout: Workout = {
        ...state.activeWorkout,
        endTime: endTime.toISOString(),
        duration,
      };
      const workouts = [finishedWorkout, ...state.workouts];
      const personalRecords = updatePRs(state.personalRecords, finishedWorkout);
      const stats = computeStats(workouts, state.stats.weeklyGoal);
      return { ...state, workouts, personalRecords, stats, activeWorkout: null };
    }

    case "DISCARD_WORKOUT":
      return { ...state, activeWorkout: null };

    case "DELETE_WORKOUT": {
      const workouts = state.workouts.filter(
        (w) => w.id !== action.payload.workoutId
      );
      const stats = computeStats(workouts, state.stats.weeklyGoal);
      return { ...state, workouts, stats };
    }

    case "ADD_TEMPLATE":
      return { ...state, templates: [...state.templates, action.payload] };

    case "DELETE_TEMPLATE":
      return {
        ...state,
        templates: state.templates.filter(
          (t) => t.id !== action.payload.templateId
        ),
      };

    case "SET_WEEKLY_GOAL": {
      const stats = { ...state.stats, weeklyGoal: action.payload.goal };
      return { ...state, stats };
    }

    default:
      return state;
  }
}

interface WorkoutContextType {
  state: AppState;
  startWorkout: (name: string) => void;
  startFromTemplate: (templateId: string) => void;
  addExercise: (exerciseId: string) => void;
  removeExercise: (workoutExerciseId: string) => void;
  addSet: (workoutExerciseId: string) => void;
  updateSet: (
    workoutExerciseId: string,
    setId: string,
    updates: Partial<WorkoutSet>
  ) => void;
  removeSet: (workoutExerciseId: string, setId: string) => void;
  endWorkout: () => void;
  discardWorkout: () => void;
  deleteWorkout: (workoutId: string) => void;
  addTemplate: (template: WorkoutTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  setWeeklyGoal: (goal: number) => void;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

const initialState: AppState = {
  workouts: [],
  activeWorkout: null,
  templates: defaultTemplates,
  personalRecords: [],
  stats: defaultStats,
};

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as AppState;
          dispatch({ type: "LOAD", payload: saved });
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startWorkout = useCallback((name: string) => {
    dispatch({ type: "START_WORKOUT", payload: { name } });
  }, []);

  const startFromTemplate = useCallback((templateId: string) => {
    dispatch({ type: "START_FROM_TEMPLATE", payload: { templateId } });
  }, []);

  const addExercise = useCallback((exerciseId: string) => {
    dispatch({ type: "ADD_EXERCISE", payload: { exerciseId } });
  }, []);

  const removeExercise = useCallback((workoutExerciseId: string) => {
    dispatch({ type: "REMOVE_EXERCISE", payload: { workoutExerciseId } });
  }, []);

  const addSet = useCallback((workoutExerciseId: string) => {
    dispatch({ type: "ADD_SET", payload: { workoutExerciseId } });
  }, []);

  const updateSet = useCallback(
    (
      workoutExerciseId: string,
      setId: string,
      updates: Partial<WorkoutSet>
    ) => {
      dispatch({ type: "UPDATE_SET", payload: { workoutExerciseId, setId, updates } });
    },
    []
  );

  const removeSet = useCallback(
    (workoutExerciseId: string, setId: string) => {
      dispatch({ type: "REMOVE_SET", payload: { workoutExerciseId, setId } });
    },
    []
  );

  const endWorkout = useCallback(() => {
    dispatch({ type: "END_WORKOUT" });
  }, []);

  const discardWorkout = useCallback(() => {
    dispatch({ type: "DISCARD_WORKOUT" });
  }, []);

  const deleteWorkout = useCallback((workoutId: string) => {
    dispatch({ type: "DELETE_WORKOUT", payload: { workoutId } });
  }, []);

  const addTemplate = useCallback((template: WorkoutTemplate) => {
    dispatch({ type: "ADD_TEMPLATE", payload: template });
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    dispatch({ type: "DELETE_TEMPLATE", payload: { templateId } });
  }, []);

  const setWeeklyGoal = useCallback((goal: number) => {
    dispatch({ type: "SET_WEEKLY_GOAL", payload: { goal } });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        state,
        startWorkout,
        startFromTemplate,
        addExercise,
        removeExercise,
        addSet,
        updateSet,
        removeSet,
        endWorkout,
        discardWorkout,
        deleteWorkout,
        addTemplate,
        deleteTemplate,
        setWeeklyGoal,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextType {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used inside WorkoutProvider");
  return ctx;
}
