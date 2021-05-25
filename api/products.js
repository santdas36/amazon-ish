const admin = require('firebase-admin');
const firebase = !admin.apps.length ? admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(new Buffer(process.env.GCLOUD_CREDENTIALS, 'base64').toString('utf-8'))),
}) : admin.app();

const db = firebase.firestore();

export default async (request, response) => {
	
	if (request.method !== 'GET') {
		return response.status(400).send('400 Bad Request');
	}
	
	try {
		const products = await db.collection("products").get();
		return response.status(200).json(products);
	}
	catch(e) {
		console.log(e);
		return response.status(500).send('Internal Error');
		}
}
