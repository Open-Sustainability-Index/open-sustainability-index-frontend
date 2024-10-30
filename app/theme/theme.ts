import { createTheme } from '@mui/material/styles'

export const COLORS = {
  BLACK: '#1c1b1f',
  GRAY_LIGHT: '#f6f8fe',
  GRAY_LIGHTER: '#c4c4c4',
  GRAY_MEDIUM: '#676767',
  WHITE: '#fff',

  BLUE_LIGHT: '#edf2fb',
  BLUE_LIGHT_ALT: '#d7e3fc',
  BLUE_MEDIUM: '#3f37c9',
  BLUE_HOVER: '#5d55df',

  TURQUOISE_LIGHT: '#e0fcf7',
  TURQUOISE_MEDIUM: '#22ebc7',

  PINK_LIGHT: '#f9b6ff',

  PURPLE_GRADIENT: 'radial-gradient(394.12% 110.28% at 84.11% 15.37%, #7400B8 0%, #6930C3 100%)',
  PURPLE_LIGHT: '#cd9aff',
  PURPLE_DARK: '#ba08e6',
  PURPLE_DARKER: '#7110bc'

}

/*
- xs: Extra small screens, typically mobile devices. Min Width: 0px (applies to all screens smaller than 600px)
- sm: Small screens, such as larger mobile devices and small tablets. Min Width: 600px
- md: Medium screens, typically tablets and smaller laptops. Min Width: 900px
- lg: Large screens, typically desktops. Min Width: 1200px
- xl: Extra large screens, typically very large monitors. Min Width: 1536px
*/

// Define custom MUI theme
const theme = createTheme({
  palette: {
    // Body text color
    text: {
      primary: COLORS.BLACK,
      secondary: COLORS.GRAY_MEDIUM,
      disabled: COLORS.GRAY_LIGHTER
    },
    // primary: Primary color, usually the main color of your app.
    primary: {
      main: COLORS.BLUE_MEDIUM,
      dark: COLORS.BLUE_HOVER, // Dark variant for hover/focus states
      light: COLORS.BLUE_LIGHT_ALT,
      contrastText: COLORS.WHITE
    },
    // secondary: Secondary color, often used for accents.
    secondary: {
      main: COLORS.PURPLE_DARK,
      dark: COLORS.PURPLE_DARKER, // Dark variant for hover/focus states
      light: COLORS.PURPLE_LIGHT,
      contrastText: COLORS.WHITE
    }
    // error: Color used to indicate errors (e.g., for form validation).
    // warning: Color used for warning indicators or notifications.
    // info: Used for informational messages, hints, or help prompts.
    // success: Color for success messages or indicators.
  },
  typography: {
    fontFamily: [
      'Open Sans',
      'Arial',
      'sans-serif'
    ].join(','),
    fontSize: 18,

    h1: {
      fontWeight: '100',
      fontSize: '3em',
      color: 'black',
      margin: '1em 0 0.5em',
      '@media (maxWidth:600px)': {
        fontSize: '1.2em'
      }
    },
    h2: {
      fontWeight: 'bold',
      fontSize: '2em',
      margin: '1em 0 0.5em'
    },
    h3: {
      fontWeight: 'bold',
      fontSize: '1.5em',
      margin: '1em 0 0.5em'
    },
    body1: {
    },
    body2: {
      color: COLORS.GRAY_MEDIUM,
      margin: '0.5em 0'
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
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'inherit'
        }
      }
    },
    // default variant: 'text', color 'primary'
    MuiButton: {
      styleOverrides: {
        root: {
          // backgroundColor: COLORS.BLUE_MEDIUM,
          color: 'white',
          borderRadius: '3em',
          boxShadow: 'none',
          '&:hover': {
            // backgroundColor: COLORS.BLUE_HOVER,
            boxShadow: 'none'
          },
          fontSize: '1em',
          textTransform: 'none',
          padding: '0.6em 1.8em'
        }
      },
      // Use 'color' prop to change button color, not 'variant'
      variants: [
        {
          props: { variant: 'text' },
          style: {
            color: COLORS.BLACK
          }
        }
      ]
    },
    MuiFab: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '0 !important'
        }
      }
    }
  }
})

export default theme
