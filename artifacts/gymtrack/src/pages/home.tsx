import { useWorkout } from '@/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/stat-card'
import { getExerciseById } from '@/exercises'
import { Spinner } from '@/components/ui/spinner'
import { 
  Dumbbell, 
  Flame, 
  Play, 
  Target, 
  TrendingUp,
  ChevronRight,
  Zap,
  Calendar
} from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { toast } from 'sonner'

export default function HomePage() {
  const { state, dispatch } = useWorkout()
  const [, navigate] = useLocation()

  if (!state.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  const handleQuickStart = () => {
    if (state.activeWorkout) {
      navigate('/workout')
      return
    }
    dispatch({
      type: 'START_WORKOUT',
      payload: { name: 'Quick Workout' },
    })
    toast.success('Workout started!')
    navigate('/workout')
  }

  const lastWorkout = state.workoutHistory[0]
  const weeklyProgress = Math.round((state.stats.workoutsThisWeek / state.stats.weeklyGoal) * 100)

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return volume.toString()
  }

  return (
    <div className="min-h-screen">
      <header className="px-4 pt-6 pb-4 safe-area-pt">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-2xl font-bold">
              {new Date().getHours() < 12 ? 'Good Morning' : 
               new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
            </h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
        </div>
      </header>

      <main className="px-4 pb-24 space-y-6">
        {state.activeWorkout && (
          <Link href="/workout">
            <Card className="p-4 bg-primary/10 border-primary/30 hover:bg-primary/15 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{state.activeWorkout.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {state.activeWorkout.exercises.length} exercises
                    </p>
                  </div>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </Link>
        )}

        {!state.activeWorkout && (
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold mb-1">Ready to train?</h2>
                <p className="text-sm text-muted-foreground">
                  Start an empty workout or pick a template
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                <Play className="w-7 h-7 text-primary-foreground ml-1" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleQuickStart}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              >
                Quick Start
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="flex-1 h-11"
              >
                <Link href="/templates">
                  Templates
                </Link>
              </Button>
            </div>
          </Card>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Weekly Goal</h2>
            <span className="text-sm text-muted-foreground">
              {state.stats.workoutsThisWeek} of {state.stats.weeklyGoal} workouts
            </span>
          </div>
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3 mb-3">
              {Array.from({ length: state.stats.weeklyGoal }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-3 rounded-full transition-colors ${
                    i < state.stats.workoutsThisWeek 
                      ? 'bg-primary' 
                      : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {weeklyProgress >= 100 
                ? 'Goal achieved! Great work!' 
                : `${state.stats.weeklyGoal - state.stats.workoutsThisWeek} more to go`}
            </p>
          </Card>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Your Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              label="Total Workouts" 
              value={state.stats.totalWorkouts}
              icon={Calendar}
            />
            <StatCard 
              label="Current Streak" 
              value={`${state.stats.currentStreak} days`}
              icon={Flame}
              trend={state.stats.currentStreak > 0 ? 'up' : 'neutral'}
            />
            <StatCard 
              label="Total Volume" 
              value={`${formatVolume(state.stats.totalVolume)} kg`}
              icon={TrendingUp}
            />
            <StatCard 
              label="Weekly Goal" 
              value={`${Math.min(weeklyProgress, 100)}%`}
              icon={Target}
              trend={weeklyProgress >= 100 ? 'up' : 'neutral'}
            />
          </div>
        </div>

        {lastWorkout && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Last Workout</h2>
              <Link href="/progress" className="text-sm text-primary">
                View all
              </Link>
            </div>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{lastWorkout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(lastWorkout.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {lastWorkout.duration && ` - ${lastWorkout.duration} min`}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {lastWorkout.exercises.slice(0, 3).map((ex) => {
                  const exercise = getExerciseById(ex.exerciseId)
                  const completedSets = ex.sets.filter(s => s.completed).length
                  return (
                    <div key={ex.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{exercise?.name}</span>
                      <span>{completedSets} sets</span>
                    </div>
                  )
                })}
                {lastWorkout.exercises.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{lastWorkout.exercises.length - 3} more exercises
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        <div>
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/exercises">
              <Card className="p-4 bg-card border-border hover:bg-secondary/50 transition-colors">
                <Dumbbell className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-medium">Exercise Library</h3>
                <p className="text-xs text-muted-foreground">Browse 50+ exercises</p>
              </Card>
            </Link>
            <Link href="/progress">
              <Card className="p-4 bg-card border-border hover:bg-secondary/50 transition-colors">
                <TrendingUp className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-medium">Progress</h3>
                <p className="text-xs text-muted-foreground">Track your gains</p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
