"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Package2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registerProcessing } from "@/app/actions" // Nombre actualizado

export function ProcessingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [qualityStatus, setQualityStatus] = useState("pending")
  const { toast } = useToast()

  async function clientAction(formData: FormData) {
    try {
      await registerProcessing(formData)
      toast({ title: "Éxito", description: "Procesamiento y Calidad actualizados" })
      if (onSuccess) onSuccess()
      setQualityStatus("pending")
    } catch (error) {
      toast({ title: "Error", description: "Error al actualizar el lote.", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5" /> Calidad y Procesamiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-4">
          <Input 
            name="batchId" 
            placeholder="ID del Lote a procesar" 
            required 
          />

          {/* Inputs ocultos para enviar valores fijos o del estado */}
          <input type="hidden" name="washingCompleted" value="true" />
          <input type="hidden" name="packagingCompleted" value="true" />
          {/* Este input oculto asegura que el valor del radio group viaje en el formData */}
          <input type="hidden" name="qualityStatus" value={qualityStatus} />

          <div className="space-y-2">
            <Label>Estado de Calidad</Label>
            <RadioGroup 
              value={qualityStatus} 
              onValueChange={setQualityStatus}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="pass" />
                <Label htmlFor="pass">Aprobado (Pass)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="fail" />
                <Label htmlFor="fail">Rechazado (Fail)</Label>
              </div>
            </RadioGroup>
          </div>

          <Input 
            name="temperature" 
            type="number" 
            placeholder="Temp. Procesamiento (°C)" 
            step="0.1"
          />
          
           <Input 
            name="duration" 
            type="number" 
            placeholder="Duración (minutos)" 
          />

          <Button type="submit" className="w-full">Actualizar Estado</Button>
        </form>
      </CardContent>
    </Card>
  )
}