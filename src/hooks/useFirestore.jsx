import { useReducer, useEffect, useState } from 'react'
import { collection, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

import { db } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

const initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
  function: null,
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return {
        // ...state,
        isPending: action.payload || true,
        document: null,
        success: false,
        error: null,
        function: action.function,
      }
    case 'ADDED_DOCUMENT':
      return {
        // ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
        function: null,
      }
    case 'DELETED_DOCUMENT':
      return {
        // ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
        function: null,
      }
    case 'ERROR':
      return {
        // ...state,
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
        function: null,
      }
    default:
      return state
  }
}

const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  const { user } = useAuthContext()

  // collection ref
  const collectionRef = collection(db, collectionName)

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // add a document
  const addDocument = async (documentObject) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      const addedDocument = await addDoc(collectionRef, {
        ...documentObject,
        createdAt: serverTimestamp(),
        uid: user.uid,
      })
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING', payload: id, function: 'delete' })

    try {
      const deletedDocument = await deleteDoc(doc(db, collectionName, id))
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT', payload: deletedDocument })
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  // update a document
  const updateDocument = async (id, documentObject) => {
    dispatch({ type: 'IS_PENDING', payload: id, function: 'delete' })

    try {
      const updatedDocument = await updateDoc(doc(db, collectionName, id), {
        ...documentObject,
      })
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT', payload: updatedDocument })
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  // clean up function
  useEffect(() => {
    return () => {
      setIsCancelled(true)
    }
  }, [])

  return { addDocument, deleteDocument, updateDocument, response }
}

export default useFirestore
