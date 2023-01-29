import { useState } from 'react'

import { auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

const useLogout = () => {
	const [message, setMessage] = useState(null)
	const [isPending, setIsPending] = useState(null)
	const { dispatch } = useAuthContext()

	const logout = async () => {
		setMessage(null)
		setIsPending(true)

		try {
			await auth.signOut()

			dispatch({ type: 'LOGOUT' })

			setIsPending(false)
			setMessage(null)
		} catch (err) {
			setIsPending(false)
			setMessage([err.message, 'error'])
		}
	}
	return { logout, message, isPending }
}

export default useLogout
