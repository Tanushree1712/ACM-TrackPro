import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvpfx9pfEvPTecItINgKZGXUHV5lei6yY",
  authDomain: "acm-trackpro.firebaseapp.com",
  projectId: "acm-trackpro",
  storageBucket: "acm-trackpro.firebasestorage.app",
  messagingSenderId: "741504544370",
  appId: "1:741504544370:web:95cf8abb8ca34038c25ceb",
  measurementId: "G-H8SNJ2F5SL",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Adding doc...");
addDoc(collection(db, 'proposals'), { test: true })
  .then(() => {
    console.log("Success!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });
