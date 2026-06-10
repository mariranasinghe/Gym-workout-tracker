'use client'

import { useMemo } from 'react'
import { useWorkout } from '@/lib/store'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { getExerciseById } from '@/lib/data/exercises'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  CartesianGrid
} from 'recharts'
import { 
  Calendar, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Dumbbell,
  Clock
} from 'lucide-react'

export default function ProgressPage() {
  const { state } = useWorkout()

  // Wait for hydration
  if (!state.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  // Calculate weekly volume data
  const weeklyData = useMemo(() => {
    const weeks: Record<string, number> = {}
    const now = new Date()
    
    // Initialize last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - (i * 7))
      const weekKey = getWeekKey(date)
      weeks[weekKey] = 0
    }

    // Sum volume by week
    state.workoutHistory.forEach(workout => {
      const weekKey = getWeekKey(new Date(workout.date))
      if (weeks[weekKey] !== undefined) {
        workout.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            if (set.completed) {
              weeks[weekKey] += set.weight * set.reps
            }
          })
        })
      }
    })

    return Object.entries(weeks).map(([week, volume]) => ({
      week: week.split('-W')[1],
      volume: Math.round(volume / 1000), // Convert to kg thousands
    }))
  }, [state.workoutHistory])

  // Personal records
  const prs = Object.values(state.personalRecords).slice(0, 5)

  // Format volume
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return volume.toString()
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Progress" subtitle="Track your gains" />

      <main className="p-4 pb-24 space-y-6">
        {/* Stats Grid */}
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
            label="Best Streak" 
            value={`${state.stats.longestStreak} days`}
            icon={Trophy}
          />
        </div>

        {/* Volume Chart */}
        <div>
          <h2 className="font-semibold mb-3">Weekly Volume</h2>
          <Card className="p-4 bg-card border-border">
            {state.workoutHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value}k kg`, 'Volume']}
                    labelFormatter={(label) => `Week ${label}`}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Complete workouts to see your volume chart
              </div>
            )}
          </Card>
        </div>

        {/* Personal Records */}
        {prs.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Personal Records
            </h2>
            <div className="space-y-2">
              {prs.map((pr) => {
                const exercise = getExerciseById(pr.exerciseId)
                return (
                  <Card key={pr.exerciseId} className="p-3 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{exercise?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(pr.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-0">
                        {pr.weight} kg x {pr.reps}
                      </Badge>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Workout History */}
        <div>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Workout History
          </h2>
          {state.workoutHistory.length > 0 ? (
            <div className="space-y-2">
              {state.workoutHistory.slice(0, 10).map((workout) => {
                const totalVolume = workout.exercises.reduce((acc, ex) => {
                  return acc + ex.sets.reduce((setAcc, set) => {
                    return setAcc + (set.completed ? set.weight * set.reps : 0)
                  }, 0)
                }, 0)
                const completedSets = workout.exercises.reduce((acc, ex) => {
                  return acc + ex.sets.filter(s => s.completed).length
                }, 0)

                return (
                  <Card key={workout.id} className="p-4 bg-card border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{workout.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(workout.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {workout.duration && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {workout.duration} min
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {workout.exercises.length} exercises
                      </span>
                      <span className="text-muted-foreground">
                        {completedSets} sets
                      </span>
                      <span className="text-primary font-medium">
                        {formatVolume(totalVolume)} kg
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="p-8 bg-card border-border text-center">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No Workouts Yet</h3>
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

function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const firstDayOfYear = new Date(year, 0, 1)
  const dayOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((dayOfYear + firstDayOfYear.getDay() + 1) / 7)
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}
