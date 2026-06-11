import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  const isPositive = trend === 'up'

  return (
    <Card className={cn(
      'p-4 bg-card border-border border-t-2 transition-colors',
      isPositive ? 'border-t-primary' : 'border-t-border',
      className
    )}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        {Icon && (
          <div className={cn(
            'p-1.5 rounded-lg',
            isPositive ? 'bg-primary/15' : 'bg-secondary'
          )}>
            <Icon className={cn(
              'w-4 h-4',
              isPositive ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>
        )}
      </div>
      <p className={cn(
        'text-3xl font-extrabold tabular-nums tracking-tight',
        isPositive && 'text-primary'
      )}>
        {value}
      </p>
    </Card>
  )
}
