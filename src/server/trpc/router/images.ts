import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const imagesRouter = router({
  upload: protectedProcedure
    .input(z.object({ raw: z.string(), cropped: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.uploadedImage.create({
        data: {
          userId: ctx.session.user.id,
          raw: input.raw,
          cropped: input.cropped || "",
        },
      });
    }),

  clearUploads: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.uploadedImage.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
