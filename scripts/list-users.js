import { collection, getDocs, getFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.VITE_FIRESTORE_API_KEY,
  authDomain: process.env.VITE_FIRESTORE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIRESTORE_DATABASE_URL,
  projectId: process.env.VITE_FIRESTORE_PROJECT_ID,
  storageBucket: process.env.VITE_FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIRESTORE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

getDocs(collection(db, 'users'))
  .then((result) => {
    result.docs
      .map((doc) => doc.data())
      .sort((a, b) => `${a.name}`.localeCompare(`${b.name}`))
      .forEach((doc) => {
        console.log(
          `${doc.id} - ${doc.name} - ${doc.preferences !== undefined ? JSON.stringify(doc.preferences.activities) : null} - ${doc.preferences !== undefined ? doc.preferences.roles : null}`
        );
      });
    console.log('Terminé');
  })
  .then(() => process.exit());
