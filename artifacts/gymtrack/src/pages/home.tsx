import { useWorkout } from '@/store'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
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
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

function formatVolume(volume: number) {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k`
  return volume.toString()
}

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
    dispatch({ type: 'START_WORKOUT', payload: { name: 'Quick Workout' } })
    toast.success('Workout started!')
    navigate('/workout')
  }

  const lastWorkout = state.workoutHistory[0]
  const weeklyProgress = Math.min(
    Math.round((state.stats.workoutsThisWeek / state.stats.weeklyGoal) * 100),
    100
  )

  const today = new Date()
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const workoutDays = new Set(
    state.workoutHistory
      .filter((w) => new Date(w.date) >= startOfWeek)
      .map((w) => new Date(w.date).getDay())
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-pt">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              {greeting()}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight mt-0.5">GymTrack</h1>
          </div>
          <div className="flex items-center gap-2 bg-primary/15 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-primary" />
            <span className="font-bold text-primary text-sm">{state.stats.currentStreak}</span>
          </div>
        </div>
      </header>

      <main className="px-4 pb-28 space-y-5">
        {/* Active workout banner */}
        {state.activeWorkout && (
          <Link href="/workout">
            <div className="flex items-center justify-between bg-primary rounded-2xl p-4 active:opacity-90 transition-opacity">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-primary-foreground text-sm">Workout in progress</p>
                  <p className="text-xs text-primary-foreground/70">
                    {state.activeWorkout.name} · {state.activeWorkout.exercises.length} exercises
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary-foreground/80" />
            </div>
          </Link>
        )}

        {/* CTA */}
        {!state.activeWorkout && (
          <div className="space-y-2">
            <Button
              onClick={handleQuickStart}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base font-bold rounded-2xl gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Empty Workout
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full h-11 rounded-xl font-semibold"
            >
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </div>
        )}

        {/* This Week */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              This Week
            </p>
            <p className="text-sm font-bold">
              {state.stats.workoutsThisWeek}
              <span className="text-muted-foreground font-normal text-xs">/{state.stats.weeklyGoal} goal</span>
            </p>
          </div>

          {/* Day circles */}
          <div className="flex justify-between">
            {weekDays.map((day, i) => {
              const isToday = i === today.getDay()
              const done = workoutDays.has(i)
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className={cn(
                    'text-[10px] font-semibold uppercase',
                    isToday ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    {day}
                  </span>
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                    done
                      ? 'bg-success'
                      : isToday
                      ? 'bg-primary/25 border border-primary'
                      : 'bg-muted'
                  )}>
                    {done && <CheckCircle2 className="w-4 h-4 text-success-foreground fill-none" />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-500"
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Your Stats
          </p>
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
              value={`${weeklyProgress}%`}
              icon={Target}
              trend={weeklyProgress >= 100 ? 'up' : 'neutral'}
            />
          </div>
        </div>

        {/* Last Workout */}
        {lastWorkout && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Last Workout
              </p>
              <Link href="/progress" className="text-xs text-primary font-semibold">
                View all
              </Link>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-primary">{lastWorkout.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(lastWorkout.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {lastWorkout.duration ? ` · ${lastWorkout.duration} min` : ''}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                {lastWorkout.exercises.slice(0, 3).map((ex) => {
                  const exercise = getExerciseById(ex.exerciseId)
                  const completedSets = ex.sets.filter(s => s.completed).length
                  return (
                    <div key={ex.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                        <span className="font-medium">{exercise?.name}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{completedSets} sets</span>
                    </div>
                  )
                })}
                {lastWorkout.exercises.length > 3 && (
                  <p className="text-xs text-muted-foreground pt-1 text-center">
                    +{lastWorkout.exercises.length - 3} more exercises
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/exercises">
              <div className="bg-card border border-border rounded-2xl p-4 hover:bg-secondary/30 transition-colors active:scale-[0.98]">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm">Exercise Library</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Browse 50+ exercises</p>
              </div>
            </Link>
            <Link href="/progress">
              <div className="bg-card border border-border rounded-2xl p-4 hover:bg-secondary/30 transition-colors active:scale-[0.98]">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm">Progress</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Track your gains</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
