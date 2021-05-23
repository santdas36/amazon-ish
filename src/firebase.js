import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDVZH5cfh099SnFNiQOY2TUW6-W9CiPInE",
  authDomain: "amzn-ish.firebaseapp.com",
  databaseURL: "https://amzn-ish.firebaseio.com",
  projectId: "amzn-ish",
  storageBucket: "amzn-ish.appspot.com",
  messagingSenderId: "1094671473025",
  appId: "1:1094671473025:web:3c8c5ae7620bb0d9c03080",
  measurementId: "G-G5EXQNMX4J",
};

const firebaseAdmin = firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebaseAdmin.firestore();
const auth = firebase.auth();
const analytics = firebase.analytics();
export { auth, provider };
export default db;
