'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- 1. ACCIÓN DE COSECHA ---
export async function registerHarvest(formData: FormData) {
  const batchId = formData.get("batchId") as string
  const quantity = Number(formData.get("quantity"))
  const location = formData.get("location") as string
  const harvestDateStr = formData.get("harvestDate") as string
  
  // Convertir fecha string a objeto Date
  const harvestDate = harvestDateStr ? new Date(harvestDateStr) : new Date()

  if (!batchId) throw new Error("El ID del lote es obligatorio")

  // Usamos upsert: si existe actualiza, si no crea.
  await prisma.mangoBatch.upsert({
    where: { batchId },
    update: {
      quantity,
      location,
      harvestDate
    },
    create: {
      batchId,
      quantity,
      location,
      harvestDate
    }
  })

  revalidatePath("/")
}

// --- 2. ACCIÓN DE PROCESAMIENTO ---
export async function registerProcessing(formData: FormData) {
  const batchId = formData.get("batchId") as string
  
  // Campos de calidad y proceso
  const qualityStatus = formData.get("qualityStatus") as string
  const washingCompleted = formData.get("washingCompleted") === "true"
  const packagingCompleted = formData.get("packagingCompleted") === "true"
  
  // Nuevos campos numéricos
  const temperature = Number(formData.get("temperature"))
  const duration = Number(formData.get("duration"))
  
  const processDate = new Date()

  await prisma.mangoBatch.update({
    where: { batchId },
    data: {
      qualityStatus,
      washingCompleted,
      packagingCompleted,
      processingTemperature: isNaN(temperature) ? null : temperature,
      processingDuration: isNaN(duration) ? null : duration,
      processingDate: processDate
    }
  })

  revalidatePath("/")
}

// --- 3. ACCIÓN DE LOGÍSTICA ---
export async function registerLogistics(formData: FormData) {
  const batchId = formData.get("batchId") as string
  const destination = formData.get("destination") as string
  const transportType = formData.get("transportType") as string
  const temp = Number(formData.get("transportTemperature"))
  
  const deliveryDateStr = formData.get("deliveryDate") as string
  const deliveryDate = deliveryDateStr ? new Date(deliveryDateStr) : new Date()

  await prisma.mangoBatch.update({
    where: { batchId },
    data: {
      destination,
      transportType,
      transportTemperature: isNaN(temp) ? null : temp,
      deliveryDate
    }
  })

  revalidatePath("/")
}

// --- 4. ACCIONES DE LECTURA (GET) ---

export async function getAllBatchesAction() {
  const batches = await prisma.mangoBatch.findMany({
    orderBy: { updatedAt: 'desc' }
  })
  return batches
}

export async function getBatchAction(batchId: string) {
  const batch = await prisma.mangoBatch.findUnique({
    where: { batchId }
  })
  return batch
}