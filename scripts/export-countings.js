import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIRESTORE_API_KEY,
  authDomain: process.env.VITE_FIRESTORE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIRESTORE_DATABASE_URL,
  projectId: process.env.VITE_FIRESTORE_PROJECT_ID,
  storageBucket: process.env.VITE_FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIRESTORE_APP_ID,
};

const SEP = ';';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const activities = [
  'aos',
  'jds',
  'w40k',
  'bb',
  'jdr',
  'murder',
  'escape',
  'paint',
  'reunion',
  'shat',
  'autre',
];

getDocs(collection(db, 'countings')).then((result) => {
  console.log(printHeader());
  result.docs.forEach((doc) => {
    printCountings(doc.data());
  });
  process.exit(0);
});

function printHeader() {
  return `day;time;${activities.reduce((acc, cur) => acc + SEP + cur ?? '')}`;
}

function printCountings(doc) {
  const nightCounts = doc.night
    ? activities.reduce((acc, cur) => acc + (doc.night[cur] ?? '0') + SEP, '')
    : '';
  const afternoon = doc.afternoon
    ? activities.reduce(
        (acc, cur) => acc + (doc.afternoon[cur] ?? '0') + SEP,
        ''
      )
    : '';

  if (afternoon) {
    console.log(`${doc.dayId}${SEP}afternoon${SEP}${afternoon}`);
  }
  if (nightCounts) {
    console.log(`${doc.dayId}${SEP}night${SEP}${nightCounts}`);
  }
}
