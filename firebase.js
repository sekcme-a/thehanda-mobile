import firebase from 'firebase/app'
import 'firebase/firestore';

const NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDzFSg5Sp-pw4V8VFE8iot-4nmN3lWenb8"
const NEXT_PUBLIC_AUTH_DOMAIN="multicultural-app.firebaseapp.com"
const NEXT_PUBLIC_PROJECT_ID="multicultural-app"
const NEXT_PUBLIC_STORAGE_BUCKET="multicultural-app.appspot.com"
const NEXT_PUBLIC_MESSAGING_SENDER_ID="202127434482"
const NEXT_PUBLIC_APP_ID="1:202127434482:web:3505e5cec8747b9df8266b"

const firebaseConfig = {
  apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: NEXT_PUBLIC_PROJECT_ID,
  storageBucket: NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_APP_ID,
};
  
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  // if (typeof window !== "undefined") {
  //   if ("measurementId" in firebaseConfig) {
  //     firebase.analytics()
  //   }
  // }
}

export const firestore = firebase.firestore();
