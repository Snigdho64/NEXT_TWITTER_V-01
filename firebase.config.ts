import { initializeApp, getApp, getApps } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: 'AIzaSyCD-jFW-Txre9ltBsgu26WoKEEZ93o2FjQ',
  authDomain: 'next-twitter-clone-8ad51.firebaseapp.com',
  projectId: 'next-twitter-clone-8ad51',
  storageBucket: 'next-twitter-clone-8ad51.appspot.com',
  messagingSenderId: '499529904664',
  appId: '1:499529904664:web:6e1b55deaf4b4a1bdc096d',
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore()
export const storage = getStorage()

export default app
