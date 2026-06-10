import { Switch, Route, Router as WouterRouter } from 'wouter'
import { Toaster } from 'sonner'
import { WorkoutProvider } from '@/store'
import { BottomNav } from '@/components/bottom-nav'
import HomePage from '@/pages/home'
import ExercisesPage from '@/pages/exercises'
import ExerciseDetailPage from '@/pages/exercise-detail'
import WorkoutPage from '@/pages/workout'
import ProgressPage from '@/pages/progress'
import TemplatesPage from '@/pages/templates'
import NewTemplatePage from '@/pages/new-template'
import NotFound from '@/pages/not-found'

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/exercises" component={ExercisesPage} />
      <Route path="/exercises/:id" component={ExerciseDetailPage} />
      <Route path="/workout" component={WorkoutPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/templates/new" component={NewTemplatePage} />
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  return (
    <WorkoutProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <main className="min-h-screen pb-20 safe-area-inset">
          <Router />
        </main>
        <BottomNav />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
          }}
        />
      </WouterRouter>
    </WorkoutProvider>
  )
}

export default App
