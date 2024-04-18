import { createTheme } from '@mui/material/styles'

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00ced1'
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

  BLUE_DARK: '#4e55e6',
  BLUE_MEDIUM: '#91b3fa',
  BLUE_LIGHT: '#dbe4fe',
  BLUE_LIGHTEST: '#e5fcfc',

  RED_DARK: '#d12c23',
  RED_MEDIUM: '#f0493f',
  RED_LIGHT: '#ff867e',

  GREEN_DARK: '#3f882b',
  GREEN_MEDIUM: '#81d36a',
  GREEN_LIGHT: '#e6fce0',

  YELLOW: '#fffce1',
  ORANGE: '#fff3e1'
}
