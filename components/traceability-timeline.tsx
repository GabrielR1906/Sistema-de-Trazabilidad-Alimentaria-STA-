"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Package2, Truck, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react"
import { TraceabilityLogic } from "@/lib/business-logic"

export function TraceabilityTimeline({ record }: { record: any }) {
  const completion = TraceabilityLogic.calculateCompletionPercentage(record)
  const tempRisk = record.transportTemperature
    ? TraceabilityLogic.assessTemperatureRisk(record.transportTemperature)
    : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lote: {record.batchId}</CardTitle>
            <CardDescription>Historial de trazabilidad en base de datos real</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{completion}%</div>
            <div className="text-xs text-muted-foreground">Completado</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Etapa 1: Cosecha */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${record.harvestDate ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Leaf className="h-5 w-5" />
              </div>
              <div className="h-full w-0.5 bg-border mt-2" />
            </div>
            <div className="flex-1 pb-8">
              <h3 className="font-semibold mb-1">Origen - Cosecha</h3>
              {record.harvestDate ? (
                <div className="text-sm text-muted-foreground">
                  <p>Fecha: {new Date(record.harvestDate).toLocaleDateString()}</p>
                  <p>Cantidad: {record.quantity} kg | Ubicación: {record.location}</p>
                </div>
              ) : <p className="text-sm text-muted-foreground">Pendiente</p>}
            </div>
          </div>

          {/* Etapa 2: Transformación */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${record.qualityStatus !== "pending" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Package2 className="h-5 w-5" />
              </div>
              <div className="h-full w-0.5 bg-border mt-2" />
            </div>
            <div className="flex-1 pb-8">
              <h3 className="font-semibold mb-1">Procesamiento</h3>
              {record.qualityStatus !== "pending" ? (
                <div className="flex gap-2 mt-1">
                  <Badge variant={record.qualityStatus === "pass" ? "default" : "destructive"}>
                    {record.qualityStatus === "pass" ? "Aprobado" : "Rechazado"}
                  </Badge>
                  <Badge variant="outline">Lavado: {record.washingCompleted ? "Sí" : "No"}</Badge>
                </div>
              ) : <p className="text-sm text-muted-foreground">Pendiente</p>}
            </div>
          </div>

          {/* Etapa 3: Logística */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${record.deliveryDate ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Distribución</h3>
              {record.deliveryDate ? (
                <div className="space-y-1 text-sm text-muted-foreground">
                  <Badge variant={tempRisk?.status === "risk" ? "destructive" : "secondary"}>
                    Temp: {record.transportTemperature}°C
                  </Badge>
                  <p>Entrega: {new Date(record.deliveryDate).toLocaleDateString()}</p>
                </div>
              ) : <p className="text-sm text-muted-foreground">Pendiente</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}