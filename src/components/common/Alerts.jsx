import React, { forwardRef } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Alerts = ({ message, openAlert, setOpenAlert }) => {
  // message[0] = message text
  // message[1] = success, error, warning, info

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenAlert(false)
  }

  return (
    <Snackbar
      open={openAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      {message && message.length > 0 && (
        <Alert onClose={handleClose} severity={message[1] || 'success'} sx={{ width: '100%' }}>
          {message[0].replace('Firebase: ', '')}
        </Alert>
      )}
    </Snackbar>
  )
}

export default Alerts
