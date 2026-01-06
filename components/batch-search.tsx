"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { TraceabilityTimeline } from "./traceability-timeline"
import { getBatchAction } from "@/app/actions"
import { TraceabilityRecord } from "@/lib/business-logic"

export function BatchSearch() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<TraceabilityRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    setHasSearched(true)
    setResult(null)
    
    try {
      const data = await getBatchAction(query)
      setResult(data)
    } catch (error) {
      console.error("Error buscando lote:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="flex gap-2">
        <Input 
          placeholder="Buscar por ID (ej: MNG-1709...)" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {result ? (
        <TraceabilityTimeline record={result} />
      ) : (
        hasSearched && !loading && (
          <div className="text-center text-muted-foreground py-8">
            No se encontró ningún lote con el ID "{query}".
          </div>
        )
      )}
    </div>
  )
}