import { type NextApiRequest, type NextApiResponse } from "next";
import { buffer } from "micro";
import { env } from "../../env/server.mjs";
import Stripe from "stripe";

const stripe = new (Stripe as any)(env.STRIPE_SECRET_KEY);
const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

import { prisma } from "../../server/db/client";

export const config = { api: { bodyParser: false } };

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const reqBuffer = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;
    const event = stripe.webhooks.constructEvent(
      reqBuffer,
      sig,
      endpointSecret
    );

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.metadata.userId;

      // Fulfill the purchase...
      await prisma.task.create({
        data: {
          userId: userId,
          status: "WAITING",
        },
      });
    }
  } catch (err: any) {
    console.log("Webhook Error: ", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.status(200).end();
};
