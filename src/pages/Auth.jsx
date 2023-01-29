import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmPasswordReset } from 'firebase/auth'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import { auth } from '../firebase/config'
import handleResetPassword from '../firebase/handleResetPassword'
import handleRecoverEmail from '../firebase/handleRecoverEmail'
import handleVerifyEmail from '../firebase/handleVerifyEmail'
import { useAuthContext } from '../hooks/useAuthContext'
import useLogin from '../hooks/useLogin'
import useAlert from '../hooks/useAlert'
import Loading from '../components/common/Loading'
import Alerts from '../components/common/Alerts'

const Auth = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const { login } = useLogin()
  const { message, setMessage, openAlert, setOpenAlert } = useAlert()

  // Handle Email Verification, Password Reset and Email Change
  const urlParams = new URLSearchParams(window.location.search)

  const mode = urlParams.get('mode')
  const actionCode = urlParams.get('oobCode')
  const continueUrl = urlParams.get('continueUrl')
  const lang = urlParams.get('lang') || 'en'

  const [success, setSuccess] = useState()
  const [error, setError] = useState()
  const [passwordResetEmail, setPasswordResetEmail] = useState()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    switch (mode) {
      case 'resetPassword':
        // Display reset password handler and UI.
        handleResetPassword(auth, actionCode, setError, setPasswordResetEmail)
        break
      case 'recoverEmail':
        // Display email recovery handler and UI.
        handleRecoverEmail(auth, actionCode, lang, setError, setSuccess)
        break
      case 'verifyEmail':
        // Display email verification handler and UI.
        handleVerifyEmail(auth, actionCode, continueUrl, lang, setError, setSuccess)
        break
      default:
        break
    }
  }, [mode, actionCode, continueUrl, lang, setError, setSuccess])

  useEffect(() => {
    if (message) {
      setOpenAlert(true)
    }
  }, [message, setOpenAlert])

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    if (!data.get('password') || !data.get('confirm-password')) {
      setMessage(['Please fill out all required fields.', 'error'])
      return
    }

    if (data.get('password') !== data.get('confirm-password')) {
      setMessage([`Passwords don't match.`, 'error'])
      return
    }

    // Save the new password.
    setIsPending(true)
    confirmPasswordReset(auth, actionCode, data.get('password'))
      .then(() => {
        setIsPending(false)
        setSuccess('Your password has been updated.')

        login(passwordResetEmail, data.get('password'))

        // Password reset has been confirmed and new password updated.
        // TODO: Display a link back to the app, or sign-in the user directly
        // if the page belongs to the same domain as the app:
        // auth.signInWithEmailAndPassword(accountEmail, newPassword);
        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
      })
      .catch((err) => {
        setIsPending(false)
        setError(err.message)
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
      })
  }
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: 'calc(100vh - 130px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {
        // eslint-disable-next-line no-nested-ternary
        !success && !error && !passwordResetEmail ? (
          <Loading />
        ) : !success && !error && passwordResetEmail ? (
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Update Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirm-password"
                label="Confirm Password"
                type="password"
                id="confirm-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                disabled={isPending}
              >
                {isPending ? <CircularProgress size={34} /> : 'Update Password'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Card variant="outlined" sx={{ minWidth: { xs: '100%', md: '30%' } }}>
            <h2>User Account</h2>
            <Typography>{success || error.replace('Firebase: ', '')}</Typography>
            {success && (
              <div>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await user.reload()
                    navigate('/dashboard')
                  }}
                >
                  Go to the Dashboard
                </Button>
              </div>
            )}
          </Card>
        )
      }

      {message && (
        <Alerts
          message={message}
          setMessage={setMessage}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
        />
      )}
    </Container>
  )
}

export default Auth
