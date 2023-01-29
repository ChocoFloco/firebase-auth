import { createTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const primaryMain = '#1223E6'
const secondaryMain = '#09ebaf'
const background = '#EDEDED'

export const useStyles = makeStyles({
  dialogCloseIconButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    color: 'black',
  },
})

const mainTheme = createTheme({
  typography: {
    htmlFontSize: 10,
    fontFamily: ['Poppins', 'sans-serif'].join(','),
    fontSize: 14,
    fontWeight: 400,
    button: {
      letterSpacing: '0.025rem',
      lineHeight: '1rem',
      padding: '10px 20px',
      fontWeight: 400,
    },
    h1: {
      margin: '20px 0',
      fontWeight: 500,
      fontSize: 28,
    },
    h2: {
      margin: '20px 0',
      fontWeight: 500,
      fontSize: 24,
    },
    h3: {
      margin: '20px 0',
      fontWeight: 500,
      fontSize: 20,
    },
  },
  palette: {
    primary: {
      main: primaryMain,
    },
    secondary: {
      main: secondaryMain,
    },
    background: {
      default: background,
      paper: '#fff',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: '20px 30px 30px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '20px 40px 40px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          lineHeight: '2rem',
          marginBottom: 20,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: 'black',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          // backgroundColor: 'rgba(255,255,255,0.48)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          border: '1px solid black',
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          lineHeight: '1.5rem',
          marginTop: 5,
          padding: '0 25px',
          minHeight: 50,
          boxShadow: 'none',
          borderRadius: 0,
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e0e0e0',
          padding: 26,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: '10px !important',
        },
      },
    },
    // MuiLink: {
    // 	styleOverrides: {
    // 		root: {
    // 			color: primaryMain,
    // 			textDecoration: 'none',
    // 			cursor: 'pointer',
    // 		},
    // 	},
    // },
  },
})

export default mainTheme
