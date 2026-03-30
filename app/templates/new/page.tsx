'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkout } from '@/lib/store'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { exercises, muscleGroups } from '@/lib/data/exercises'
import { WorkoutTemplate } from '@/lib/types'
import { Plus, Trash2, GripVertical, Search, Save } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'

interface TemplateExercise {
  exerciseId: string
  targetSets: number
  targetReps: string
}

export default function NewTemplatePage() {
  const router = useRouter()
  const { dispatch } = useWorkout()
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>([])
  const [showExerciseDialog, setShowExerciseDialog] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('all')

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = selectedMuscle === 'all' || 
      ex.muscleGroup === selectedMuscle || 
      ex.secondaryMuscles?.includes(selectedMuscle as any)
    return matchesSearch && matchesMuscle
  })

  const handleAddExercise = (exerciseId: string) => {
    setTemplateExercises(prev => [
      ...prev,
      { exerciseId, targetSets: 3, targetReps: '8-12' }
    ])
    setShowExerciseDialog(false)
    setSearch('')
    setSelectedMuscle('all')
  }

  const handleRemoveExercise = (index: number) => {
    setTemplateExercises(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdateExercise = (index: number, updates: Partial<TemplateExercise>) => {
    setTemplateExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, ...updates } : ex
    ))
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a template name')
      return
    }
    if (templateExercises.length === 0) {
      toast.error('Add at least one exercise')
      return
    }

    const template: WorkoutTemplate = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      exercises: templateExercises,
      isCustom: true,
      estimatedDuration: templateExercises.length * 10,
    }

    dispatch({ type: 'ADD_TEMPLATE', payload: template })
    toast.success('Template saved!')
    router.push('/templates')
  }

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="New Template" 
        showBack
        action={
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        }
      />

      <main className="p-4 pb-24 space-y-6">
        {/* Basic Info */}
        <FieldGroup>
          <Field>
            <FieldLabel>Template Name</FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Upper Body Hypertrophy"
              className="bg-secondary border-border"
            />
          </Field>
          <Field>
            <FieldLabel>Description (optional)</FieldLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Focus on chest and back"
              className="bg-secondary border-border"
            />
          </Field>
        </FieldGroup>

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Exercises</h2>
            <span className="text-sm text-muted-foreground">
              {templateExercises.length} exercises
            </span>
          </div>

          {templateExercises.length > 0 ? (
            <div className="space-y-2 mb-4">
              {templateExercises.map((ex, index) => {
                const exercise = exercises.find(e => e.id === ex.exerciseId)
                return (
                  <Card key={index} className="p-3 bg-card border-border">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{exercise?.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Sets:</span>
                            <Input
                              type="number"
                              value={ex.targetSets}
                              onChange={(e) => handleUpdateExercise(index, { 
                                targetSets: parseInt(e.target.value) || 1 
                              })}
                              className="w-14 h-8 text-center text-sm bg-secondary border-border"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Reps:</span>
                            <Input
                              value={ex.targetReps}
                              onChange={(e) => handleUpdateExercise(index, { 
                                targetReps: e.target.value 
                              })}
                              placeholder="8-12"
                              className="w-16 h-8 text-center text-sm bg-secondary border-border"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(index)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="p-8 bg-card border-border border-dashed mb-4">
              <div className="text-center text-muted-foreground">
                <p className="mb-2">No exercises added yet</p>
                <p className="text-sm">Add exercises to build your template</p>
              </div>
            </Card>
          )}

          <Button
            variant="outline"
            onClick={() => setShowExerciseDialog(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
        </div>
      </main>

      {/* Add Exercise Dialog */}
      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent className="max-w-lg h-[80vh] flex flex-col p-0 gap-0 bg-background">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Add Exercise</DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 touch-scroll">
              {muscleGroups.slice(0, 6).map((muscle) => (
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
          </div>

          <ScrollArea className="flex-1 px-4 pb-4">
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  className="p-3 bg-card border-border hover:bg-secondary/50 transition-colors cursor-pointer active:scale-[0.98]"
                  onClick={() => handleAddExercise(exercise.id)}
                >
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {exercise.muscleGroup} - {exercise.equipment}
                  </p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
