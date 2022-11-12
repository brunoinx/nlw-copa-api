import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();

    return { count };
  });

  fastify.post("/pools", async (request, reply) => {
    const createPoolSchema = z.object({
      title: z
        .string({
          required_error: "O titulo é obrigatório",
        })
        .min(3, { message: "Precisa ter pelo menos três caracteres." }),
    });

    const { title } = createPoolSchema.parse(request.body);

    const generateId = new ShortUniqueId({ length: 6 });
    const code = String(generateId()).toUpperCase();

    try {
      await request.jwtVerify();

      // se chegar aqui sem dar erro!
      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub
            }
          }
        },
      });
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code,
        },
      });
    }

    return reply.status(201).send({ code });
  });
}
