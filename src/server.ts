import fastify, { FastifyInstance } from 'fastify';
import { measureRoutes } from './routes/measureRoutes';
import dotenv from 'dotenv';

// Carregando variáveis de ambiente
dotenv.config();

const app: FastifyInstance = fastify({ logger: true });

app.register(measureRoutes);

const PORT = process.env.PORT || 3000;

app.listen({ port: Number(PORT) }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
