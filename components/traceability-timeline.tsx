// ===========================
// PRESENTATION LAYER - Timeline Component
// ===========================

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Package2, Truck, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react"
import type { TraceabilityRecord } from "@/lib/data-layer"
import { TraceabilityLogic } from "@/lib/business-logic"

interface TimelineProps {
  record: TraceabilityRecord
}

export function TraceabilityTimeline({ record }: TimelineProps) {
  const completion = TraceabilityLogic.calculateCompletionPercentage(record)
  const tempRisk = record.logistics
    ? TraceabilityLogic.assessTemperatureRisk(record.logistics.transportTemperature)
    : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lote: {record.batchId}</CardTitle>
            <CardDescription>Historial completo de trazabilidad</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{completion}%</div>
            <div className="text-xs text-muted-foreground">Completado</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Harvest Stage */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  record.harvest ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Leaf className="h-5 w-5" />
              </div>
              {(record.processing || record.logistics) && <div className="h-full w-0.5 bg-border mt-2" />}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Origen - Cosecha</h3>
                {record.harvest ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              {record.harvest ? (
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Fecha: {new Date(record.harvest.harvestDate).toLocaleDateString("es-ES")}</p>
                  {record.harvest.quantity && <p>Cantidad: {record.harvest.quantity} kg</p>}
                  {record.harvest.location && <p>Ubicación: {record.harvest.location}</p>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin registrar</p>
              )}
            </div>
          </div>

          {/* Processing Stage */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  record.processing ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Package2 className="h-5 w-5" />
              </div>
              {record.logistics && <div className="h-full w-0.5 bg-border mt-2" />}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Transformación - Procesamiento</h3>
                {record.processing ? (
                  record.processing.qualityStatus === "pass" ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              {record.processing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant={record.processing.washingCompleted ? "default" : "secondary"}>
                      Lavado: {record.processing.washingCompleted ? "Sí" : "No"}
                    </Badge>
                    <Badge variant={record.processing.packagingCompleted ? "default" : "secondary"}>
                      Empaquetado: {record.processing.packagingCompleted ? "Sí" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <Badge variant={record.processing.qualityStatus === "pass" ? "default" : "destructive"}>
                      Calidad: {record.processing.qualityStatus === "pass" ? "Aprobado" : "Rechazado"}
                    </Badge>
                  </div>
                  {record.processing.notes && (
                    <p className="text-sm text-muted-foreground">Notas: {record.processing.notes}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin registrar</p>
              )}
            </div>
          </div>

          {/* Logistics Stage */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  record.logistics ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Logística - Distribución</h3>
                {record.logistics ? (
                  tempRisk?.status === "risk" ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              {record.logistics ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        tempRisk?.status === "risk"
                          ? "destructive"
                          : tempRisk?.status === "warning"
                            ? "secondary"
                            : "default"
                      }
                    >
                      Temperatura: {record.logistics.transportTemperature}°C
                    </Badge>
                  </div>
                  {tempRisk && <p className="text-sm text-muted-foreground">{tempRisk.message}</p>}
                  <p className="text-sm text-muted-foreground">
                    Entrega: {new Date(record.logistics.deliveryDate).toLocaleDateString("es-ES")}
                  </p>
                  {record.logistics.destination && (
                    <p className="text-sm text-muted-foreground">Destino: {record.logistics.destination}</p>
                  )}
                  {record.logistics.carrier && (
                    <p className="text-sm text-muted-foreground">Transportista: {record.logistics.carrier}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin registrar</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
