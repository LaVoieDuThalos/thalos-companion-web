import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from '@firebase/firestore';
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

async function countEventSubs(eventId) {
  const countSubForEventQuery = query(
    collection(db, 'event-subscriptions'),
    where('eventId', '==', eventId)
  );
  return (await getDocs(countSubForEventQuery)).docs.length;
}

const q = query(
  collection(db, 'events'),
  where('dayId', '==', 'draft'),
  where('activityId', '==', 'jdr'),
  where('withSubscriptions', '==', true)
);

getDocs(q)
  .then((results) => results.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  .then((events) => {
    return Promise.all(
      events.map((e) => {
        return countEventSubs(e.id).then((subCount) => ({
          ...e,
          subCount,
        }));
      })
    );
  })
  .then((events) =>
    events.forEach((e) => {
      const availableSeats = e.maxSubscriptions - e.subCount;
      console.log(
        `**${e.title}** par ${e.gameMaster} (${availableSeats} places disponibles) `
      );
      console.log(
        `=> https://voie-du-thalos.org/thalos-companion-web/#/events/${e.id}`
      );
    })
  )
  .then(() => process.exit());
