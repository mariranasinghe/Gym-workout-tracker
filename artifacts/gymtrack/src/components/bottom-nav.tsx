import { Link, useLocation } from 'wouter'
import { Home, Dumbbell, BookOpen, BarChart3, Library } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkout } from '@/store'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/workout', icon: Dumbbell, label: 'Workout' },
  { href: '/templates', icon: BookOpen, label: 'Templates' },
  { href: '/exercises', icon: Library, label: 'Exercises' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
]

export function BottomNav() {
  const [pathname] = useLocation()
  const { state } = useWorkout()
  const hasActiveWorkout = state.isHydrated && !!state.activeWorkout

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          const showBadge = href === '/workout' && hasActiveWorkout

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 relative min-w-[60px] group',
              )}
            >
              {/* Active indicator bar at top */}
              <div className={cn(
                'absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-b-full transition-all duration-200',
                isActive ? 'w-6 bg-primary' : 'w-0 bg-transparent'
              )} />

              <div className="relative">
                <Icon className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )} strokeWidth={isActive ? 2.5 : 2} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full" />
                )}
              </div>
              <span className={cn(
                'text-[10px] font-semibold transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
