import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WorkoutTemplate } from '@/types'
import { Clock, Dumbbell, Play, Trash2 } from 'lucide-react'
import { useWorkout } from '@/store'
import { useLocation } from 'wouter'
import { toast } from 'sonner'

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
    <Card className="p-4 bg-card border-border">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{template.name}</h3>
            {template.isCustom && (
              <Badge variant="secondary" className="text-xs">Custom</Badge>
            )}
          </div>
          {template.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {template.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Dumbbell className="w-4 h-4" />
          <span>{template.exercises.length} exercises</span>
        </div>
        {template.estimatedDuration && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{template.estimatedDuration} min</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button 
          onClick={handleStart}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </Button>
        {template.isCustom && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
