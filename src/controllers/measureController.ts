import { FastifyRequest, FastifyReply } from "fastify";
import * as measureService from "../services/measureService";

export async function uploadMeasure(req: FastifyRequest, reply: FastifyReply) {
  try {
    const measure = await measureService.uploadMeasure(req.body as any);
    reply.status(200).send(measure);
  } catch (error: unknown) {
    reply
      .status(400)
      .send({
        error_code: "INVALID_DATA",
        error_description: (error as Error).message,
      });
  }
}

export async function confirmMeasure(req: FastifyRequest, reply: FastifyReply) {
  try {
    await measureService.confirmMeasure(
      (req.body as any).measure_uuid,
      (req.body as any).confirmed_value
    );
    reply.status(200).send({ success: true });
  } catch (error: unknown) {
    reply
      .status(400)
      .send({
        error_code: "INVALID_DATA",
        error_description: (error as Error).message,
      });
  }
}

interface ListMeasuresParams {
  customer_code: string;
}

interface ListMeasuresQuery {
  measure_type: string;
}

export async function listMeasures(
  req: FastifyRequest<{ Params: ListMeasuresParams; Query: ListMeasuresQuery }>,
  reply: FastifyReply
) {
  try {
    const measures = await measureService.listMeasures(
      req.params.customer_code,
      (req.query as ListMeasuresQuery).measure_type
    );
    reply
      .status(200)
      .send({ customer_code: req.params.customer_code, measures });
  } catch (error: unknown) {
    reply
      .status(404)
      .send({
        error_code: "MEASURES_NOT_FOUND",
        error_description: (error as Error).message,
      });
  }
}
