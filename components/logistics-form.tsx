// ===========================
// PRESENTATION LAYER - Logistics Form Component
// ===========================

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Truck, ThermometerSnowflake, AlertTriangle } from "lucide-react"
import { dataStore } from "@/lib/data-layer"
import { TraceabilityLogic } from "@/lib/business-logic"
import { useToast } from "@/hooks/use-toast"

export function LogisticsForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [transportTemperature, setTransportTemperature] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [destination, setDestination] = useState("")
  const [carrier, setCarrier] = useState("")
  const { toast } = useToast()

  // Apply business logic for temperature assessment
  const tempRisk = transportTemperature
    ? TraceabilityLogic.assessTemperatureRisk(Number.parseFloat(transportTemperature))
    : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const logisticsData = {
      batchId,
      transportTemperature: Number.parseFloat(transportTemperature),
      deliveryDate,
      destination: destination || undefined,
      carrier: carrier || undefined,
    }

    // Use business logic for validation
    const validation = TraceabilityLogic.validateLogistics(logisticsData)

    if (!validation.isValid) {
      toast({
        title: "Error de validación",
        description: validation.errors.join(", "),
        variant: "destructive",
      })
      return
    }

    // Store in data layer
    dataStore.updateLogistics(batchId, logisticsData)

    const riskAssessment = TraceabilityLogic.assessTemperatureRisk(logisticsData.transportTemperature)

    toast({
      title: "Logística registrada",
      description: `Lote ${batchId} - ${riskAssessment.message}`,
      variant: riskAssessment.status === "risk" ? "destructive" : "default",
    })

    // Reset form
    setBatchId("")
    setTransportTemperature("")
    setDeliveryDate("")
    setDestination("")
    setCarrier("")

    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <CardTitle>Trazabilidad Hacia Adelante (Logística)</CardTitle>
        </div>
        <CardDescription>Registrar información de transporte y entrega</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logisticsBatchId">ID del Lote *</Label>
            <Input
              id="logisticsBatchId"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="MNG-240115-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature" className="flex items-center gap-2">
              <ThermometerSnowflake className="h-4 w-4" />
              Temperatura de Transporte (°C) *
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={transportTemperature}
              onChange={(e) => setTransportTemperature(e.target.value)}
              placeholder="10"
              required
            />
            {tempRisk && (
              <Alert
                variant={tempRisk.status === "risk" ? "destructive" : "default"}
                className={tempRisk.status === "warning" ? "border-secondary bg-secondary/10" : ""}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{tempRisk.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Fecha de Entrega *</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destino</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Supermercado Central, Ciudad"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier">Transportista</Label>
            <Input
              id="carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="Trans-Frío Express"
            />
          </div>

          <Button type="submit" className="w-full">
            Registrar Logística
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
