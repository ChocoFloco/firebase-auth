import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

const useLogin = () => {
	const [message, setMessage] = useState(null)
	const [isPending, setIsPending] = useState(null)
	const { dispatch } = useAuthContext()

	const login = async (email, password) => {
		setMessage(null)
		setIsPending(true)

		try {
			const res = await signInWithEmailAndPassword(auth, email, password)

			dispatch({ type: 'LOGIN', payload: res.user })

			setIsPending(false)
			setMessage(null)
		} catch (error) {
			setIsPending(false)

			if (error.message.includes('auth/user-not-found')) {
				setMessage([`There's no user with this email.`, 'error'])
			} else if (error.message.includes('auth/invalid-email')) {
				setMessage(['Email is invalid.', 'error'])
			} else if (error.message.includes('auth/internal-error')) {
				setMessage([`Error. Could not login.`, 'error'])
			} else if (error.message.includes('auth/wrong-password)')) {
				setMessage([`Wrong password.`, 'error'])
			} else {
				setMessage([error.message, 'error'])
			}
		}
	}
	return { login, message, setMessage, isPending }
}

export default useLogin
