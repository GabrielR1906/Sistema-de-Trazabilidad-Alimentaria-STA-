// lib/data-layer.ts
import { prisma } from "./prisma"

// --- Interfaces ---
export interface HarvestData {
  batchId: string
  harvestDate: Date
  quantity: number
  location: string
}

export interface ProcessingData {
  batchId: string
  washingCompleted: boolean
  packagingCompleted: boolean
  qualityStatus: string
  processingDate?: Date
  processingTemperature?: number | null 
  processingDuration?: number | null
  notes?: string
}

export interface LogisticsData {
  batchId: string
  transportTemperature: number
  deliveryDate: Date
  destination: string
  transportType?: string | null
  carrier?: string
}

export interface TraceabilityRecord {
  batchId: string
  harvestDate: Date | null
  quantity: number | null
  location: string | null
  
  washingCompleted: boolean
  packagingCompleted: boolean
  qualityStatus: string
  processingDate: Date | null
  processingTemperature: number | null
  processingDuration: number | null
  notes: string | null
  
  transportTemperature: number | null
  deliveryDate: Date | null
  destination: string | null
  transportType: string | null
  carrier: string | null
  
  createdAt: Date
  updatedAt: Date
}

// --- Clase DataLayer Corregida ---
export class DataLayer {
  static async getRecord(batchId: string): Promise<TraceabilityRecord | null> {
    return await prisma.mangoBatch.findUnique({ where: { batchId } })
  }

  static async getAllRecords(): Promise<TraceabilityRecord[]> {
    return await prisma.mangoBatch.findMany({ orderBy: { updatedAt: 'desc' } })
  }

  // CORRECCIÓN AQUÍ: Evitamos duplicar batchId y lo quitamos del update
  static async updateHarvest(batchId: string, data: HarvestData) {
    // Sepamos el ID del resto de datos para no intentar actualizar la PK
    const { batchId: _, ...dataWithoutId } = data
    
    return await prisma.mangoBatch.upsert({
      where: { batchId },
      update: dataWithoutId, // Actualizamos solo los datos
      create: data           // Creamos con todos los datos (incluido ID)
    })
  }

  static async updateProcessing(batchId: string, data: ProcessingData) {
    // Quitamos batchId de los datos a actualizar para evitar conflictos
    const { batchId: _, ...dataWithoutId } = data
    return await prisma.mangoBatch.update({ 
      where: { batchId }, 
      data: dataWithoutId 
    })
  }

  static async updateLogistics(batchId: string, data: LogisticsData) {
    const { batchId: _, ...dataWithoutId } = data
    return await prisma.mangoBatch.update({ 
      where: { batchId }, 
      data: dataWithoutId 
    })
  }
}