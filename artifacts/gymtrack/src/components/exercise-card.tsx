import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Exercise } from '@/types'
import { ChevronRight, Trophy } from 'lucide-react'
import { Link } from 'wouter'
import { useWorkout } from '@/store'

interface ExerciseCardProps {
  exercise: Exercise
  onClick?: () => void
  showArrow?: boolean
  selected?: boolean
}

const muscleColors: Record<string, string> = {
  chest: 'bg-red-500/20 text-red-400',
  back: 'bg-blue-500/20 text-blue-400',
  shoulders: 'bg-orange-500/20 text-orange-400',
  biceps: 'bg-purple-500/20 text-purple-400',
  triceps: 'bg-pink-500/20 text-pink-400',
  legs: 'bg-green-500/20 text-green-400',
  glutes: 'bg-rose-500/20 text-rose-400',
  core: 'bg-yellow-500/20 text-yellow-400',
  calves: 'bg-teal-500/20 text-teal-400',
  forearms: 'bg-indigo-500/20 text-indigo-400',
}

export function ExerciseCard({ exercise, onClick, showArrow = true, selected }: ExerciseCardProps) {
  const { state } = useWorkout()
  const pr = state.isHydrated ? state.personalRecords[exercise.id] : null

  const content = (
    <Card 
      className={cn(
        'p-4 bg-card border-border hover:bg-secondary/50 transition-colors active:scale-[0.98]',
        selected && 'ring-2 ring-primary bg-primary/10',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{exercise.name}</h3>
            {pr && (
              <div className="flex items-center gap-1 text-primary">
                <Trophy className="w-3 h-3" />
                <span className="text-xs font-medium">{pr.weight}kg</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={cn('text-xs capitalize', muscleColors[exercise.muscleGroup])}
            >
              {exercise.muscleGroup}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {exercise.equipment}
            </span>
          </div>
        </div>
        {showArrow && !onClick && (
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </div>
    </Card>
  )

  if (onClick) {
    return content
  }

  return (
    <Link href={`/exercises/${exercise.id}`}>
      {content}
    </Link>
  )
}
