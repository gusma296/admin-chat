import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyBODcgb5q7RAKn8Mzp6E_C2ErdlG_Yslj0",
  authDomain: "seakun-ccaaf.firebaseapp.com",
  databaseURL: "https://seakun-ccaaf-default-rtdb.firebaseio.com",
  projectId: "seakun-ccaaf",
  storageBucket: "seakun-ccaaf.appspot.com",
  messagingSenderId: "494299473007",
  appId: "1:494299473007:web:a6bc7f9632b59b753f599a",
  measurementId: "G-M9NJGBXT7B",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage, firebase };
export default db;
