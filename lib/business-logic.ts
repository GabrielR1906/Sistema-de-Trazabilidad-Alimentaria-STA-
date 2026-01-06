import { prisma } from "./prisma"

// --- Interfaces de Datos (Coinciden con lo que envían los formularios) ---
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

// --- Interfaz del Registro Completo (Coincide con Prisma Schema) ---
export interface TraceabilityRecord {
  batchId: string
  harvestDate: string | null
  quantity: number | null
  location: string | null
  washingCompleted: boolean
  packagingCompleted: boolean
  qualityStatus: string
  processingDate: string | null
  notes: string | null
  transportTemperature: number | null
  deliveryDate: string | null
  destination: string | null
  carrier: string | null
  createdAt: Date
  updatedAt: Date
}

// --- Lógica de Negocio y Cálculos ---
export class TraceabilityLogic {
  // Calcula el porcentaje de avance basado en los campos llenos
  static calculateCompletionPercentage(record: TraceabilityRecord): number {
    let completed = 0;
    // Paso 1: Cosecha
    if (record.harvestDate) completed++;
    // Paso 2: Calidad (si ya no está pendiente)
    if (record.qualityStatus !== "pending") completed++;
    // Paso 3: Entrega
    if (record.deliveryDate) completed++;
    
    // Retorna porcentaje (0, 33, 66 o 100)
    return Math.round((completed / 3) * 100);
  }
}

// --- Capa de Acceso a Datos (Data Access Layer) ---
export class DataLayer {
  static async getRecord(batchId: string): Promise<TraceabilityRecord | null> {
    return await prisma.mangoBatch.findUnique({ where: { batchId } })
  }

  static async getAllRecords(): Promise<TraceabilityRecord[]> {
    return await prisma.mangoBatch.findMany({ orderBy: { updatedAt: 'desc' } })
  }
}