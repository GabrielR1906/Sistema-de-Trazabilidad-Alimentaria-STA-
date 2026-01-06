"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Leaf, Sparkles } from "lucide-react"
import { TraceabilityLogic } from "@/lib/business-logic" // Única conexión permitida
import { useToast } from "@/hooks/use-toast"

export function HarvestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const harvestData = {
      batchId,
      harvestDate,
      quantity: quantity ? parseFloat(quantity) : undefined,
      location: location || undefined,
    }

    // Llamada asíncrona a la Capa de Lógica
    const validation = await TraceabilityLogic.saveHarvest(harvestData)

    if (!validation.isValid) {
      toast({
        title: "Error de validación",
        description: validation.errors.join(", "),
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Registro exitoso",
      description: `Lote ${batchId} guardado en la base de datos`,
    })

    setBatchId(""); setHarvestDate(""); setQuantity(""); setLocation("")
    onSuccess?.()
  }

  const handleGenerateId = () => {
    setBatchId(TraceabilityLogic.generateBatchId())
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <CardTitle>Origen - Cosecha</CardTitle>
        </div>
        <CardDescription>Registrar información inicial del lote de mangos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchId">ID del Lote *</Label>
            <div className="flex gap-2">
              <Input id="batchId" value={batchId} onChange={(e) => setBatchId(e.target.value)} required />
              <Button type="button" variant="outline" size="icon" onClick={handleGenerateId} title="Generar ID">
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="harvestDate">Fecha de Cosecha *</Label>
            <Input id="harvestDate" type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad (kg)</Label>
            <Input id="quantity" type="number" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Parcela/Sector" />
          </div>
          <Button type="submit" className="w-full">Guardar en Base de Datos</Button>
        </form>
      </CardContent>
    </Card>
  )
}