import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2UDTYPJylyfarZDctxVUlv7_u0FgGdik",
  authDomain: "talktraverse-9599d.firebaseapp.com",
  projectId: "talktraverse-9599d",
  storageBucket: "talktraverse-9599d.firebasestorage.app",
  messagingSenderId: "852400602008",
  appId: "1:852400602008:web:3015af4988dc371f5609ed",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
