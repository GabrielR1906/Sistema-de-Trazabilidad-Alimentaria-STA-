// lib/data-layer.ts
import { prisma } from "./prisma"

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
  qualityStatus: string
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

// Interfaz plana que coincide con schema.prisma
export interface TraceabilityRecord {
  batchId: string
  harvestDate?: string | null
  quantity?: number | null
  location?: string | null
  washingCompleted: boolean
  packagingCompleted: boolean
  qualityStatus: string
  processingDate?: string | null
  notes?: string | null
  transportTemperature?: number | null
  deliveryDate?: string | null
  destination?: string | null
  carrier?: string | null
  createdAt: Date
  updatedAt: Date
}

export class DataLayer {
  static async getRecord(batchId: string): Promise<TraceabilityRecord | null> {
    return await prisma.mangoBatch.findUnique({ where: { batchId } })
  }

  static async getAllRecords(): Promise<TraceabilityRecord[]> {
    return await prisma.mangoBatch.findMany({ orderBy: { updatedAt: 'desc' } })
  }

  static async updateHarvest(batchId: string, data: HarvestData) {
    return await prisma.mangoBatch.upsert({
      where: { batchId },
      update: { ...data },
      create: { batchId, ...data }
    })
  }

  static async updateProcessing(batchId: string, data: ProcessingData) {
    return await prisma.mangoBatch.update({ where: { batchId }, data })
  }

  static async updateLogistics(batchId: string, data: LogisticsData) {
    return await prisma.mangoBatch.update({ where: { batchId }, data })
  }
}