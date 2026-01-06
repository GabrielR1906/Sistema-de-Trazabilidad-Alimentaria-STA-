// ===========================
// DATA LAYER (Capa de Datos)
// ===========================
// Simulates database operations with in-memory storage

export interface HarvestData {
  batchId: string
  harvestDate: string
  quantity?: number
  location?: string
}

export interface ProcessingData {
  batchId: string
  washingCompleted: boolean
  packagingCompleted: boolean
  qualityStatus: "pass" | "fail" | "pending"
  processingDate?: string
  notes?: string
}

export interface LogisticsData {
  batchId: string
  transportTemperature: number
  deliveryDate: string
  destination?: string
  carrier?: string
}

export interface TraceabilityRecord {
  batchId: string
  harvest?: HarvestData
  processing?: ProcessingData
  logistics?: LogisticsData
  createdAt: string
  updatedAt: string
}

// In-memory database simulation
class DataStore {
  private records: Map<string, TraceabilityRecord> = new Map()

  // Create or get a record
  getOrCreateRecord(batchId: string): TraceabilityRecord {
    if (!this.records.has(batchId)) {
      const now = new Date().toISOString()
      this.records.set(batchId, {
        batchId,
        createdAt: now,
        updatedAt: now,
      })
    }
    return this.records.get(batchId)!
  }

  // Update harvest data
  updateHarvest(batchId: string, data: HarvestData): void {
    const record = this.getOrCreateRecord(batchId)
    record.harvest = data
    record.updatedAt = new Date().toISOString()
  }

  // Update processing data
  updateProcessing(batchId: string, data: ProcessingData): void {
    const record = this.getOrCreateRecord(batchId)
    record.processing = data
    record.updatedAt = new Date().toISOString()
  }

  // Update logistics data
  updateLogistics(batchId: string, data: LogisticsData): void {
    const record = this.getOrCreateRecord(batchId)
    record.logistics = data
    record.updatedAt = new Date().toISOString()
  }

  // Get a specific record
  getRecord(batchId: string): TraceabilityRecord | null {
    return this.records.get(batchId) || null
  }

  // Get all records
  getAllRecords(): TraceabilityRecord[] {
    return Array.from(this.records.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }

  // Delete a record
  deleteRecord(batchId: string): boolean {
    return this.records.delete(batchId)
  }
}

// Singleton instance
export const dataStore = new DataStore()
