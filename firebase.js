import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfonvc1eySQz9e6SY5y-hGc5bn79zRIL8",
  authDomain: "cabbookingapp-6e731.firebaseapp.com",
  projectId: "cabbookingapp-6e731",
  storageBucket: "cabbookingapp-6e731.appspot.com",
  messagingSenderId: "856866992207",
  appId: "1:856866992207:web:17db2ce200d5e75ddd7a3a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
