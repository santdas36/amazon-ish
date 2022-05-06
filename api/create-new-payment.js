const stripe = require("stripe")(process.env.STRIPE_SECRET);
export default async (req, res) => {
  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "https://example.com/reauth",
    return_url: "https://example.com/return",
    type: "account_onboarding",
  });
  console.log(account.id, account, accountLink);

  // const account = await stripe.accounts.retrieve("acct_1Kajh8RQ5QH8Tyib");

  // console.log(account);

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
  // console.log(paymentIntent);
  return res.status(201).json({
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.created,
  });
};
