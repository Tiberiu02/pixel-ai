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
  status: protectedProcedure.query(async ({ ctx }) => {
    const tasksCompleted = await ctx.prisma.task.count({
      where: {
        userId: ctx.session.user.id,
        status: "DONE",
      },
    });
    const tasksInProgress = await ctx.prisma.task.count({
      where: {
        userId: ctx.session.user.id,
        status: "WAITING",
      },
    });

    if (tasksInProgress > 0) return "WAITING";
    else if (tasksCompleted > 0) return "DONE";
    else return "NONE";
  }),
});
