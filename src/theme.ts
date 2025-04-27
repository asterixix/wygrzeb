import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6', // Example primary color
    },
    secondary: {
      main: '#19857b', // Example secondary color
    },
    error: {
      main: red.A400,
    },
    // You can customize other palette options like mode (light/dark) here
    // mode: 'light',
  },
  typography: {
    // Customize typography settings here if needed
    // fontFamily: 'Roboto, Arial, sans-serif',
  },
  // You can add component overrides here
  // components: { ... }
});

export default theme;
