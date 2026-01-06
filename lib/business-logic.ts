// lib/business-logic.ts
import { DataLayer } from "./data-layer"
import type { HarvestData, ProcessingData, LogisticsData, TraceabilityRecord } from "./data-layer"

export class TraceabilityLogic {
  static async saveHarvest(data: HarvestData) {
    const validation = this.validateHarvest(data)
    if (validation.isValid) {
      await DataLayer.updateHarvest(data.batchId, data)
    }
    return validation
  }

  static async saveProcessing(data: ProcessingData) {
    const validation = this.validateProcessing(data)
    if (validation.isValid) {
      await DataLayer.updateProcessing(data.batchId, data)
    }
    return validation
  }

  static async saveLogistics(data: LogisticsData) {
    const validation = this.validateLogistics(data)
    if (validation.isValid) {
      await DataLayer.updateLogistics(data.batchId, data)
    }
    return validation
  }

  // ... (Mantén aquí tus funciones de validación, assessTemperatureRisk y generateBatchId)
  
  static validateHarvest(data: any) { /* Tu código actual */ return { isValid: true, errors: [] } }
  static validateProcessing(data: any) { /* Tu código actual */ return { isValid: true, errors: [] } }
  static validateLogistics(data: any) { /* Tu código actual */ return { isValid: true, errors: [] } }
  static generateBatchId() { return "MNG-" + Date.now() }
  static calculateCompletionPercentage(record: any) {
    let completed = 0;
    if (record.harvestDate) completed++;
    if (record.qualityStatus !== "pending") completed++;
    if (record.deliveryDate) completed++;
    return Math.round((completed / 3) * 100);
  }
}