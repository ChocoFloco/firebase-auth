import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'

import useLogin from '../hooks/useLogin'
import Alerts from '../components/common/Alerts'

const Login = () => {
  const { login, message, setMessage, isPending } = useLogin()

  const [openAlert, setOpenAlert] = useState()

  useEffect(() => {
    if (message) {
      setOpenAlert(true)
    }
  }, [message])

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    if (!data.get('email') || !data.get('password')) {
      setMessage(['Please fill out all required fields.', 'error'])
      return
    }

    login(data.get('email'), data.get('password'))
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
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1.8, mb: 2 }}
            disabled={isPending}
          >
            {isPending ? <LinearProgress /> : 'Sign In'}
          </Button>
          <Button color="primary" to="/forgot-password" component={Link} style={{ padding: 10 }}>
            Forgot password?
          </Button>
          <Button color="primary" to="/sign-up" component={Link} style={{ padding: 10 }}>
            {`Don't have an account? Sign Up`}
          </Button>
        </Box>
      </Box>

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

export default Login
