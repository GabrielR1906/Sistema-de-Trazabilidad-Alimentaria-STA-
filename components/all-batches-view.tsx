"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAllBatchesAction } from "@/app/actions" // Importamos la Server Action

// Definimos la función auxiliar aquí para evitar importar el archivo de lógica del servidor
function calculateCompletionPercentage(record: any) {
  let completed = 0;
  if (record.harvestDate) completed++;
  if (record.qualityStatus !== "pending") completed++;
  if (record.deliveryDate) completed++;
  return Math.round((completed / 3) * 100);
}

export function AllBatchesView() {
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      // Usamos la Server Action
      const data = await getAllBatchesAction()
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
            <TableCell>{calculateCompletionPercentage(r)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}