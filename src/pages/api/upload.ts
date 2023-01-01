import S3 from "aws-sdk/clients/s3";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
    return;
  }

  const key = `users/${session.user?.id}/${req.query.file}`;

  const post = s3.createPresignedPost({
    Bucket: process.env.S3_BUCKET,
    Fields: {
      key,
      "Content-Type": req.query.fileType,
    },
    Expires: 60, // seconds
    Conditions: [
      ["content-length-range", 0, 10485760], // up to 10 MB
    ],
  });

  res.status(200).json(post);
}
