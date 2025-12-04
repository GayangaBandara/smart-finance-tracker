// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAww6mIMU1Paa6upXltaW4unR15AcJaB0k',
  authDomain: 'finance-tracker-5bfd9.firebaseapp.com',
  projectId: 'finance-tracker-5bfd9',
  storageBucket: 'finance-tracker-5bfd9.firebasestorage.app',
  messagingSenderId: '219344201337',
  appId: '1:219344201337:web:be3cc58b48e257f12a96a8',
  measurementId: 'G-Y3VJ8JYTZL',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
