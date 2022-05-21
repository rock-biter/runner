// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCVM3J2HqaUfNARYx0qJeuTFYsN72FSmJ4",
//   authDomain: "runner-8adee.firebaseapp.com",
//   projectId: "runner-8adee",
//   storageBucket: "runner-8adee.appspot.com",
//   messagingSenderId: "256204641365",
//   appId: "1:256204641365:web:8ece8c6f615c6b661670dc",
//   measurementId: "G-JBLY317S8Y"
// };
const firebaseConfig = {
  apiKey: "AIzaSyA0ewQn1eFDdmCVkBm986u-zQSej5Np2Uk",
  authDomain: "forrest-jump.firebaseapp.com",
  projectId: "forrest-jump",
  storageBucket: "forrest-jump.appspot.com",
  messagingSenderId: "516126988929",
  appId: "1:516126988929:web:c63aaa95ebd8e327508b80",
  measurementId: "G-R3LZF9YK8H"
};

let app = window.app;
// Initialize Firebase
if(!app)
  app = initializeApp(firebaseConfig);
  
const analytics = getAnalytics(app);
const db = getFirestore(app)

export { app, analytics, db }