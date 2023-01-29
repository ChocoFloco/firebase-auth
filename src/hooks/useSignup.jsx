import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'

import { auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

const useSignUp = () => {
	const [message, setMessage] = useState(null)
	const [isPending, setIsPending] = useState(null)
	const { dispatch } = useAuthContext()

	const signUp = async (email, password, displayName) => {
		setMessage(null)
		setIsPending(true)

		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password)

			if (!user) {
				throw new Error('Could not complete sign up')
			}

			await updateProfile(user, { displayName })
			await sendEmailVerification(user)

			dispatch({ type: 'LOGIN', payload: user })

			setIsPending(false)
			setMessage(null)
		} catch (err) {
			if (err.code === 'auth/email-already-in-use') {
				setMessage(['The email address is already in use', 'error'])
			} else if (err.code === 'auth/invalid-email') {
				setMessage(['The email address is not valid.', 'error'])
			} else if (err.code === 'auth/operation-not-allowed') {
				setMessage(['Operation not allowed.', 'error'])
			} else if (err.code === 'auth/weak-password') {
				setMessage(['The password is too weak.', 'error'])
			} else {
				setMessage(['Something went wrong.', 'error'])
			}
			setIsPending(false)
		}
	}
	return { signUp, message, setMessage, isPending }
}

export default useSignUp
