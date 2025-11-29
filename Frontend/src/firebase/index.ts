import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {

  apiKey: "AIzaSyBYPcyZBQF1jiwSy2g0cf8-aO24zG9FluI",
  authDomain: "archflow-3ca69.firebaseapp.com",
  projectId: "archflow-3ca69",
  storageBucket: "archflow-3ca69.firebasestorage.app",
  messagingSenderId: "88850843668",
  appId: "1:88850843668:web:4ccfc0a4ad52376643ff01",
  measurementId: "G-YKXTV8NHP0"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export default app
