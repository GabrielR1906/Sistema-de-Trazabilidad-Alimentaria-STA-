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
        <Badge>{completion}%</Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Cosecha:</strong> {record.harvestDate || "Pendiente"}</p>
        <p><strong>Calidad:</strong> <Badge variant={record.qualityStatus === "pass" ? "default" : "destructive"}>{record.qualityStatus}</Badge></p>
        <p><strong>Temperatura:</strong> {record.transportTemperature ? `${record.transportTemperature}°C` : "---"}</p>
        <p><strong>Entrega:</strong> {record.deliveryDate || "Pendiente"}</p>
      </CardContent>
    </Card>
  )
}