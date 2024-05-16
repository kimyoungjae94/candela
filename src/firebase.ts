import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

export { auth };
