import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { campaigns } from "~/server/db/schema";

export const campaignRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      name: z.string().min(1), 
      description: z.string().min(1),
      budget: z.number(),
      businessId: z.number(),
      targetAudience: z.string().optional(),
      goals: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(campaigns).values({
        name: input.name,
        description: input.description,
        budget: input.budget.toString(),
        businessId: input.businessId,
        targetAudience: input.targetAudience,
        goals: input.goals,
        startDate: input.startDate,
        endDate: input.endDate,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.campaigns.findFirst({
      orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)],
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.campaigns.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.campaigns.findFirst({
        where: (campaigns, { eq }) => eq(campaigns.id, input.id),
      });
    }),
});
