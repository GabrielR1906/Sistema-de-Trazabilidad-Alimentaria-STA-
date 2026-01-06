// ===========================
// PRESENTATION LAYER - Batch Search Component
// ===========================

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { dataStore } from "@/lib/data-layer"
import { TraceabilityTimeline } from "./traceability-timeline"
import { useToast } from "@/hooks/use-toast"

export function BatchSearch() {
  const [searchId, setSearchId] = useState("")
  const [foundRecord, setFoundRecord] = useState<ReturnType<typeof dataStore.getRecord> | null>(null)
  const { toast } = useToast()

  const handleSearch = () => {
    if (!searchId.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese un ID de lote",
        variant: "destructive",
      })
      return
    }

    const record = dataStore.getRecord(searchId)

    if (!record) {
      toast({
        title: "No encontrado",
        description: `No se encontró el lote ${searchId}`,
        variant: "destructive",
      })
      setFoundRecord(null)
      return
    }

    setFoundRecord(record)
    toast({
      title: "Lote encontrado",
      description: `Mostrando información del lote ${searchId}`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Buscar Lote</CardTitle>
          <CardDescription>Ingrese el ID del lote para ver su historial completo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="MNG-240115-001"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {foundRecord && <TraceabilityTimeline record={foundRecord} />}
    </div>
  )
}
