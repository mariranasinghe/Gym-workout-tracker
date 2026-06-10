import { WorkoutSet } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SetRowProps {
  set: WorkoutSet
  index: number
  previousWeight?: number
  previousReps?: number
  onUpdate: (updates: Partial<WorkoutSet>) => void
  onToggleComplete: () => void
  onDelete: () => void
}

export function SetRow({
  set,
  index,
  previousWeight,
  previousReps,
  onUpdate,
  onToggleComplete,
  onDelete,
}: SetRowProps) {
  return (
    <div className={cn(
      'flex items-center gap-2 p-3 rounded-lg transition-colors',
      set.completed ? 'bg-success/10' : 'bg-secondary/50'
    )}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
        set.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
      )}>
        {index + 1}
      </div>

      <div className="w-16 text-xs text-muted-foreground text-center hidden sm:block">
        {previousWeight && previousReps ? (
          <span>{previousWeight} x {previousReps}</span>
        ) : (
          <span>-</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Input
          type="number"
          inputMode="decimal"
          placeholder="kg"
          value={set.weight || ''}
          onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
          className={cn(
            'h-10 text-center font-semibold bg-background border-border',
            set.completed && 'bg-success/10 border-success/30'
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="reps"
          value={set.reps || ''}
          onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
          className={cn(
            'h-10 text-center font-semibold bg-background border-border',
            set.completed && 'bg-success/10 border-success/30'
          )}
        />
      </div>

      <Button
        variant={set.completed ? 'default' : 'outline'}
        size="icon"
        onClick={onToggleComplete}
        className={cn(
          'shrink-0 h-10 w-10',
          set.completed && 'bg-success hover:bg-success/90 border-success'
        )}
        disabled={!set.completed && (!set.weight || !set.reps)}
      >
        <Check className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="shrink-0 h-10 w-10 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
