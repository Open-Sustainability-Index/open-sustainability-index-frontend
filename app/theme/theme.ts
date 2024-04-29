import { createTheme } from '@mui/material/styles'

export const COLORS = {
  BLACK: '#1c1b1f',
  GRAY_MEDIUM: '#676767',
  WHITE: '#fff',

  BLUE_LIGHT: '#edf2fb',
  BLUE_MEDIUM: '#3f37c9',
  BLUE_HOVER: '#5d55df',

  PINK_LIGHT: '#f9b6ff',
  PURPLE_LIGHT: '#cd9aff',
  PURPLE_DARK: '#ba08e6'
}

// Define custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#171d3a'
    },
    secondary: {
      main: '#f598ff'
    }
  },
  typography: {
    fontFamily: [
      'Open Sans',
      'Arial',
      'sans-serif'
    ].join(','),
    fontSize: 18,

    h1: {
      fontWeight: 'bold',
      fontSize: '2em',
      color: 'black',
      '@media (maxWidth:600px)': {
        fontSize: '1.2em'
      }
    },
    h2: {
      fontWeight: 'bold',
      fontSize: '2em'
    },
    h3: {
      fontWeight: 'bold',
      fontSize: '1.5em'
    },
    body2: {
      color: COLORS.GRAY_MEDIUM,
      marginTop: '1em'
    },
    subtitle1: {
      color: COLORS.BLUE_MEDIUM,
      fontSize: '1.5em',
      fontWeight: 'bold',
      '@media (maxWidth:600px)': {
        fontSize: '1em'
      }
    },
    caption: {
      color: '#171d3a'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.BLUE_MEDIUM,
          color: 'white',
          borderRadius: '20px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: COLORS.BLUE_HOVER,
            boxShadow: 'none'
          }
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '0 !important',
        }
      }
    }
  }
})

export default theme
