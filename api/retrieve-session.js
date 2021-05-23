const stripe = require("stripe")(process.env.STRIPE_SECRET);

export default async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).send("400 Bad Request");
  }
  const sessionId = req.query.sessionId;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return res.status(200).json(session);
  } catch (e) {
    return res.status(400).json({
      error: { message: e.message },
    });
  }
};
