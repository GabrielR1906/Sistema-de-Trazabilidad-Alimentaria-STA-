// ===========================
// DATA LAYER (Capa de Datos)
// ===========================

import { prisma } from "./prisma"
import type { HarvestData, ProcessingData, LogisticsData } from "./data-layer"

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


export class DataLayer {
  static async getRecord(batchId: string) {
    return await prisma.mangoBatch.findUnique({ where: { batchId } })
  }

  static async getAllRecords() {
    return await prisma.mangoBatch.findMany({
      orderBy: { updatedAt: 'desc' }
    })
  }

  static async updateHarvest(batchId: string, data: any) {
    return await prisma.mangoBatch.upsert({
      where: { batchId },
      update: { ...data },
      create: { batchId, ...data }
    })
  }

  static async updateProcessing(batchId: string, data: any) {
    return await prisma.mangoBatch.update({
      where: { batchId },
      data: { ...data }
    })
  }

  static async updateLogistics(batchId: string, data: any) {
    return await prisma.mangoBatch.update({
      where: { batchId },
      data: { ...data }
    })
  }
}