import { createTheme } from '@mui/material/styles'

// Define your custom theme
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
      '@media (max-width:600px)': {
        fontSize: '1.2em'
      }
    },
    h2: {
      fontWeight: 'bold'
    },
    h3: {
      fontWeight: 'bold'
    },
    subtitle1: {
      color: '#4361EE',
      fontSize: '1.5em',
      fontWeight: 'bold',
      '@media (max-width:600px)': {
        fontSize: '1em'
      }
    }
  }
})

export default theme

export const COLORS = {
  BLACK: '#1c1b1f',
  GRAY_DARK: '#838c8e',
  GRAY_MEDIUM: '#aeaaae',
  GRAY_LIGHTER: '#e6e1e5',
  GRAY_LIGHT: '#f5f6f7',
  WHITE: '#fff',

  PINK_LIGHT: '#f9b6ff',
  PURPLE_LIGHT: '#cd9aff',
  PURPLE_DARK: '#ba08e6'
}
