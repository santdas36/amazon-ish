const admin = require("firebase-admin");

const firebase = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(
          new Buffer(process.env.GCLOUD_CREDENTIALS, "base64").toString("utf-8")
        )
      ),
    })
  : admin.app();

const db = firebase.firestore();

module.exports = async (request, response) => {
  if (request.method !== "GET") {
    return response.status(400).send("400 Bad Request");
  }

  if (request.query.id) {
    try {
      const singleProduct = await db
        .collection("products")
        .doc(request.query.id)
        .get();
      if (singleProduct.exists) {
        return response
          .status(200)
          .json({ id: request.query.id, ...singleProduct.data() });
      } else {
        return response.status(400).send("Product doesn't exist.");
      }
    } catch (e) {
      console.log(e);

      return response.status(500).send("Internal Error");
    }
  }
  
  else {
    try {
      const products = await db.collection("products").get();

      const productsObj = products.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return response.status(200).json(productsObj);
    } catch (e) {
      console.log(e);

      return response.status(500).send("Internal Error");
    }
  }
};
