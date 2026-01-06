"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TraceabilityLogic, TraceabilityRecord } from "@/lib/business-logic"
import { getAllBatchesAction } from "@/app/actions" 

export function AllBatchesView() {
  const [records, setRecords] = useState<TraceabilityRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBatchesAction()
        setRecords(data)
      } catch (error) {
        console.error("Error cargando lotes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="text-center py-4">Cargando datos...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lote ID</TableHead>
            <TableHead>Cosecha</TableHead>
            <TableHead>Calidad</TableHead>
            <TableHead>Temp.</TableHead>
            <TableHead className="text-right">Progreso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No hay registros encontrados.
              </TableCell>
            </TableRow>
          ) : (
            records.map((r) => (
              <TableRow key={r.batchId}>
                <TableCell className="font-medium">{r.batchId}</TableCell>
                <TableCell>{r.harvestDate || "---"}</TableCell>
                <TableCell>
                  <Badge variant={r.qualityStatus === "pass" ? "default" : "outline"}>
                    {r.qualityStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  {r.transportTemperature ? `${r.transportTemperature}°C` : "---"}
                </TableCell>
                <TableCell className="text-right">
                  {TraceabilityLogic.calculateCompletionPercentage(r)}%
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}