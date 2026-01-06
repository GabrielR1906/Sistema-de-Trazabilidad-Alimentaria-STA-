// ===========================
// PRESENTATION LAYER - Processing Form Component
// ===========================

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Package2 } from "lucide-react"
import { dataStore } from "@/lib/data-layer"
import { TraceabilityLogic } from "@/lib/business-logic"
import { useToast } from "@/hooks/use-toast"

export function ProcessingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [washingCompleted, setWashingCompleted] = useState(false)
  const [packagingCompleted, setPackagingCompleted] = useState(false)
  const [qualityStatus, setQualityStatus] = useState<"pass" | "fail" | "pending">("pending")
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const processingData = {
      batchId,
      washingCompleted,
      packagingCompleted,
      qualityStatus,
      processingDate: new Date().toISOString(),
      notes: notes || undefined,
    }

    // Use business logic for validation
    const validation = TraceabilityLogic.validateProcessing(processingData)

    if (!validation.isValid) {
      toast({
        title: "Error de validación",
        description: validation.errors.join(", "),
        variant: "destructive",
      })
      return
    }

    // Store in data layer
    dataStore.updateProcessing(batchId, processingData)

    toast({
      title: "Procesamiento registrado",
      description: `Lote ${batchId} procesado - Estado: ${qualityStatus === "pass" ? "Aprobado" : "Rechazado"}`,
    })

    // Reset form
    setBatchId("")
    setWashingCompleted(false)
    setPackagingCompleted(false)
    setQualityStatus("pending")
    setNotes("")

    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-primary" />
          <CardTitle>Trazabilidad Interna (Transformación)</CardTitle>
        </div>
        <CardDescription>Registrar procesamiento y control de calidad</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="processingBatchId">ID del Lote *</Label>
            <Input
              id="processingBatchId"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="MNG-240115-001"
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Procesos Completados</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="washing"
                checked={washingCompleted}
                onCheckedChange={(checked) => setWashingCompleted(checked as boolean)}
              />
              <label htmlFor="washing" className="text-sm font-medium leading-none">
                Lavado completado
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="packaging"
                checked={packagingCompleted}
                onCheckedChange={(checked) => setPackagingCompleted(checked as boolean)}
              />
              <label htmlFor="packaging" className="text-sm font-medium leading-none">
                Empaquetado completado
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Control de Calidad *</Label>
            <RadioGroup value={qualityStatus} onValueChange={(value) => setQualityStatus(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="pass" />
                <Label htmlFor="pass" className="font-normal">
                  Aprobado
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="fail" />
                <Label htmlFor="fail" className="font-normal">
                  Rechazado
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Registrar Procesamiento
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
