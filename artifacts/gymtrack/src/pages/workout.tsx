import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useWorkout } from '@/store'
import { Button } from '@/components/ui/button'
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
import { Check, Play, X, Dumbbell } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'wouter'

export default function WorkoutPage() {
  const [, navigate] = useLocation()
  const { state, dispatch } = useWorkout()
  const [elapsed, setElapsed] = useState(0)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)

  const activeWorkout = state.activeWorkout

  useEffect(() => {
    if (!activeWorkout) return
    const startTime = new Date(activeWorkout.startTime).getTime()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [activeWorkout])

  if (!state.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleStartWorkout = () => {
    dispatch({ type: 'START_WORKOUT', payload: { name: 'New Workout' } })
    toast.success('Workout started!')
  }

  const handleFinishWorkout = () => {
    dispatch({ type: 'END_WORKOUT' })
    toast.success('Workout completed! Great job! 💪')
    navigate('/progress')
  }

  const handleCancelWorkout = () => {
    dispatch({ type: 'CANCEL_WORKOUT' })
    toast('Workout cancelled')
    setShowCancelDialog(false)
  }

  const handleRemoveExercise = (exerciseId: string) => {
    dispatch({ type: 'REMOVE_EXERCISE', payload: exerciseId })
  }

  const totalSets = activeWorkout?.exercises.reduce((acc, ex) => acc + ex.sets.length, 0) || 0
  const completedSets = activeWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  ) || 0

  if (!activeWorkout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-5 pb-24">
        <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center">
          <Dumbbell className="w-9 h-9 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-1.5">No Active Workout</h2>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            Log sets, track your volume, and beat your personal records.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button
            onClick={handleStartWorkout}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-13 text-base font-bold rounded-xl gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Empty Workout
          </Button>
          <Button variant="outline" asChild className="w-full h-11 rounded-xl font-semibold">
            <Link href="/templates">Use a Template</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Workout top bar */}
      <header className="sticky top-0 z-40 bg-card/98 backdrop-blur-xl border-b border-border px-4 pt-3 pb-3 safe-area-pt">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {activeWorkout.name}
            </p>
            <p className="text-3xl font-extrabold tabular-nums tracking-tight text-foreground leading-none mt-1">
              {formatDuration(elapsed)}
            </p>
            {totalSets > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {completedSets}/{totalSets} sets done
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCancelDialog(true)}
              className="w-9 h-9 text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowFinishDialog(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 font-bold text-sm gap-1.5 rounded-xl"
            >
              <Check className="w-4 h-4" />
              Finish
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 pb-32 space-y-3">
        {activeWorkout.exercises.map((exercise) => (
          <ExerciseEntry
            key={exercise.id}
            exercise={exercise}
            onRemove={() => handleRemoveExercise(exercise.id)}
          />
        ))}

        <AddExerciseDialog />
      </main>

      <RestTimer />

      {/* Cancel dialog */}
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

      {/* Finish dialog */}
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
