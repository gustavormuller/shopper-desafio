import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../database/prismaClient';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function uploadMeasure(data: { image: string; customer_code: string; measure_datetime: string; measure_type: string }) {
  try {
    // Passo 1: Upload da imagem
    const uploadResponse = await genAI.uploadFile({
      file: {
        content: data.image,
        mimeType: 'image/jpeg', // Ajuste conforme o tipo da imagem
      },
    });

    // Passo 2: Geração do conteúdo
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: 'Identify if this is a water or gas bill.' },
    ]);

    const measureValue = result.response.text().match(/\d+/)[0];
    const measureType = /water/i.test(result.response.text()) ? 'WATER' : 'GAS';

    const measure = await prisma.measure.create({
      data: {
        customer_code: data.customer_code,
        measure_datetime: new Date(data.measure_datetime),
        measure_type: measureType,
        image_url: uploadResponse.file.uri,
        measure_value: parseInt(measureValue),
        measure_uuid: result.response.uuid,
        has_confirmed: false,
      },
    });

    return measure;
  } catch (error) {
    console.error(`Erro ao processar a imagem com Gemini: ${(error as Error).message}`);
    throw new Error(`Erro ao processar a imagem com Gemini: ${(error as Error).message}`);
  }
}


export function confirmMeasure(measure_uuid: any, confirmed_value: any) {
    throw new Error("Function not implemented.");
}

export function listMeasures(customer_code: string, measure_type: string) {
    throw new Error("Function not implemented.");
}

