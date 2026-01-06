// ===========================
// LOGIC LAYER (Capa de Lógica)
// ===========================
// Contains business rules and validation

import type { HarvestData, ProcessingData, LogisticsData } from "./data-layer"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface TemperatureRiskAssessment {
  status: "optimal" | "warning" | "risk"
  message: string
  temperature: number
}

// Business Logic Functions
export class TraceabilityLogic {
  // Validate harvest data
  static validateHarvest(data: HarvestData): ValidationResult {
    const errors: string[] = []

    if (!data.batchId || data.batchId.trim().length === 0) {
      errors.push("El ID del lote es requerido")
    }

    if (!data.harvestDate) {
      errors.push("La fecha de cosecha es requerida")
    } else {
      const harvestDate = new Date(data.harvestDate)
      const today = new Date()
      if (harvestDate > today) {
        errors.push("La fecha de cosecha no puede ser futura")
      }
    }

    if (data.quantity !== undefined && data.quantity <= 0) {
      errors.push("La cantidad debe ser mayor a 0")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Validate processing data
  static validateProcessing(data: ProcessingData): ValidationResult {
    const errors: string[] = []

    if (!data.batchId || data.batchId.trim().length === 0) {
      errors.push("El ID del lote es requerido")
    }

    if (!data.qualityStatus || data.qualityStatus === "pending") {
      errors.push("El estado de calidad debe ser especificado (Aprobado o Rechazado)")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Validate logistics data with temperature business rule
  static validateLogistics(data: LogisticsData): ValidationResult {
    const errors: string[] = []

    if (!data.batchId || data.batchId.trim().length === 0) {
      errors.push("El ID del lote es requerido")
    }

    if (data.transportTemperature === undefined || data.transportTemperature === null) {
      errors.push("La temperatura de transporte es requerida")
    }

    if (!data.deliveryDate) {
      errors.push("La fecha de entrega es requerida")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Business Rule: Assess temperature risk
  // Rule: Temperature > 12°C marks as "Risk"
  static assessTemperatureRisk(temperature: number): TemperatureRiskAssessment {
    if (temperature <= 8) {
      return {
        status: "optimal",
        message: "Temperatura óptima para conservación",
        temperature,
      }
    } else if (temperature > 8 && temperature <= 12) {
      return {
        status: "warning",
        message: "Temperatura aceptable, monitorear de cerca",
        temperature,
      }
    } else {
      return {
        status: "risk",
        message: "RIESGO: Temperatura excede el límite recomendado (>12°C)",
        temperature,
      }
    }
  }

  // Calculate completion percentage
  static calculateCompletionPercentage(record: {
    harvest?: unknown
    processing?: unknown
    logistics?: unknown
  }): number {
    let completed = 0
    if (record.harvest) completed++
    if (record.processing) completed++
    if (record.logistics) completed++
    return Math.round((completed / 3) * 100)
  }

  // Generate batch ID suggestion
  static generateBatchId(): string {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `MNG-${year}${month}${day}-${random}`
  }
}
