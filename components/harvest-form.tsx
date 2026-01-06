"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Leaf, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveHarvestAction } from "@/app/actions" // Importamos la Server Action

export function HarvestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const { toast } = useToast()

  // Generamos el ID localmente para no importar lógica de servidor
  const generateBatchId = () => "MNG-" + Date.now()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { batchId, harvestDate, quantity: quantity ? parseFloat(quantity) : undefined, location }
    
    // Usamos la Server Action
    const validation = await saveHarvestAction(data)

    if (!validation.isValid) {
      toast({ title: "Error", description: validation.errors.join(", "), variant: "destructive" })
      return
    }

    toast({ title: "Éxito", description: `Lote ${batchId} guardado en SQLite` })
    setBatchId(""); setHarvestDate(""); setQuantity(""); setLocation("")
    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5" /> Origen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="ID del Lote" value={batchId} onChange={(e) => setBatchId(e.target.value)} required />
            <Button type="button" variant="outline" onClick={() => setBatchId(generateBatchId())}><Sparkles className="h-4 w-4" /></Button>
          </div>
          <Input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} required />
          <Input type="number" placeholder="Cantidad (kg)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Button type="submit" className="w-full">Registrar en DB</Button>
        </form>
      </CardContent>
    </Card>
  )
}