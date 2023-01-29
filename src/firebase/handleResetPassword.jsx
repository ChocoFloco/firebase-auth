import { verifyPasswordResetCode } from 'firebase/auth'

const handleResetPassword = (auth, actionCode, setError, setPasswordResetEmail) => {
	// Localize the UI to the selected language as determined by the lang
	// parameter.

	// Verify the password reset code is valid.
	verifyPasswordResetCode(auth, actionCode)
		.then(email => {
			setPasswordResetEmail(email)
		})
		.catch(error => {
			setError(error.message)
			// Invalid or expired action code. Ask user to try to reset the password
			// again.
		})
}

export default handleResetPassword
