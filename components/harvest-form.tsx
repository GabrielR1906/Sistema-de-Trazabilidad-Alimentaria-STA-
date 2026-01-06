"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Leaf, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registerHarvest } from "@/app/actions" // Asegúrate que coincida con el nombre en actions.ts

export function HarvestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const { toast } = useToast()

  const generateBatchId = () => {
    const newId = "MNG-" + Date.now()
    setBatchId(newId)
  }

  // Wrapper para manejar la respuesta si la acción no hace redirect
  async function clientAction(formData: FormData) {
    try {
      await registerHarvest(formData)
      toast({ title: "Éxito", description: `Lote ${formData.get("batchId")} registrado correctamente.` })
      if (onSuccess) onSuccess()
      // Limpiar campos si es necesario
      setBatchId("")
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Hubo un problema al registrar la cosecha. Revisa los datos.", 
        variant: "destructive" 
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5" /> Origen
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Usamos clientAction para interceptar y mostrar toast, o puedes poner action={registerHarvest} directamente */}
        <form action={clientAction} className="space-y-4">
          <div className="flex gap-2">
            <Input 
              name="batchId" 
              placeholder="ID del Lote" 
              value={batchId} 
              onChange={(e) => setBatchId(e.target.value)} 
              required 
            />
            <Button type="button" variant="outline" onClick={generateBatchId}>
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          
          <Input 
            name="harvestDate" 
            type="date" 
            required 
          />
          
          <Input 
            name="quantity" 
            type="number" 
            step="0.01" 
            placeholder="Cantidad (kg)" 
          />
          
          <Input 
            name="location" 
            placeholder="Ubicación / Finca" 
          />

          <Button type="submit" className="w-full">Registrar en DB</Button>
        </form>
      </CardContent>
    </Card>
  )
}