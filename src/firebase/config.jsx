import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
   apiKey: "AIzaSyC7mybMry1LzLSlpsmXMlN_9LbcPogoW2g",
  authDomain: "inverseprivate-304e0.firebaseapp.com",
  databaseURL: "https://inverseprivate-304e0-default-rtdb.firebaseio.com",
  projectId: "inverseprivate-304e0",
  storageBucket: "inverseprivate-304e0.appspot.com",
  messagingSenderId: "246587992179",
  appId: "1:246587992179:web:aa224363a30a5e532ca206",
  measurementId: "G-VWNPDLNQJ0"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app)

export { db, auth, storage }
