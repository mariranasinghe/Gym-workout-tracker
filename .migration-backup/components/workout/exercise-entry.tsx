'use client'

import { useState } from 'react'
import { WorkoutExercise, WorkoutSet } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SetRow } from './set-row'
import { getExerciseById } from '@/lib/data/exercises'
import { useWorkout } from '@/lib/store'
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
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between gap-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-semibold truncate">{exerciseData.name}</h3>
          <p className="text-sm text-muted-foreground">
            {completedSets}/{totalSets} sets completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            completedSets === totalSets && totalSets > 0
              ? 'bg-success/20 text-success'
              : 'bg-muted text-muted-foreground'
          )}>
            {completedSets === totalSets && totalSets > 0 ? 'Done' : `${completedSets}/${totalSets}`}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Sets */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {/* Header row */}
          <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground">
            <div className="w-8 text-center">Set</div>
            <div className="w-16 text-center hidden sm:block">Prev</div>
            <div className="flex-1 text-center">Weight (kg)</div>
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

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleAddSet}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Set
            </Button>
            <Button
              variant="ghost"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
