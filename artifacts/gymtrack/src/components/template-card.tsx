import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WorkoutTemplate } from '@/types'
import { ArrowRight, Clock, Dumbbell, Trash2 } from 'lucide-react'
import { useWorkout } from '@/store'
import { useLocation } from 'wouter'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TemplateCardProps {
  template: WorkoutTemplate
  onDelete?: () => void
}

export function TemplateCard({ template, onDelete }: TemplateCardProps) {
  const [, navigate] = useLocation()
  const { state, dispatch } = useWorkout()

  const handleStart = () => {
    if (!state.isHydrated) return
    if (state.activeWorkout) {
      toast.error('Finish your current workout first')
      return
    }
    dispatch({
      type: 'START_WORKOUT',
      payload: { name: template.name, templateId: template.id },
    })
    toast.success(`Started ${template.name}`)
    navigate('/workout')
  }

  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-card hover:bg-secondary/20 transition-colors">
      {/* Left accent bar */}
      <div className={cn(
        'w-1 shrink-0 rounded-l-xl',
        template.isCustom ? 'bg-muted-foreground/40' : 'bg-primary'
      )} />

      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-base truncate">{template.name}</h3>
              {template.isCustom && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Custom</Badge>
              )}
            </div>
            {template.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {template.description}
              </p>
            )}
          </div>
          {template.isCustom && onDelete && (
            <button
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5" />
            {template.exercises.length} exercises
          </span>
          {template.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{template.estimatedDuration} min
            </span>
          )}
        </div>

        <Button
          onClick={handleStart}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm font-bold gap-1.5"
        >
          Start Workout
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
