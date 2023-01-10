import S3 from "aws-sdk/clients/s3";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
});

export const imagesRouter = router({
  upload: protectedProcedure
    .input(z.object({ fileName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.uploadedImage.create({
        data: {
          userId: ctx.session.user.id,
          fileName: input.fileName,
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

  getGeneratedImages: protectedProcedure.query(async ({ ctx }) => {
    const images = await ctx.prisma.generatedImage.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return images.map((image) => {
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `users/${ctx.session.user.id}/${image.image}`,
        Expires: 3600,
        ResponseContentDisposition: `attachment; filename="Pixel-AI.jpg"`,
      };
      const url = s3.getSignedUrl("getObject", params);
      return url;
    });
  }),
});
