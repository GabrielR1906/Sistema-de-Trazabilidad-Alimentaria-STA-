"use client"

import { useEffect, useState } from "react"
import { TraceabilityLogic } from "@/lib/business-logic"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function AllBatchesView() {
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await TraceabilityLogic.getAllBatches()
      setRecords(data)
    }
    fetchData()
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lote ID</TableHead>
          <TableHead>Cosecha</TableHead>
          <TableHead>Calidad</TableHead>
          <TableHead>Temp.</TableHead>
          <TableHead>Progreso</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((r) => (
          <TableRow key={r.batchId}>
            <TableCell className="font-medium">{r.batchId}</TableCell>
            <TableCell>{r.harvestDate || "---"}</TableCell>
            <TableCell>
              <Badge variant={r.qualityStatus === "pass" ? "default" : "outline"}>{r.qualityStatus}</Badge>
            </TableCell>
            <TableCell>{r.transportTemperature ? `${r.transportTemperature}°C` : "---"}</TableCell>
            <TableCell>{TraceabilityLogic.calculateCompletionPercentage(r)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}