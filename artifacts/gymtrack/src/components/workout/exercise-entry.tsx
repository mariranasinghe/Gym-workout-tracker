import { useState } from 'react'
import { WorkoutExercise, WorkoutSet } from '@/types'
import { Button } from '@/components/ui/button'
import { SetRow } from './set-row'
import { getExerciseById } from '@/exercises'
import { useWorkout } from '@/store'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExerciseEntryProps {
  exercise: WorkoutExercise
  onRemove: () => void
}

export function ExerciseEntry({ exercise, onRemove }: ExerciseEntryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { dispatch } = useWorkout()
  const exerciseData = getExerciseById(exercise.exerciseId)

  if (!exerciseData) return null

  const completedSets = exercise.sets.filter(s => s.completed).length
  const totalSets = exercise.sets.length
  const allDone = completedSets === totalSets && totalSets > 0
  const progressPct = totalSets > 0 ? completedSets / totalSets : 0

  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1]
    const newSet: WorkoutSet = {
      id: crypto.randomUUID(),
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      completed: false,
    }
    dispatch({
      type: 'ADD_SET',
      payload: { exerciseId: exercise.id, set: newSet },
    })
  }

  const handleUpdateSet = (setId: string, updates: Partial<WorkoutSet>) => {
    dispatch({
      type: 'UPDATE_SET',
      payload: { exerciseId: exercise.id, setId, updates },
    })
  }

  const handleToggleSet = (setId: string) => {
    dispatch({
      type: 'TOGGLE_SET_COMPLETE',
      payload: { exerciseId: exercise.id, setId },
    })
  }

  const handleDeleteSet = (setId: string) => {
    dispatch({
      type: 'REMOVE_SET',
      payload: { exerciseId: exercise.id, setId },
    })
  }

  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-card">
      {/* Progress accent bar */}
      <div className={cn(
        'w-1 shrink-0 transition-colors',
        allDone
          ? 'bg-success'
          : progressPct > 0
          ? 'bg-primary'
          : 'bg-border'
      )} />

      <div className="flex-1 min-w-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between gap-3 hover:bg-secondary/30 transition-colors text-left"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate">{exerciseData.name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
              {exerciseData.muscleGroup}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className={cn(
              'px-2 py-0.5 rounded-full text-xs font-bold',
              allDone
                ? 'bg-success/20 text-success'
                : 'bg-muted text-muted-foreground'
            )}>
              {allDone ? 'Done' : `${completedSets}/${totalSets}`}
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-2">
            <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <div className="w-8 text-center">Set</div>
              <div className="w-14 text-center hidden sm:block">Prev</div>
              <div className="flex-1 text-center">Weight kg</div>
              <div className="flex-1 text-center">Reps</div>
              <div className="w-10" />
              <div className="w-10" />
            </div>

            {exercise.sets.map((set, index) => (
              <SetRow
                key={set.id}
                set={set}
                index={index}
                onUpdate={(updates) => handleUpdateSet(set.id, updates)}
                onToggleComplete={() => handleToggleSet(set.id)}
                onDelete={() => handleDeleteSet(set.id)}
              />
            ))}

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="ghost"
                onClick={handleAddSet}
                className="flex-1 h-9 bg-muted/50 hover:bg-muted text-primary font-semibold text-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Set
              </Button>
              <Button
                variant="ghost"
                onClick={onRemove}
                className="h-9 px-3 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
