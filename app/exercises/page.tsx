'use client'

import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/page-header'
import { ExerciseCard } from '@/components/exercise-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { exercises, muscleGroups, equipmentTypes } from '@/lib/data/exercises'
import { Search, SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export default function ExercisesPage() {
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('all')
  const [selectedEquipment, setSelectedEquipment] = useState('all')

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
      const matchesMuscle = selectedMuscle === 'all' || 
        ex.muscleGroup === selectedMuscle || 
        ex.secondaryMuscles?.includes(selectedMuscle as any)
      const matchesEquipment = selectedEquipment === 'all' || ex.equipment === selectedEquipment
      return matchesSearch && matchesMuscle && matchesEquipment
    })
  }, [search, selectedMuscle, selectedEquipment])

  const hasActiveFilters = selectedMuscle !== 'all' || selectedEquipment !== 'all'

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Exercises" 
        subtitle={`${filteredExercises.length} exercises`}
        action={
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <SlidersHorizontal className="w-4 h-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] bg-background">
              <SheetHeader>
                <SheetTitle>Filter Exercises</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Muscle Group</h3>
                  <div className="flex flex-wrap gap-2">
                    {muscleGroups.map((muscle) => (
                      <Button
                        key={muscle.id}
                        variant={selectedMuscle === muscle.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedMuscle(muscle.id)}
                        className={cn(
                          selectedMuscle === muscle.id && 'bg-primary text-primary-foreground'
                        )}
                      >
                        {muscle.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3">Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    {equipmentTypes.map((eq) => (
                      <Button
                        key={eq.id}
                        variant={selectedEquipment === eq.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedEquipment(eq.id)}
                        className={cn(
                          selectedEquipment === eq.id && 'bg-primary text-primary-foreground'
                        )}
                      >
                        {eq.label}
                      </Button>
                    ))}
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedMuscle('all')
                      setSelectedEquipment('all')
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <main className="p-4 pb-24">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {/* Quick muscle filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 touch-scroll">
          {muscleGroups.slice(0, 7).map((muscle) => (
            <Button
              key={muscle.id}
              variant={selectedMuscle === muscle.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMuscle(muscle.id)}
              className={cn(
                'shrink-0',
                selectedMuscle === muscle.id && 'bg-primary text-primary-foreground'
              )}
            >
              {muscle.label}
            </Button>
          ))}
        </div>

        {/* Exercise list */}
        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
          {filteredExercises.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p>No exercises found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
