import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import useSignUp from '../hooks/useSignup'
import Alerts from '../components/common/Alerts'

const SignUp = () => {
	const { signUp, message, setMessage, isPending } = useSignUp()

	const [openAlert, setOpenAlert] = useState()

	useEffect(() => {
		if (message) {
			setOpenAlert(true)
		}
	}, [message])

	const handleSubmit = event => {
		event.preventDefault()

		const data = new FormData(event.currentTarget)

		if (
			!data.get('firstName') ||
			!data.get('lastName') ||
			!data.get('email') ||
			!data.get('password')
		) {
			setMessage(['Please fill out all required fields.', 'error'])
			return
		}

		const displayName = `${data.get('firstName')} ${data.get('lastName')}`

		signUp(data.get('email'), data.get('password'), displayName)
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
					Sign up
				</Typography>
				<Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id='firstName'
								label='First Name'
								name='firstName'
								disabled={!!isPending}
								InputLabelProps={{ shrink: true }}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id='lastName'
								label='Last Name'
								name='lastName'
								disabled={!!isPending}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								disabled={!!isPending}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								id='password'
								disabled={!!isPending}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 1.8, mb: 2 }}
						disabled={isPending}
					>
						{isPending ? <CircularProgress size={24} /> : 'Sign Up'}
					</Button>
					<Grid container justifyContent='flex-end'>
						<Grid item>
							<Button color='primary' to='/login' component={Link} style={{ padding: 10 }}>
								Already have an account? Sign in
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

export default SignUp
