// ===========================
// PRESENTATION LAYER - Harvest Form Component
// ===========================

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Leaf, Sparkles } from "lucide-react"
import { dataStore } from "@/lib/data-layer"
import { TraceabilityLogic } from "@/lib/business-logic"
import { useToast } from "@/hooks/use-toast"

export function HarvestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const harvestData = {
      batchId,
      harvestDate,
      quantity: quantity ? Number.parseFloat(quantity) : undefined,
      location: location || undefined,
    }

    // Use business logic for validation
    const validation = TraceabilityLogic.validateHarvest(harvestData)

    if (!validation.isValid) {
      toast({
        title: "Error de validación",
        description: validation.errors.join(", "),
        variant: "destructive",
      })
      return
    }

    // Store in data layer
    dataStore.updateHarvest(batchId, harvestData)

    toast({
      title: "Registro exitoso",
      description: `Lote ${batchId} registrado correctamente`,
    })

    // Reset form
    setBatchId("")
    setHarvestDate("")
    setQuantity("")
    setLocation("")

    onSuccess?.()
  }

  const handleGenerateId = () => {
    const newId = TraceabilityLogic.generateBatchId()
    setBatchId(newId)
    toast({
      title: "ID generado",
      description: `Nuevo ID de lote: ${newId}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <CardTitle>Trazabilidad Hacia Atrás (Origen)</CardTitle>
        </div>
        <CardDescription>Registrar información de cosecha del lote</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchId">ID del Lote *</Label>
            <div className="flex gap-2">
              <Input
                id="batchId"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="MNG-240115-001"
                required
              />
              <Button type="button" variant="outline" size="icon" onClick={handleGenerateId}>
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvestDate">Fecha de Cosecha *</Label>
            <Input
              id="harvestDate"
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad (kg)</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Parcela A, Sector Norte"
            />
          </div>

          <Button type="submit" className="w-full">
            Registrar Cosecha
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
