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
      unit_amount: parseInt(item.price * 7300),
      product_data: {
        name: item.name,
        images: [item.imgUrl],
      },
    },
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_rates: shipping ? ["shr_1IuAEBE4K4vYNE8JCuVCqrkc"] : [],
      payment_intent_data: {
        shipping: {
          address: {
            country: userDetails.country,
            postal_code: userDetails.postal_code,
            state: userDetails.state,
            line1: userDetails.address,
          },
          name: userDetails.name,
          phone: userDetails.phone,
        },
      },
      line_items: transformedCart,
      mode: "payment",
      success_url:
        "https://amazon-ish.vercel.app/payment?success={CHECKOUT_SESSION_ID}",
      cancel_url: "https://amazon-ish.vercel.app/payment",
      customer_email: userDetails.email,
      metadata: {
        uid: uid,
        orderId: orderId,
      },
    });

    return res.status(200).json(session);
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: { message: e.message },
    });
  }
};
