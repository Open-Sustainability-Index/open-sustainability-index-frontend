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
