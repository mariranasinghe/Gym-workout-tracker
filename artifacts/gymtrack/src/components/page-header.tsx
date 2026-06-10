import { ArrowLeft } from 'lucide-react'
import { useLocation } from 'wouter'
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
  const [, navigate] = useLocation()

  return (
    <header className={cn(
      'sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3 safe-area-pt',
      className
    )}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="shrink-0 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}
