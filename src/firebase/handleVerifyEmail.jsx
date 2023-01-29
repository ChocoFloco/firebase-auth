import { applyActionCode } from 'firebase/auth'

const handleVerifyEmail = async (auth, actionCode, continueUrl, lang, setError, setSuccess) => {
	console.log('handleVerifyEmail')
	setError()
	setSuccess()

	// Localize the UI to the selected language as determined by the lang
	// parameter.
	// Try to apply the email verification code.
	return applyActionCode(auth, actionCode)
		.then(() => {
			// Email address has been verified.
			setSuccess('Your email address has been verified.')
			// You could also provide the user with a link back to the app.
			// TODO: If a continue URL is available, display a button which on
			// click redirects the user back to the app via continueUrl with
			// additional state determined from that URL's parameters.
		})
		.catch(error => {
			if (error.message.includes('auth/invalid-action-code')) {
				setError('This link has expired.')
			} else {
				setError(error.message)
			}
			// Code is invalid or expired. Ask the user to verify their email address
			// again.
		})
}

export default handleVerifyEmail
