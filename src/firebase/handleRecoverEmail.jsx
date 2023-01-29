import { checkActionCode, applyActionCode, sendPasswordResetEmail } from 'firebase/auth'

const handleRecoverEmail = (auth, actionCode, lang, setMessage) => {
	// Localize the UI to the selected language as determined by the lang
	// parameter.
	let restoredEmail = null
	// Confirm the action code is valid.
	checkActionCode(auth, actionCode)
		.then(info => {
			// Get the restored email address.
			restoredEmail = info['data']['email']

			// Revert to the old email.
			return applyActionCode(auth, actionCode)
		})
		.then(() => {
			// Account email reverted to restoredEmail

			sendPasswordResetEmail(auth, restoredEmail)
				.then(() => {
					setMessage(
						`Your email was reverted to ${restoredEmail}. Check your inbox to reset the password.`
					)
				})
				.catch(error => {
					setMessage(error.message)
					// Error encountered while sending password reset code.
				})
		})
		.catch(error => {
			setMessage('Invalid code')
		})
}

export default handleRecoverEmail
