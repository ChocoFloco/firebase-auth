import { createTheme } from '@mui/material'

const materialTableTheme = createTheme({
  typography: {
    htmlFontSize: 10,
    fontFamily: ['Poppins', 'sans-serif'].join(','),
    fontSize: 12,
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '0 !important',
          display: 'block',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottom: '0 !important',
          },
          '&:after': {
            borderBottom: '0 !important',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        inputAdornedStart: {
          paddingLeft: '10px',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          display: 'flex',
          alignItems: 'flex-end',
          '& .MuiInputBase-root': {
            marginBottom: '0.6rem',
          },
        },
      },
    },
    MuiTableFooter: {
      styleOverrides: {
        root: {
          minHeight: 76,
        },
      },
    },
  },
})

export default materialTableTheme
