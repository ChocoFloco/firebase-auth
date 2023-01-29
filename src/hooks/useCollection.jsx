import { useEffect, useRef, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'

import { db } from '../firebase/config'

const useCollection = (collectionName, _query) => {
  const [documents, setDocuments] = useState(null)

  const queryRef = useRef(_query).current

  useEffect(() => {
    let collectionRef = collection(db, collectionName)

    if (queryRef) {
      collectionRef = query(collectionRef, where(..._query))
    }

    const unsub = onSnapshot(collectionRef, (snapshot) => {
      const results = []

      snapshot.docs.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() })
      })
      setDocuments(results.sort((a, b) => a.name.localeCompare(b.name)))
    })

    return () => unsub()
  }, [collectionName, queryRef])

  return { documents }
}

export default useCollection
