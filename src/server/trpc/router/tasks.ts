import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const tasksRouter = router({
  create: protectedProcedure.mutation(async ({ ctx, input }) => {
    const tasksInProgress = await ctx.prisma.task.count({
      where: {
        userId: ctx.session.user.id,
        status: "WAITING",
      },
    });

    if (tasksInProgress > 0) return;

    await ctx.prisma.task.create({
      data: {
        userId: ctx.session.user.id,
        status: "WAITING",
      },
    });
  }),
  working: protectedProcedure.query(async ({ ctx }) => {
    const tasksInProgress = await ctx.prisma.task.count({
      where: {
        userId: ctx.session.user.id,
        status: "WAITING",
      },
    });

    return tasksInProgress > 0;
  }),
});
