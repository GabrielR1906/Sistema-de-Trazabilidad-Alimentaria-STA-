"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { TraceabilityLogic } from "@/lib/business-logic"
import { TraceabilityTimeline } from "./traceability-timeline"

export function BatchSearch() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    const data = await TraceabilityLogic.getBatch(query)
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input placeholder="Buscar por ID (ej: MNG-240115-001)" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
        </Button>
      </div>
      {result ? <TraceabilityTimeline record={result} /> : query && !loading && <p>No se encontró el lote.</p>}
    </div>
  )
}