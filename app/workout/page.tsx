'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkout } from '@/lib/store'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ExerciseEntry } from '@/components/workout/exercise-entry'
import { AddExerciseDialog } from '@/components/workout/add-exercise-dialog'
import { RestTimer } from '@/components/workout/rest-timer'
import { Check, Clock, Play, X, Dumbbell } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function WorkoutPage() {
  const router = useRouter()
  const { state, dispatch } = useWorkout()
  const [elapsed, setElapsed] = useState(0)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)

  const activeWorkout = state.activeWorkout

  // Wait for hydration
  if (!state.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  // Timer
  useEffect(() => {
    if (!activeWorkout) return

    const startTime = new Date(activeWorkout.startTime).getTime()
    
    const interval = setInterval(() => {
      const now = Date.now()
      setElapsed(Math.floor((now - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeWorkout])

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartWorkout = () => {
    dispatch({
      type: 'START_WORKOUT',
      payload: { name: 'New Workout' },
    })
    toast.success('Workout started!')
  }

  const handleFinishWorkout = () => {
    dispatch({ type: 'END_WORKOUT' })
    toast.success('Workout completed! Great job!')
    router.push('/progress')
  }

  const handleCancelWorkout = () => {
    dispatch({ type: 'CANCEL_WORKOUT' })
    toast('Workout cancelled')
    setShowCancelDialog(false)
  }

  const handleRemoveExercise = (exerciseId: string) => {
    dispatch({ type: 'REMOVE_EXERCISE', payload: exerciseId })
  }

  // Calculate stats
  const totalSets = activeWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.length, 0
  ) || 0
  const completedSets = activeWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  ) || 0

  // No active workout state
  if (!activeWorkout) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Workout" />
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Dumbbell className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Active Workout</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-xs">
            Start a new workout or choose from your templates to begin tracking
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button 
              onClick={handleStartWorkout}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Empty Workout
            </Button>
            <Button variant="outline" asChild className="w-full h-12">
              <Link href="/templates">
                Choose Template
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader 
        title={activeWorkout.name}
        subtitle={`${formatDuration(elapsed)} elapsed`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCancelDialog(true)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        }
      />

      <main className="p-4 pb-32 space-y-4">
        {/* Stats bar */}
        <Card className="p-3 bg-card border-border">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold">{activeWorkout.exercises.length}</p>
              <p className="text-xs text-muted-foreground">Exercises</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold">{completedSets}/{totalSets}</p>
              <p className="text-xs text-muted-foreground">Sets Done</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-2xl font-bold tabular-nums">{formatDuration(elapsed)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
          </div>
        </Card>

        {/* Exercises */}
        <div className="space-y-3">
          {activeWorkout.exercises.map((exercise) => (
            <ExerciseEntry
              key={exercise.id}
              exercise={exercise}
              onRemove={() => handleRemoveExercise(exercise.id)}
            />
          ))}
        </div>

        {/* Add exercise */}
        <AddExerciseDialog />

        {/* Finish workout button */}
        {activeWorkout.exercises.length > 0 && (
          <Button
            onClick={() => setShowFinishDialog(true)}
            variant="outline"
            className="w-full h-12 border-success text-success hover:bg-success hover:text-success-foreground"
          >
            <Check className="w-4 h-4 mr-2" />
            Finish Workout
          </Button>
        )}
      </main>

      {/* Rest Timer */}
      <RestTimer />

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              This will discard all your progress. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Training</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelWorkout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Workout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Finish Dialog */}
      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Finish Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              You completed {completedSets} out of {totalSets} sets. Ready to save this workout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Training</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleFinishWorkout}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              Finish Workout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
