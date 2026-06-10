'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { exercises, muscleGroups } from '@/lib/data/exercises'
import { ExerciseCard } from '@/components/exercise-card'
import { WorkoutExercise } from '@/lib/types'
import { useWorkout } from '@/lib/store'
import { Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddExerciseDialogProps {
  children?: React.ReactNode
}

export function AddExerciseDialog({ children }: AddExerciseDialogProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('all')
  const { dispatch } = useWorkout()

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
      const matchesMuscle = selectedMuscle === 'all' || 
        ex.muscleGroup === selectedMuscle || 
        ex.secondaryMuscles?.includes(selectedMuscle as any)
      return matchesSearch && matchesMuscle
    })
  }, [search, selectedMuscle])

  const handleAddExercise = (exerciseId: string) => {
    const newExercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      sets: [
        { id: crypto.randomUUID(), weight: 0, reps: 0, completed: false },
        { id: crypto.randomUUID(), weight: 0, reps: 0, completed: false },
        { id: crypto.randomUUID(), weight: 0, reps: 0, completed: false },
      ],
    }
    dispatch({ type: 'ADD_EXERCISE', payload: newExercise })
    setOpen(false)
    setSearch('')
    setSelectedMuscle('all')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg h-[85vh] flex flex-col p-0 gap-0 bg-background">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>

          {/* Muscle filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 touch-scroll">
            {muscleGroups.slice(0, 6).map((muscle) => (
              <Button
                key={muscle.id}
                variant={selectedMuscle === muscle.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMuscle(muscle.id)}
                className={cn(
                  'shrink-0',
                  selectedMuscle === muscle.id && 'bg-primary text-primary-foreground'
                )}
              >
                {muscle.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-2">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => handleAddExercise(exercise.id)}
                showArrow={false}
              />
            ))}
            {filteredExercises.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No exercises found
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
