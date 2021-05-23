const stripe = require("stripe")(process.env.STRIPE_SECRET);

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send("400 Bad Request");
  }
  const total = req.query.total;
  const desc = req.query.desc;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "inr",
    description: `Amazon-ish Order for ${(total / 100).toFixed(
      2
    )} INR: ${desc}`,
  });
  console.log(paymentIntent);
  return res.status(201).json({
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.created,
  });
};
