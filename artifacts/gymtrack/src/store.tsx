import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Workout, WorkoutTemplate, WorkoutExercise, WorkoutSet, PersonalRecord, UserStats } from './types'
import { defaultTemplates } from './templates'

interface WorkoutState {
  activeWorkout: Workout | null
  workoutHistory: Workout[]
  templates: WorkoutTemplate[]
  personalRecords: Record<string, PersonalRecord>
  stats: UserStats
  isHydrated: boolean
}

type WorkoutAction =
  | { type: 'HYDRATE'; payload: Partial<WorkoutState> }
  | { type: 'START_WORKOUT'; payload: { name: string; templateId?: string } }
  | { type: 'END_WORKOUT' }
  | { type: 'CANCEL_WORKOUT' }
  | { type: 'ADD_EXERCISE'; payload: WorkoutExercise }
  | { type: 'REMOVE_EXERCISE'; payload: string }
  | { type: 'ADD_SET'; payload: { exerciseId: string; set: WorkoutSet } }
  | { type: 'UPDATE_SET'; payload: { exerciseId: string; setId: string; updates: Partial<WorkoutSet> } }
  | { type: 'REMOVE_SET'; payload: { exerciseId: string; setId: string } }
  | { type: 'TOGGLE_SET_COMPLETE'; payload: { exerciseId: string; setId: string } }
  | { type: 'UPDATE_WORKOUT_NAME'; payload: string }
  | { type: 'ADD_TEMPLATE'; payload: WorkoutTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'UPDATE_PR'; payload: PersonalRecord }

const initialState: WorkoutState = {
  activeWorkout: null,
  workoutHistory: [],
  templates: defaultTemplates,
  personalRecords: {},
  stats: {
    totalWorkouts: 0,
    totalVolume: 0,
    currentStreak: 0,
    longestStreak: 0,
    weeklyGoal: 4,
    workoutsThisWeek: 0,
  },
  isHydrated: false,
}

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, isHydrated: true }

    case 'START_WORKOUT': {
      const now = new Date()
      const newWorkout: Workout = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        date: now.toISOString().split('T')[0],
        startTime: now.toISOString(),
        exercises: [],
      }
      
      if (action.payload.templateId) {
        const template = state.templates.find(t => t.id === action.payload.templateId)
        if (template) {
          newWorkout.exercises = template.exercises.map(te => ({
            id: crypto.randomUUID(),
            exerciseId: te.exerciseId,
            sets: Array.from({ length: te.targetSets }, () => ({
              id: crypto.randomUUID(),
              weight: 0,
              reps: 0,
              completed: false,
            })),
            notes: te.notes,
          }))
        }
      }
      
      return { ...state, activeWorkout: newWorkout }
    }

    case 'END_WORKOUT': {
      if (!state.activeWorkout) return state
      
      const now = new Date()
      const startTime = new Date(state.activeWorkout.startTime)
      const duration = Math.round((now.getTime() - startTime.getTime()) / 60000)
      
      const completedWorkout: Workout = {
        ...state.activeWorkout,
        endTime: now.toISOString(),
        duration,
      }

      let workoutVolume = 0
      completedWorkout.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          if (set.completed) {
            workoutVolume += set.weight * set.reps
          }
        })
      })

      const today = new Date().toISOString().split('T')[0]
      const lastWorkoutDate = state.stats.lastWorkoutDate
      let newStreak = state.stats.currentStreak

      if (lastWorkoutDate) {
        const daysSinceLastWorkout = Math.floor(
          (new Date(today).getTime() - new Date(lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysSinceLastWorkout <= 1) {
          newStreak += 1
        } else {
          newStreak = 1
        }
      } else {
        newStreak = 1
      }

      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      
      const workoutsThisWeek = state.workoutHistory.filter(w => 
        new Date(w.date) >= startOfWeek
      ).length + 1

      return {
        ...state,
        activeWorkout: null,
        workoutHistory: [completedWorkout, ...state.workoutHistory],
        stats: {
          ...state.stats,
          totalWorkouts: state.stats.totalWorkouts + 1,
          totalVolume: state.stats.totalVolume + workoutVolume,
          currentStreak: newStreak,
          longestStreak: Math.max(state.stats.longestStreak, newStreak),
          lastWorkoutDate: today,
          workoutsThisWeek,
        },
      }
    }

    case 'CANCEL_WORKOUT':
      return { ...state, activeWorkout: null }

    case 'ADD_EXERCISE': {
      if (!state.activeWorkout) return state
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: [...state.activeWorkout.exercises, action.payload],
        },
      }
    }

    case 'REMOVE_EXERCISE': {
      if (!state.activeWorkout) return state
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.filter(e => e.id !== action.payload),
        },
      }
    }

    case 'ADD_SET': {
      if (!state.activeWorkout) return state
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map(ex =>
            ex.id === action.payload.exerciseId
              ? { ...ex, sets: [...ex.sets, action.payload.set] }
              : ex
          ),
        },
      }
    }

    case 'UPDATE_SET': {
      if (!state.activeWorkout) return state
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map(ex =>
            ex.id === action.payload.exerciseId
              ? {
                  ...ex,
                  sets: ex.sets.map(set =>
                    set.id === action.payload.setId
                      ? { ...set, ...action.payload.updates }
                      : set
                  ),
                }
              : ex
          ),
        },
      }
    }

    case 'REMOVE_SET': {
      if (!state.activeWorkout) return state
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map(ex =>
            ex.id === action.payload.exerciseId
              ? { ...ex, sets: ex.sets.filter(s => s.id !== action.payload.setId) }
              : ex
          ),
        },
      }
    }

    case 'TOGGLE_SET_COMPLETE': {
      if (!state.activeWorkout) return state
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map(ex =>
            ex.id === action.payload.exerciseId
              ? {
                  ...ex,
                  sets: ex.sets.map(set =>
                    set.id === action.payload.setId
                      ? { ...set, completed: !set.completed }
                      : set
                  ),
                }
              : ex
          ),
        },
      }
    }

    case 'UPDATE_WORKOUT_NAME': {
      if (!state.activeWorkout) return state
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          name: action.payload,
        },
      }
    }

    case 'ADD_TEMPLATE':
      return {
        ...state,
        templates: [...state.templates, action.payload],
      }

    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(t => t.id !== action.payload),
      }

    case 'UPDATE_PR': {
      const currentPR = state.personalRecords[action.payload.exerciseId]
      if (!currentPR || action.payload.weight > currentPR.weight) {
        return {
          ...state,
          personalRecords: {
            ...state.personalRecords,
            [action.payload.exerciseId]: action.payload,
          },
        }
      }
      return state
    }

    default:
      return state
  }
}

const WorkoutContext = createContext<{
  state: WorkoutState
  dispatch: React.Dispatch<WorkoutAction>
} | null>(null)

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem('gym-tracker-data')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'HYDRATE', payload: parsed })
      } catch {
        dispatch({ type: 'HYDRATE', payload: {} })
      }
    } else {
      dispatch({ type: 'HYDRATE', payload: {} })
    }
  }, [])

  useEffect(() => {
    if (state.isHydrated) {
      const { isHydrated, ...dataToSave } = state
      localStorage.setItem('gym-tracker-data', JSON.stringify(dataToSave))
    }
  }, [state])

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider')
  }
  return context
}
