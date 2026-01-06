"use server"

import { TraceabilityLogic } from "@/lib/business-logic"
import { HarvestData, ProcessingData, LogisticsData } from "@/lib/data-layer"

// Envolvemos las llamadas a la lógica de negocio en Server Actions

export async function saveHarvestAction(data: HarvestData) {
  return await TraceabilityLogic.saveHarvest(data)
}

export async function saveProcessingAction(data: ProcessingData) {
  return await TraceabilityLogic.saveProcessing(data)
}

export async function saveLogisticsAction(data: LogisticsData) {
  return await TraceabilityLogic.saveLogistics(data)
}