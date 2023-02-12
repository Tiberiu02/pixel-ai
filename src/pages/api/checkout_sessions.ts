import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authSession = await getServerAuthSession({ req, res });

  if (req.method === "POST") {
    if (!authSession || !authSession.user) {
      res.status(401).json("Unauthorized");
      return;
    }

    try {
      // Create Checkout Sessions from body params.
      const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          userId: authSession.user.id,
        },
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        allow_promotion_codes: true,
      });
      res.redirect(303, checkoutSession.url);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
