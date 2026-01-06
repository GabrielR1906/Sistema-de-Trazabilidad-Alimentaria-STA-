"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TraceabilityLogic, TraceabilityRecord } from "@/lib/business-logic"

interface TimelineProps {
  record: TraceabilityRecord
}

export function TraceabilityTimeline({ record }: TimelineProps) {
  const completion = TraceabilityLogic.calculateCompletionPercentage(record)

  // Función auxiliar para color del badge de calidad
  const getQualityVariant = (status: string) => {
    if (status === 'pass') return 'default' // Verde/Negro (según tema)
    if (status === 'fail') return 'destructive' // Rojo
    return 'outline' // Gris
  }

  return (
    <Card className="mt-4 border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Lote: {record.batchId}</CardTitle>
        <Badge variant={completion === 100 ? "default" : "secondary"}>
          {completion}% completado
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Cosecha:</span>
          <span className="font-medium">{record.harvestDate || "---"}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-1 items-center">
          <span className="text-muted-foreground">Estado Calidad:</span>
          <Badge variant={getQualityVariant(record.qualityStatus)}>
            {record.qualityStatus.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Temp. Transporte:</span>
          <span>{record.transportTemperature ? `${record.transportTemperature}°C` : "---"}</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Entrega:</span>
          <span className="font-medium">{record.deliveryDate || "En tránsito/Pendiente"}</span>
        </div>
      </CardContent>
    </Card>
  )
}