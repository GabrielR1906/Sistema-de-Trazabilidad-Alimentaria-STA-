// ===========================
// LOGIC LAYER (Capa de Lógica)
// ===========================
// Contiene reglas de negocio, validaciones y coordina la persistencia

import { DataLayer } from "./data-layer"; // Importamos la capa de datos
import type { HarvestData, ProcessingData, LogisticsData, TraceabilityRecord } from "./data-layer";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface TemperatureRiskAssessment {
  status: "optimal" | "warning" | "risk";
  message: string;
  temperature: number;
}

export class TraceabilityLogic {
  
  // --- MÉTODOS DE PERSISTENCIA (NUEVOS) ---
  // Estos métodos permiten que la capa de presentación no toque la base de datos directamente

  static async getBatch(batchId: string): Promise<TraceabilityRecord | null> {
    // Aquí podrías añadir lógica adicional, como registrar quién consultó el dato
    return await DataLayer.getRecord(batchId);
  }

  static async getAllBatches(): Promise<TraceabilityRecord[]> {
    return await DataLayer.getAllRecords();
  }

  static async saveHarvest(data: HarvestData): Promise<ValidationResult> {
    const validation = this.validateHarvest(data);
    if (validation.isValid) {
      // Si es válido, la Lógica ordena a la Capa de Datos guardar
      await DataLayer.updateHarvest(data.batchId, data);
    }
    return validation;
  }

  static async saveProcessing(data: ProcessingData): Promise<ValidationResult> {
    const validation = this.validateProcessing(data);
    if (validation.isValid) {
      await DataLayer.updateProcessing(data.batchId, data);
    }
    return validation;
  }

  static async saveLogistics(data: LogisticsData): Promise<ValidationResult> {
    const validation = this.validateLogistics(data);
    if (validation.isValid) {
      await DataLayer.updateLogistics(data.batchId, data);
    }
    return validation;
  }

  // --- MÉTODOS DE VALIDACIÓN (EXISTENTES) ---

  static validateHarvest(data: HarvestData): ValidationResult {
    const errors: string[] = [];

    if (!data.batchId || data.batchId.trim().length === 0) {
      errors.push("El ID del lote es requerido");
    }

    if (!data.harvestDate) {
      errors.push("La fecha de cosecha es requerida");
    } else {
      const harvestDate = new Date(data.harvestDate);
      const today = new Date();
      if (harvestDate > today) {
        errors.push("La fecha de cosecha no puede ser futura");
      }
    }

    if (data.quantity !== undefined && data.quantity <= 0) {
      errors.push("La cantidad debe ser mayor a 0");
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateProcessing(data: ProcessingData): ValidationResult {
    const errors: string[] = [];
    if (!data.batchId || data.batchId.trim().length === 0) {
      errors.push("El ID del lote es requerido");
    }
    if (!data.qualityStatus || data.qualityStatus === "pending") {
      errors.push("El estado de calidad debe ser especificado (Aprobado o Rechazado)");
    }
    return { isValid: errors.length === 0, errors };
  }

  static validateLogistics(data: LogisticsData): ValidationResult {
    const errors: string[] = [];
    if (!data.batchId || data.batchId.trim().length === 0) {
      errors.push("El ID del lote es requerido");
    }
    if (data.transportTemperature === undefined || data.transportTemperature === null) {
      errors.push("La temperatura de transporte es requerida");
    }
    if (!data.deliveryDate) {
      errors.push("La fecha de entrega es requerida");
    }
    return { isValid: errors.length === 0, errors };
  }

  // --- REGLAS DE NEGOCIO Y UTILITARIOS ---

  static assessTemperatureRisk(temperature: number): TemperatureRiskAssessment {
    if (temperature <= 8) {
      return { status: "optimal", message: "Temperatura óptima para conservación", temperature };
    } else if (temperature > 8 && temperature <= 12) {
      return { status: "warning", message: "Temperatura aceptable, monitorear de cerca", temperature };
    } else {
      return { status: "risk", message: "RIESGO: Temperatura excede el límite recomendado (>12°C)", temperature };
    }
  }

  static calculateCompletionPercentage(record: any): number {
    let completed = 0;
    if (record.harvestDate) completed++; // Ajustado según campos de base de datos
    if (record.qualityStatus !== "pending") completed++;
    if (record.deliveryDate) completed++;
    return Math.round((completed / 3) * 100);
  }

  static generateBatchId(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `MNG-${year}${month}${day}-${random}`;
  }
}