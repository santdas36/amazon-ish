import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAr1PpEmRQOE4i5rv5XBAYAhH9-hhvJLOg",
  authDomain: "amzn-ish.firebaseapp.com",
  databaseURL: "https://amzn-ish.firebaseio.com",
  projectId: "amzn-ish",
  storageBucket: "amzn-ish.appspot.com",
  messagingSenderId: "1094671473025",
  appId: "1:1094671473025:web:7fc2bd27ecf03240c03080",
  measurementId: "G-XRBSCHV4P2"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebaseApp.firestore();
const auth = firebase.auth();
const analytics = firebase.analytics();
export { auth, provider };
export default db;
