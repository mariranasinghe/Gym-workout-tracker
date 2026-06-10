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
  return (
    <Card className={cn(
      'p-4 bg-card border-border',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className={cn(
            'text-2xl font-bold tabular-nums',
            trend === 'up' && 'text-success',
            trend === 'down' && 'text-destructive'
          )}>
            {value}
          </p>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </Card>
  )
}
