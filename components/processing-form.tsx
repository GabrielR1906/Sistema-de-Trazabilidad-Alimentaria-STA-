"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Package2 } from "lucide-react"
import { TraceabilityLogic } from "@/lib/business-logic"
import { useToast } from "@/hooks/use-toast"

export function ProcessingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [washingCompleted, setWashingCompleted] = useState(false)
  const [packagingCompleted, setPackagingCompleted] = useState(false)
  const [qualityStatus, setQualityStatus] = useState<"pass" | "fail" | "pending">("pending")
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const processingData = {
      batchId,
      washingCompleted,
      packagingCompleted,
      qualityStatus,
      processingDate: new Date().toISOString(),
      notes: notes || undefined,
    }

    const validation = await TraceabilityLogic.saveProcessing(processingData)

    if (!validation.isValid) {
      toast({ title: "Error", description: validation.errors.join(", "), variant: "destructive" })
      return
    }

    toast({ title: "Procesamiento registrado", description: `Estado del lote ${batchId} actualizado` })
    setBatchId(""); setWashingCompleted(false); setPackagingCompleted(false); setQualityStatus("pending"); setNotes("")
    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-primary" />
          <CardTitle>Transformación - Procesamiento</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pBatchId">ID del Lote *</Label>
            <Input id="pBatchId" value={batchId} onChange={(e) => setBatchId(e.target.value)} required />
          </div>
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="washing" checked={washingCompleted} onCheckedChange={(c) => setWashingCompleted(!!c)} />
              <label htmlFor="washing" className="text-sm font-medium">Lavado</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="packaging" checked={packagingCompleted} onCheckedChange={(c) => setPackagingCompleted(!!c)} />
              <label htmlFor="packaging" className="text-sm font-medium">Empaquetado</label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Control de Calidad *</Label>
            <RadioGroup value={qualityStatus} onValueChange={(v) => setQualityStatus(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="pass" /><Label htmlFor="pass">Aprobado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="fail" /><Label htmlFor="fail">Rechazado</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full">Actualizar Registro</Button>
        </form>
      </CardContent>
    </Card>
  )
}