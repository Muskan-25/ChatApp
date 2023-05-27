import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"  

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDgXnzTEuQq5xSetOm7gTqB4oJbSiT5yU",
  authDomain: "chatapp2506.firebaseapp.com",
  projectId: "chatapp2506",
  storageBucket: "chatapp2506.appspot.com",
  messagingSenderId: "339292721427",
  appId: "1:339292721427:web:21e0bc87cc1c85a0008ae6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;