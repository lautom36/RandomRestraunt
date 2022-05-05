// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVNui6xrt2jqVTobANC7uIaunz960_HdI",
  authDomain: "randomrestraunt.firebaseapp.com",
  projectId: "randomrestraunt",
  storageBucket: "randomrestraunt.appspot.com",
  messagingSenderId: "350069912383",
  appId: "1:350069912383:web:e8bae8a37d302655dd198a",
  measurementId: "G-761L4NWNTL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);