// Import the functions you need from the SDKs you need
import {initializeApp}  from "firebase/app";
import  {getAuth,GoogleAuthProvider}  from "firebase/auth";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2MjmBpnjIlqPwOkP_k3BGukS3C2Sa7PM",
  authDomain: "nityamneeds.firebaseapp.com",
  projectId: "nityamneeds",
  storageBucket: "nityamneeds.appspot.com",
  messagingSenderId: "433886944322",
  appId: "1:433886944322:web:03f812656b16c96e5321db"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const provider=new GoogleAuthProvider();
export const messaging=getMessaging(app);