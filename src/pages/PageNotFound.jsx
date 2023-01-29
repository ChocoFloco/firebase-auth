import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ErrorIcon from '@mui/icons-material/Error'

const PageNotFound = () => {
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
					marginTop: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<ErrorIcon
					fontSize='large'
					color='primary'
					style={{ marginBottom: 25, transform: 'scale(1.3)' }}
				/>
				<Typography component='h1' variant='h5'>
					Page Not Found
				</Typography>
			</Box>
		</Container>
	)
}

export default PageNotFound
