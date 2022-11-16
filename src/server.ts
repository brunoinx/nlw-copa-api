import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';

import { userRoutes } from './routes/user';
import { gameRoutes } from './routes/game';
import { authRoutes } from './routes/auth';
import { poolRoutes } from './routes/pools';
import { guessRoutes } from './routes/guess';

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: 'nlwcopa',
  });

  await fastify.register(poolRoutes);
  await fastify.register(userRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(authRoutes);
  await fastify.register(guessRoutes);

  await fastify.listen({ port: 3333, host: '0.0.0.0' });
}

bootstrap();
