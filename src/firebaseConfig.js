// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from '@firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDOXM5qfe91X-_UonmN8cg2-GbN6eHfpZU',
  authDomain: 'aero-92e5d.firebaseapp.com',
  projectId: 'aero-92e5d',
  storageBucket: 'aero-92e5d.appspot.com',
  messagingSenderId: '670135839869',
  appId: '1:670135839869:web:fc09165b744b01d2f75514',
  measurementId: 'G-WFHC8RYMWN',
}

// Initialize Firebase

const app = initializeApp(firebaseConfig)
export const imageDB = getStorage(app)
