import { useMemo } from 'react'
import { useWorkout } from '@/store'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { getExerciseById } from '@/exercises'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Calendar, Clock, Flame, Trophy, TrendingUp } from 'lucide-react'

function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const firstDayOfYear = new Date(year, 0, 1)
  const dayOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((dayOfYear + firstDayOfYear.getDay() + 1) / 7)
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}

export default function ProgressPage() {
  const { state } = useWorkout()

  const weeklyData = useMemo(() => {
    if (!state.isHydrated) return []
    const weeks: Record<string, number> = {}
    const now = new Date()
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i * 7)
      weeks[getWeekKey(date)] = 0
    }
    state.workoutHistory.forEach(workout => {
      const key = getWeekKey(new Date(workout.date))
      if (weeks[key] !== undefined) {
        workout.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            if (set.completed) weeks[key] += set.weight * set.reps
          })
        })
      }
    })
    return Object.entries(weeks).map(([week, volume]) => ({
      week: `W${week.split('-W')[1]}`,
      volume: Math.round(volume / 1000),
    }))
  }, [state.workoutHistory])

  const prs = Object.values(state.personalRecords).slice(0, 6)

  if (!state.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  const formatVolume = (v: number) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
    return v.toString()
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Progress" />

      <main className="p-4 pb-28 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Workouts" value={state.stats.totalWorkouts} icon={Calendar} />
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
            label="Best Streak"
            value={`${state.stats.longestStreak} days`}
            icon={Trophy}
            trend={state.stats.longestStreak > 0 ? 'up' : 'neutral'}
          />
        </div>

        {/* Volume chart */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Weekly Volume
          </p>
          <Card className="p-4 bg-card border-border">
            {state.workoutHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData} barCategoryGap="30%">
                  <XAxis
                    dataKey="week"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}k`}
                    width={30}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '10px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700 }}
                    formatter={(value: number) => [`${value}k kg`, 'Volume']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar
                    dataKey="volume"
                    fill="hsl(var(--primary))"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
                Complete workouts to see your volume chart
              </div>
            )}
          </Card>
        </div>

        {/* Personal Records */}
        {prs.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-3 h-3 text-primary" />
              Personal Records
            </p>
            <Card className="bg-card border-border divide-y divide-border overflow-hidden">
              {prs.map((pr) => {
                const exercise = getExerciseById(pr.exerciseId)
                return (
                  <div key={pr.exerciseId} className="flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                        <Trophy className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{exercise?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="bg-primary/15 text-primary text-xs font-bold px-3 py-1.5 rounded-lg">
                      {pr.weight} kg × {pr.reps}
                    </div>
                  </div>
                )
              })}
            </Card>
          </div>
        )}

        {/* Workout History */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Workout History
          </p>
          {state.workoutHistory.length > 0 ? (
            <Card className="bg-card border-border divide-y divide-border overflow-hidden">
              {state.workoutHistory.slice(0, 10).map((workout) => {
                const totalVolume = workout.exercises.reduce((acc, ex) =>
                  acc + ex.sets.reduce((s, set) => s + (set.completed ? set.weight * set.reps : 0), 0), 0
                )
                const completedSetsCount = workout.exercises.reduce(
                  (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
                )
                return (
                  <div key={workout.id} className="p-3.5">
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <h3 className="font-bold text-sm">{workout.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(workout.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {workout.duration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {workout.duration}m
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{workout.exercises.length} exercises</span>
                      <span>·</span>
                      <span>{completedSetsCount} sets</span>
                      <span>·</span>
                      <span className="text-primary font-semibold">{formatVolume(totalVolume)} kg</span>
                    </div>
                  </div>
                )
              })}
            </Card>
          ) : (
            <Card className="p-10 bg-card border-border text-center">
              <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto mb-3 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-bold mb-1">No Workouts Yet</h3>
              <p className="text-sm text-muted-foreground">
                Complete your first workout to start tracking progress
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
