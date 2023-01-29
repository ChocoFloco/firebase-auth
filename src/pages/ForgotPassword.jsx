import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { sendPasswordResetEmail } from 'firebase/auth'

import { auth } from '../firebase/config'
import useLogin from '../hooks/useLogin'
import Alerts from '../components/common/Alerts'

const ForgotPassword = () => {
	const { message, setMessage, isPending } = useLogin()

	const [openAlert, setOpenAlert] = useState()

	useEffect(() => {
		if (message) {
			setOpenAlert(true)
		}
	}, [message])

	const handleSubmit = event => {
		event.preventDefault()

		const data = new FormData(event.currentTarget)

		if (!data.get('email')) {
			setMessage(['Please fill out all required fields.', 'error'])
			return
		}

		sendPasswordResetEmail(auth, data.get('email'))
			.then(() => {
				setMessage(['Password reset required successfully. Check your email inbox.', 'success'])
			})
			.catch(error => {
				if (error.message.includes('auth/user-not-found')) {
					setMessage([`There's no user with this email.`, 'error'])
				} else {
					setMessage([error.message, 'error'])
				}
			})
	}

	return (
		<Container
			component='main'
			maxWidth='xs'
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
				<Typography component='h1' variant='h5'>
					Reset password
				</Typography>
				<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin='normal'
						required
						fullWidth
						id='email'
						label='Email Address'
						name='email'
						autoComplete='email'
						InputLabelProps={{ shrink: true }}
						autoFocus
					/>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 0.8, mb: 2 }}
						disabled={isPending}
					>
						{isPending ? <CircularProgress size={24} /> : 'Reset'}
					</Button>
					<Grid container justifyContent='flex-end'>
						<Grid item>
							<Button color='primary' to='/login' component={Link} style={{ padding: 10 }}>
								Go back
							</Button>
						</Grid>
					</Grid>
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

export default ForgotPassword
