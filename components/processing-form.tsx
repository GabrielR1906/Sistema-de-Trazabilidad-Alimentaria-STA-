"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Package2 } from "lucide-react"
import { TraceabilityLogic } from "@/lib/business-logic"
import { useToast } from "@/hooks/use-toast"

export function ProcessingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [qualityStatus, setQualityStatus] = useState<"pass" | "fail" | "pending">("pending")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { batchId, washingCompleted: true, packagingCompleted: true, qualityStatus }
    const validation = await TraceabilityLogic.saveProcessing(data)

    if (!validation.isValid) {
      toast({ title: "Error", description: validation.errors.join(", "), variant: "destructive" })
      return
    }

    toast({ title: "Éxito", description: "Calidad registrada" })
    setBatchId(""); setQualityStatus("pending")
    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Package2 className="h-5 w-5" /> Calidad</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="ID del Lote" value={batchId} onChange={(e) => setBatchId(e.target.value)} required />
          <RadioGroup value={qualityStatus} onValueChange={(v: any) => setQualityStatus(v)}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="pass" id="p" /><Label htmlFor="p">Aprobado</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="fail" id="f" /><Label htmlFor="f">Rechazado</Label></div>
          </RadioGroup>
          <Button type="submit" className="w-full">Actualizar</Button>
        </form>
      </CardContent>
    </Card>
  )
}