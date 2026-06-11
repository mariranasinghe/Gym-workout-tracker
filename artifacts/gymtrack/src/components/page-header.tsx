import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, showBack, action, className }: PageHeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-40 bg-background/97 backdrop-blur-xl border-b border-border px-4 py-3 safe-area-pt',
      className
    )}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="shrink-0 -ml-2 w-8 h-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}
