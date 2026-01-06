// components/traceability-timeline.tsx
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TraceabilityLogic } from "@/lib/business-logic"

export function TraceabilityTimeline({ record }: { record: any }) {
  const completion = TraceabilityLogic.calculateCompletionPercentage(record)

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lote: {record.batchId}</CardTitle>
        <Badge variant="outline">{completion}% completado</Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Cosecha:</strong> {record.harvestDate || "Pendiente"}</p>
        <p><strong>Calidad:</strong> <Badge>{record.qualityStatus}</Badge></p>
        <p><strong>Temp. Transporte:</strong> {record.transportTemperature ? `${record.transportTemperature}°C` : "N/A"}</p>
        <p><strong>Entrega:</strong> {record.deliveryDate || "En camino"}</p>
      </CardContent>
    </Card>
  )
}