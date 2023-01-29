import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBq-Ov5Kv5q8-qmNDGrG_rex2kErHPMryA',
  authDomain: 'portfolio-826d0.firebaseapp.com',
  projectId: 'portfolio-826d0',
  storageBucket: 'portfolio-826d0.appspot.com',
  messagingSenderId: '664919029525',
  appId: '1:664919029525:web:6cbd1df8df20188234db1c',
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
