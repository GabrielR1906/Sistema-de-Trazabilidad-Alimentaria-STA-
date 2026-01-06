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

export type TraceabilityRecord = any; // Representa el modelo MangoBatch plano

export class DataLayer {
  static async getRecord(batchId: string) {
    return await prisma.mangoBatch.findUnique({ where: { batchId } })
  }

  static async getAllRecords() {
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