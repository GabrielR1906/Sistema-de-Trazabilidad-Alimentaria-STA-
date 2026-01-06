"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registerLogistics } from "@/app/actions" // Nombre actualizado

export function LogisticsForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()

  async function clientAction(formData: FormData) {
    try {
      await registerLogistics(formData)
      toast({ title: "Éxito", description: "Logística y envío registrados." })
      if (onSuccess) onSuccess()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo registrar la logística.", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" /> Logística
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-4">
          <Input 
            name="batchId" 
            placeholder="ID del Lote" 
            required 
          />
          
          <Input 
            name="destination" 
            placeholder="Destino Final" 
            required 
          />
          
          <Input 
            name="transportType" 
            placeholder="Tipo de Transporte (Ej: Camión)" 
          />

          <Input 
            name="transportTemperature" 
            type="number" 
            step="0.1" 
            placeholder="Temperatura Transporte (°C)" 
            required 
          />
          
          <Input 
            name="deliveryDate" 
            type="date" 
            required 
          />
          
          <Button type="submit" className="w-full">Finalizar Envío</Button>
        </form>
      </CardContent>
    </Card>
  )
}