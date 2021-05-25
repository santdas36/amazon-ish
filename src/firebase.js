import firebase from "firebase";

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
console.log(firebaseConfig);

const firebaseAdmin = firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebaseAdmin.firestore();
const auth = firebase.auth();
const analytics = firebase.analytics();
export { auth, provider };
export default db;
