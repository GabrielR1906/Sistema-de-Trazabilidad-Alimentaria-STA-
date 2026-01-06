// ===========================
// PRESENTATION LAYER - All Batches View Component
// ===========================

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { dataStore } from "@/lib/data-layer"
import { TraceabilityLogic } from "@/lib/business-logic"
import { useState } from "react"
import { TraceabilityTimeline } from "./traceability-timeline"

export function AllBatchesView() {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const records = dataStore.getAllRecords()
  const selectedRecord = selectedBatchId ? dataStore.getRecord(selectedBatchId) : null

  if (selectedRecord) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedBatchId(null)}>
          ← Volver a la lista
        </Button>
        <TraceabilityTimeline record={selectedRecord} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos los Lotes</CardTitle>
        <CardDescription>Lista de todos los lotes registrados en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay lotes registrados aún. Comience registrando una cosecha.
          </p>
        ) : (
          <div className="space-y-3">
            {records.map((record) => {
              const completion = TraceabilityLogic.calculateCompletionPercentage(record)
              return (
                <div
                  key={record.batchId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{record.batchId}</div>
                    <div className="text-sm text-muted-foreground">
                      Última actualización: {new Date(record.updatedAt).toLocaleString("es-ES")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={completion === 100 ? "default" : "secondary"}>{completion}% completo</Badge>
                    <Button size="sm" variant="outline" onClick={() => setSelectedBatchId(record.batchId)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
