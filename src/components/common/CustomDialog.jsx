import React from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { useStyles } from '../../styles/mainTheme'

const CustomDialog = ({ openDialog, setOpenDialog, dialogProps, setDialogProps }) => {
  const classes = useStyles()

  CustomDialog.propTypes = {
    openDialog: PropTypes.bool,
    setOpenDialog: PropTypes.func,
    dialogProps: PropTypes.object,
    setDialogProps: PropTypes.func,
  }

  const { handleConfirm, handleClose, dialogTitle, dialogContent, confirmText, cancelText } =
    dialogProps

  return (
    openDialog && (
      <Dialog
        maxWidth="xs"
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpenDialog(false)
            setDialogProps({})
            if (handleClose) handleClose()
          }
        }}
        open={openDialog}
      >
        <IconButton
          className={classes.dialogCloseIconButton}
          onClick={() => {
            setOpenDialog(false)
            setDialogProps({})
            if (handleClose) handleClose()
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setOpenDialog(false)
              setDialogProps({})
              if (handleClose) handleClose()
            }}
          >
            {cancelText || 'Cancel'}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={async () => {
              const res = await handleConfirm()
              if (res) setOpenDialog(false)
            }}
          >
            {confirmText || 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  )
}

export default CustomDialog
