import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { updateProfile, updateEmail, sendEmailVerification } from 'firebase/auth'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import { useTheme } from '@mui/material/styles'
import Avatar from 'react-avatar-edit'

import { storage } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'
import useAlert from '../hooks/useAlert'
import Alerts from '../components/common/Alerts'

const Profile = () => {
  const navigate = useNavigate()
  const { message, setMessage } = useAlert()
  const { user } = useAuthContext()
  const theme = useTheme()

  const [openAlert, setOpenAlert] = useState()
  const [isPending, setIsPending] = useState()
  const [avatar, setAvatar] = useState('/user-placeholder.png')
  const [avatarUrl, setAvatarUrl] = useState('/user-placeholder.png')
  const [cropOpen, setCropOpen] = useState(false)

  if (user && user.photoURL) {
    getDownloadURL(ref(storage, user.photoURL))
      .then((url) => {
        setAvatarUrl(url)
      })
      .catch(() => {
        // Handle any errors
      })
  }

  useEffect(() => {
    if (message) {
      setOpenAlert(true)
    }
  }, [message])

  const srcToFile = async (src, fileName, mimeType) => {
    return fetch(src)
      .then((res) => {
        return res.arrayBuffer()
      })
      .then((buf) => {
        return new File([buf], fileName, { type: mimeType })
      })
  }

  const updateAvatar = () => {
    if (avatar) {
      srcToFile(avatar, 'image.jpg', 'image/jpeg').then((file) => {
        uploadBytes(ref(storage, `/avatars/${user.uid}.jpg`), file)
      })
    }

    updateProfile(user, {
      photoURL: avatar && `avatars/${user.uid}.jpg`,
    }).then(() => {
      setMessage(['Profile picture updated successfully.', 'success'])
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsPending(true)

    const data = new FormData(event.currentTarget)

    const displayName = data.get('displayName')
    const email = data.get('email')

    if (!displayName || !email) {
      setMessage(['Please fill out all required fields.', 'error'])
      setIsPending(false)
      return
    }

    updateProfile(user, {
      displayName,
    })
      .then(() => {
        setMessage(['Profile updated successfully.', 'success'])
        if (user.email !== email) {
          updateEmail(user, email)
            .then(async () => {
              await sendEmailVerification(user)
              setIsPending(false)
              navigate('/dashboard')
            })
            .catch((error) => {
              if (error.message.includes('auth/requires-recent-login')) {
                setMessage([
                  'Please logout and login again before updating your email address.',
                  'error',
                ])
              } else {
                setMessage([error.message, 'error'])
              }
              setIsPending(false)
            })
        }
        setIsPending(false)
      })
      .catch((error) => {
        setMessage([error.message, 'error'])
        setIsPending(false)
      })
  }

  return (
    <>
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
          <Typography component="h1" variant="h1">
            Update Profile
          </Typography>
          <IconButton
            color="primary"
            component="label"
            title="Upload profile picture"
            onClick={() => setCropOpen(true)}
          >
            <img
              id="avatar"
              alt={user.displayName}
              style={{
                bgcolor: theme.palette.primary.main,
                width: 80,
                height: 80,
                borderRadius: 80,
              }}
              src={avatarUrl}
            />
          </IconButton>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="displayName"
                  required
                  fullWidth
                  label="Name"
                  id="displayName"
                  disabled={!!isPending}
                  defaultValue={user.displayName}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  disabled={!!isPending}
                  defaultValue={user.email}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              disabled={isPending}
            >
              {isPending ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </Box>
        </Box>
      </Container>

      {message && (
        <Alerts
          message={message}
          setMessage={setMessage}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
        />
      )}

      {cropOpen && (
        <Dialog onClose={() => setCropOpen(false)} open={cropOpen}>
          <DialogTitle style={{ borderBottom: '1px solid #eee' }}>
            Crop your new profile picture
          </DialogTitle>
          <DialogContent
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <img src={avatar} alt="Preview" width={80} height={80} style={{ marginBottom: 10 }} />
            <Avatar
              width={400}
              height={400}
              onCrop={(e) => {
                setAvatar(e)
              }}
              onClose={() => {
                setAvatar(null)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="outlined"
              onClick={() => {
                setAvatar(null)
                setCropOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                updateAvatar()
                setCropOpen(false)
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default Profile
