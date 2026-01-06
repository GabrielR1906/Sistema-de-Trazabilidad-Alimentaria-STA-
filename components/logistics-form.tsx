"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveLogisticsAction } from "@/app/actions" // Importamos la Server Action

export function LogisticsForm({ onSuccess }: { onSuccess?: () => void }) {
  const [batchId, setBatchId] = useState("")
  const [temp, setTemp] = useState("")
  const [date, setDate] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { batchId, transportTemperature: parseFloat(temp), deliveryDate: date }
    
    // Usamos la Server Action
    const validation = await saveLogisticsAction(data)

    if (!validation.isValid) {
      toast({ title: "Error", description: validation.errors.join(", "), variant: "destructive" })
      return
    }

    toast({ title: "Éxito", description: "Logística completada" })
    setBatchId(""); setTemp(""); setDate("")
    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" /> Logística</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="ID del Lote" value={batchId} onChange={(e) => setBatchId(e.target.value)} required />
          <Input type="number" placeholder="Temperatura (°C)" value={temp} onChange={(e) => setTemp(e.target.value)} required />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Button type="submit" className="w-full">Finalizar</Button>
        </form>
      </CardContent>
    </Card>
  )
}