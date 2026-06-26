import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    custom: {
      background: '#F0EEE8',
      sidebar: '#ffffff',
      border: '#e5e7eb',
      textSecondary: '#6b7280',
      black: "#111827",
      blue: '#3b82f6',
      green: '#639922',
      yellow: '#f59e0b',
      red: '#ef4444',
      purple: '#713dfe',
    }
  },

  typography: {

    fontFamily: `
      Inter,
      Roboto,
      Arial,
      sans-serif
    `,

    h1: {
      fontWeight: 700
    },

    h2: {
      fontWeight: 700
    },

    body1: {
      fontSize: 14
    }
  }

})

export default theme