import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCXF7Z2KU-rdgGE7n6ZP8xWYpOnWApSto0',
  authDomain: 'candela-debe0.firebaseapp.com',
  projectId: 'candela-debe0',
  storageBucket: 'candela-debe0.appspot.com',
  messagingSenderId: '703466379141',
  appId: '1:703466379141:web:ed8d2612a354fef79896ec',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };

export const storage = getStorage(app);

export const db = getFirestore(app);
