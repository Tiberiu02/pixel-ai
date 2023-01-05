import { router, protectedProcedure } from "../trpc";

export const accountRouter = router({
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
