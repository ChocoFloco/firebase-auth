import React, { useEffect, useState, useRef } from 'react'
import { sendEmailVerification } from 'firebase/auth'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton, Grid, TextField, CircularProgress } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import PropTypes from 'prop-types'

import { useAuthContext } from '../hooks/useAuthContext'
import useLogin from '../hooks/useLogin'
import Alerts from '../components/common/Alerts'
import useFirestore from '../hooks/useFirestore'
import useCollection from '../hooks/useCollection'
import CustomDialog from '../components/common/CustomDialog'

const Dashboard = () => {
  const { message, setMessage } = useLogin()

  const currentProjectName = useRef()
  const [openAlert, setOpenAlert] = useState()
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogProps, setDialogProps] = useState({})

  const { user } = useAuthContext()

  const { addDocument, deleteDocument, updateDocument } = useFirestore('projects')
  const { documents: projects } = useCollection('projects', ['uid', '==', user.uid])

  const createProject = async (projectName) => {
    if (!projectName) {
      setMessage([`Something went wrong.`, 'error'])
      return false
    }

    const projectNameExists = projects.filter((project) => project.name === projectName)

    if (projectNameExists.length <= 0) {
      await addDocument({
        name: projectName,
      })

      setMessage(['Link created successfully.'])
      currentProjectName.current = undefined
      return true
    }

    setMessage([`Link'${projectName}' already exists.`, 'error'])
    return false
  }

  const updateProject = async (id, projectName) => {
    if (!projectName) {
      setMessage([`Something went wrong.`, 'error'])
      return false
    }

    const projectNameExists = projects.filter((project) => project.name === projectName)

    if (projectNameExists.length <= 0) {
      await updateDocument(id, { name: projectName })
      setMessage(['Project updated successfully.'])
      currentProjectName.current = undefined
      return true
    }

    setMessage([`Project '${projectName}' already exists.`, 'error'])
    return false
  }

  const deleteProject = async (id, projectName, confirmationProjectName) => {
    if (confirmationProjectName === projectName) {
      await deleteDocument(id)
      setMessage(['Project removed successfully.'])
      currentProjectName.current = undefined
      return true
    }
    return false
  }

  const Actions = ({ rowData }) => {
    Actions.propTypes = {
      rowData: PropTypes.object,
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'nowrap' }} id={rowData.id}>
        <IconButton
          aria-label="edit-project"
          title="Edit Project"
          onClick={() => {
            setOpenDialog(true)
            setDialogProps({
              handleConfirm: async () => {
                return updateProject(rowData.id, currentProjectName.current)
              },
              dialogTitle: 'Edit Project Name',
              dialogContent: (
                <TextField
                  autoFocus
                  defaultValue={rowData.name}
                  value={currentProjectName.current}
                  label="Project Name"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    currentProjectName.current = e.target.value
                  }}
                  fullWidth
                ></TextField>
              ),
              confirmText: 'Edit',
              cancelText: 'Cancel',
            })
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete-project"
          title="Delete Project"
          onClick={async () => {
            setOpenDialog(true)
            setDialogProps({
              dialogTitle: 'Delete Project',
              dialogContent: (
                <>
                  <Typography>
                    Are you sure you want to delete project <strong>{rowData.name}</strong>?
                  </Typography>
                  <Typography>
                    {`All data in this project will be permanently removed and this action can't be reversed.`}
                  </Typography>
                  <Typography>{`To confirm deletion, type the project's name in the field below.`}</Typography>
                  <TextField
                    autoFocus
                    value={currentProjectName.current}
                    label="Project Name"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      currentProjectName.current = e.target.value
                    }}
                    fullWidth
                    style={{ marginTop: 10 }}
                  ></TextField>
                </>
              ),
              confirmText: 'Delete',
              cancelText: 'Cancel',
              handleConfirm: () =>
                deleteProject(rowData.id, rowData.name, currentProjectName.current),
            })
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    )
  }

  const columns = [
    { title: 'Links', field: 'name' },
    {
      title: 'Actions',
      field: 'actions',
      width: 30,
    },
  ]

  useEffect(() => {
    if (message) {
      setOpenAlert(true)
    }
  }, [message])

  const handleSendEmailVerification = async () => {
    try {
      await sendEmailVerification(user)
      setMessage(['Email sent successfully'])
    } catch (error) {
      setMessage([error.message, 'error'])
    }
  }

  return (
    <>
      {user && !user.emailVerified ? (
        <Container
          component="main"
          maxWidth="md"
          sx={{
            minHeight: 'calc(100vh - 130px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Card variant="outlined">
            <h2>Please verify your email</h2>
            <Typography>Check your email for instructions.</Typography>
            <Typography>
              {`If you didn't receive a verification email, click the button below to resend it.`}
            </Typography>
            <Button variant="contained" onClick={handleSendEmailVerification}>
              Resend Email Verification
            </Button>
          </Card>
        </Container>
      ) : (
        <Container maxWidth="md">
          <Typography component="h3" variant="h3">
            Hello, {user.displayName} 👋
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          style={{
                            width: column.width,
                          }}
                          key={column.field}
                        >
                          {column.title}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      if (!projects)
                        return (
                          <TableRow>
                            <TableCell colSpan={2}>
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                        )
                      if (projects.length > 0)
                        return projects.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <Actions rowData={row} />
                            </TableCell>
                          </TableRow>
                        ))

                      return (
                        <TableRow>
                          <TableCell colSpan={2}>No records to display</TableCell>
                        </TableRow>
                      )
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogProps({
                      handleConfirm: () => {
                        return createProject(currentProjectName.current)
                      },
                      dialogTitle: 'Add a Link',
                      dialogContent: (
                        <TextField
                          autoFocus
                          value={currentProjectName.current}
                          label="Link Name"
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) => {
                            currentProjectName.current = e.target.value
                          }}
                          fullWidth
                        ></TextField>
                      ),
                      confirmText: 'Confirm',
                      cancelText: 'Cancel',
                    })
                  }}
                >
                  Add Link
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      )}

      {openDialog && (
        <CustomDialog
          setOpenDialog={setOpenDialog}
          openDialog={openDialog}
          dialogProps={dialogProps}
          setDialogProps={setDialogProps}
        />
      )}

      {message && (
        <Alerts
          message={message}
          setMessage={setMessage}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
        />
      )}
    </>
  )
}

export default Dashboard
