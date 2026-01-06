"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HarvestForm } from "@/components/harvest-form"
import { ProcessingForm } from "@/components/processing-form"
import { LogisticsForm } from "@/components/logistics-form"
import { BatchSearch } from "@/components/batch-search"
import { AllBatchesView } from "@/components/all-batches-view"
import { Sprout, LayoutDashboard } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [activeTab, setActiveTab] = useState("harvest")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-balance">Sistema de Trazabilidad Alimentaria</h1>
              <p className="text-sm text-muted-foreground">Cooperativa de Mangos Orgánicos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="harvest">Cosecha</TabsTrigger>
            <TabsTrigger value="processing">Procesamiento</TabsTrigger>
            <TabsTrigger value="logistics">Logística</TabsTrigger>
            <TabsTrigger value="search">
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>

          <TabsContent value="harvest">
            <HarvestForm onSuccess={handleFormSuccess} />
          </TabsContent>

          <TabsContent value="processing">
            <ProcessingForm onSuccess={handleFormSuccess} />
          </TabsContent>

          <TabsContent value="logistics">
            <LogisticsForm onSuccess={handleFormSuccess} />
          </TabsContent>

          <TabsContent value="search">
            <BatchSearch key={refreshKey} />
          </TabsContent>

          <TabsContent value="all">
            <AllBatchesView key={refreshKey} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Sistema basado en metodología TRAZAL</p>
            <p className="mt-1">Arquitectura de 3 capas: Presentación → Lógica → Datos</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
