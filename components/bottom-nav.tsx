'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, BookOpen, BarChart3, Library } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkout } from '@/lib/store'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/workout', icon: Dumbbell, label: 'Workout' },
  { href: '/templates', icon: BookOpen, label: 'Templates' },
  { href: '/exercises', icon: Library, label: 'Exercises' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
]

export function BottomNav() {
  const pathname = usePathname()
  const { state } = useWorkout()
  const hasActiveWorkout = state.isHydrated && !!state.activeWorkout

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          const showBadge = href === '/workout' && hasActiveWorkout
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 relative min-w-[64px]',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium',
                isActive && 'font-semibold'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* Safe area padding for home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
