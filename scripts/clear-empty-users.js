import { initializeApp } from "firebase/app";
import { query, where } from "firebase/firestore";
import { getFirestore, collection, getDocs, writeBatch } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIRESTORE_API_KEY,
  authDomain: process.env.VITE_FIRESTORE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIRESTORE_DATABASE_URL,
  projectId: process.env.VITE_FIRESTORE_PROJECT_ID,
  storageBucket: process.env.VITE_FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIRESTORE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let count = 0
const batch = writeBatch(db);

getDocs(collection(db, 'users'))
  .then(result =>
    result.docs
      .filter(doc => doc.data().name === undefined)
      .forEach(doc => {
        console.log(doc.data())
        batch.delete(doc.ref);
        count++;
    })).then(() => batch.commit())
.then(() => console.log(count + ' user(s) deleted'))