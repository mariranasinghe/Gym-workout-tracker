import { useParams, useLocation } from 'wouter'
import { getExerciseById } from '@/exercises'
import { useWorkout } from '@/store'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Trophy, Target, Dumbbell, Info } from 'lucide-react'

export default function ExerciseDetailPage() {
  const params = useParams<{ id: string }>()
  const [, navigate] = useLocation()
  const exercise = getExerciseById(params.id || '')
  const { state } = useWorkout()

  if (!exercise) {
    navigate('/exercises')
    return null
  }

  if (!state.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  const pr = state.personalRecords[exercise.id]

  const exerciseHistory = state.workoutHistory
    .flatMap(w => w.exercises.filter(e => e.exerciseId === exercise.id).map(e => ({
      date: w.date,
      sets: e.sets.filter(s => s.completed),
    })))
    .filter(h => h.sets.length > 0)
    .slice(0, 5)

  return (
    <div className="min-h-screen">
      <PageHeader title={exercise.name} showBack />

      <main className="p-4 pb-24 space-y-6">
        <div className="flex flex-wrap gap-2">
          <Badge className="capitalize bg-primary/20 text-primary border-0">
            {exercise.muscleGroup}
          </Badge>
          {exercise.secondaryMuscles?.map(muscle => (
            <Badge key={muscle} variant="secondary" className="capitalize">
              {muscle}
            </Badge>
          ))}
          <Badge variant="outline" className="capitalize">
            {exercise.equipment}
          </Badge>
        </div>

        {pr && (
          <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Personal Record</p>
                <p className="text-2xl font-bold">
                  {pr.weight} kg x {pr.reps} reps
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(pr.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            How to Perform
          </h2>
          <Card className="p-4 bg-card border-border">
            <ol className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {exercise.tips && exercise.tips.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Tips
            </h2>
            <Card className="p-4 bg-card border-border">
              <ul className="space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {exerciseHistory.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Recent History
            </h2>
            <div className="space-y-2">
              {exerciseHistory.map((entry, index) => (
                <Card key={index} className="p-3 bg-card border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {entry.sets.length} sets
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.sets.map((set, setIndex) => (
                      <Badge key={setIndex} variant="secondary" className="text-xs">
                        {set.weight}kg x {set.reps}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-semibold mb-3">Muscles Worked</h2>
          <Card className="p-4 bg-card border-border">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm capitalize">{exercise.muscleGroup}</span>
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '100%' }} />
                </div>
              </div>
              {exercise.secondaryMuscles?.map(muscle => (
                <div key={muscle} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-muted-foreground">{muscle}</span>
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary/50" style={{ width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
