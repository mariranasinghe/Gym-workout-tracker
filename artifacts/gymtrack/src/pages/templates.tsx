import { useState } from 'react'
import { useWorkout } from '@/store'
import { PageHeader } from '@/components/page-header'
import { TemplateCard } from '@/components/template-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { Plus } from 'lucide-react'
import { Link } from 'wouter'
import { toast } from 'sonner'

export default function TemplatesPage() {
  const { state, dispatch } = useWorkout()
  const [activeTab, setActiveTab] = useState('all')

  if (!state.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  const presetTemplates = state.templates.filter(t => !t.isCustom)
  const customTemplates = state.templates.filter(t => t.isCustom)

  const handleDeleteTemplate = (id: string) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: id })
    toast.success('Template deleted')
  }

  const categories = [...new Set(presetTemplates.map(t => t.category).filter(Boolean))]

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Templates" 
        subtitle="Choose a workout routine"
        action={
          <Button size="sm" asChild>
            <Link href="/templates/new">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Link>
          </Button>
        }
      />

      <main className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4 bg-secondary">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">
              My Templates
              {customTemplates.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  {customTemplates.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-6">
            {categories.map(category => (
              <div key={category}>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {category}
                </h2>
                <div className="space-y-3">
                  {presetTemplates
                    .filter(t => t.category === category)
                    .map(template => (
                      <TemplateCard key={template.id} template={template} />
                    ))
                  }
                </div>
              </div>
            ))}

            {customTemplates.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  My Templates
                </h2>
                <div className="space-y-3">
                  {customTemplates.map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template}
                      onDelete={() => handleDeleteTemplate(template.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="mt-0">
            {customTemplates.length > 0 ? (
              <div className="space-y-3">
                {customTemplates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template}
                    onDelete={() => handleDeleteTemplate(template.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No Custom Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your own workout routines
                </p>
                <Button asChild>
                  <Link href="/templates/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
