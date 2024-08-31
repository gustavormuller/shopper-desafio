import prisma from '../database/prismaClient';
import { MeasureType } from '../models/enums';

export async function uploadMeasure(data: any) {
  if (!Object.values(MeasureType).includes(data.measure_type)) {
    throw new Error("Tipo de medição inválido");
  }

  const existingMeasure = await prisma.measure.findFirst({
    where: {
      customer_code: data.customer_code,
      measure_type: data.measure_type,
      measure_datetime: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }
  });

  if (existingMeasure) {
    throw new Error("Leitura do mês já realizada");
  }

  return await prisma.measure.create({
    data: {
      customer_code: data.customer_code,
      measure_datetime: data.measure_datetime,
      measure_type: data.measure_type,
      measure_value: data.measure_value,
      image_url: data.image_url,
    }
  });
}

export async function confirmMeasure(uuid: string, value: number) {
  const measure = await prisma.measure.findUnique({
    where: { id: uuid }
  });

  if (!measure) {
    throw new Error("Leitura não encontrada");
  }

  if (measure.has_confirmed) {
    throw new Error("Leitura já confirmada");
  }

  return await prisma.measure.update({
    where: { id: uuid },
    data: {
      measure_value: value,
      has_confirmed: true
    }
  });
}

export async function listMeasures(customer_code: string, measure_type?: string) {
  const filters: any = { customer_code };

  if (measure_type) {
    filters.measure_type = measure_type.toUpperCase();
  }

  const measures = await prisma.measure.findMany({ where: filters });

  if (measures.length === 0) {
    throw new Error("Nenhuma leitura encontrada");
  }

  return measures;
}
