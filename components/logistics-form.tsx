"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Truck, ThermometerSnowflake, AlertTriangle } from "lucide-react"
import { TraceabilityLogic } from "@/lib/business-logic"
import { useToast } from "@/hooks/use-toast"

export function LogisticsForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [transportTemperature, setTransportTemperature] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [destination, setDestination] = useState("")
  const { toast } = useToast()

  const tempRisk = transportTemperature 
    ? TraceabilityLogic.assessTemperatureRisk(parseFloat(transportTemperature)) 
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const logisticsData = {
      batchId,
      transportTemperature: parseFloat(transportTemperature),
      deliveryDate,
      destination: destination || undefined,
    }

    const validation = await TraceabilityLogic.saveLogistics(logisticsData)

    if (!validation.isValid) {
      toast({ title: "Error", description: validation.errors.join(", "), variant: "destructive" })
      return
    }

    toast({
      title: "Logística completada",
      description: `Lote ${batchId} listo para entrega. ${tempRisk?.message}`,
      variant: tempRisk?.status === "risk" ? "destructive" : "default"
    })

    setBatchId(""); setTransportTemperature(""); setDeliveryDate(""); setDestination("")
    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <CardTitle>Logística - Distribución</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lBatchId">ID del Lote *</Label>
            <Input id="lBatchId" value={batchId} onChange={(e) => setBatchId(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label className="flex gap-2 items-center"><ThermometerSnowflake className="h-4 w-4" /> Temperatura (°C) *</Label>
            <Input id="temp" type="number" step="0.1" value={transportTemperature} onChange={(e) => setTransportTemperature(e.target.value)} required />
            {tempRisk && (
              <Alert variant={tempRisk.status === "risk" ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{tempRisk.message}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery">Fecha de Entrega *</Label>
            <Input id="delivery" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Completar Trazabilidad</Button>
        </form>
      </CardContent>
    </Card>
  )
}