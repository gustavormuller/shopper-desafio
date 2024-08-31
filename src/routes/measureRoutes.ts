import { FastifyInstance } from 'fastify';
import * as measureController from '../controllers/measureController';

export async function measureRoutes(app: FastifyInstance) {
  app.post('/upload', measureController.uploadMeasure);
  app.patch('/confirm', measureController.confirmMeasure);
  app.get('/:customer_code/list', measureController.listMeasures);
}
