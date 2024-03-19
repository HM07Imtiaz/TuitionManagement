// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAr0p7e7-MJj-FqxYvUQj6Hqem8IuZZ4l8",
  authDomain: "tuition-bae48.firebaseapp.com",
  projectId: "tuition-bae48",
  storageBucket: "tuition-bae48.appspot.com",
  messagingSenderId: "539530314450",
  appId: "1:539530314450:web:8459ab8ca64373c80a630b",
  measurementId: "G-HNQEFHQXCH"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  export {firebase};