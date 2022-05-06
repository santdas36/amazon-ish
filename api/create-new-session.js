const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send("400 Bad Request");
  }
  const { cart, userDetails, shipping, uid, orderId } = req.body;

  const transformedCart = cart.map((item) => ({
    description: item.feature[0],
    quantity: item.quantity,
    tax_rates: ["txr_1ItzgWE4K4vYNE8J6tVoJrYj"],
    price_data: {
      currency: "inr",
      unit_amount: parseInt(item.price),
      product_data: {
        name: item.name,
        images: [item.imgUrl],
      },
    },
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          description: "test",
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: parseInt(10000 + 10000 * 0.129),
            product_data: { name: "test" },
          },
        },
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/failure",
      payment_intent_data: {
        // application_fee_amount: 123,
        transfer_data: {
          amount: 10000,
          destination: "acct_1Ke0JzRQ5OjAh5vv",
        },
      },
    });
    console.log(session.url);
    return res.status(200).json(session);
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: { message: e.message },
    });
  }
};
