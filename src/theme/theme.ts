import { createTheme } from '@mui/material/styles';

// CSS variables for Tailwind and custom theming
export const cssVariables = {
  light: {
    // Base colors
    '--primary': '#2563eb', // blue-600
    '--primary-hover': '#1d4ed8', // blue-700
    '--secondary': '#6b7280', // gray-500
    '--muted': '#9ca3af', // gray-400
    '--border': '#e5e7eb', // gray-200
    
    // Card
    '--card-bg': '#ffffff',
    '--card-border': '#f3f4f6', // gray-100
    
    // Source type colors
    '--news-color': '#2563eb', // blue-600
    '--factcheck-color': '#059669', // emerald-600
    '--tweet-color': '#0ea5e9', // sky-500
    '--dataset-color': '#8b5cf6', // violet-500
    '--statistic-color': '#ec4899', // pink-500
    
    // Feedback colors
    '--info': '#3b82f6', // blue-500
    '--success': '#10b981', // emerald-500
    '--warning': '#f59e0b', // amber-500
    '--error': '#ef4444', // red-500
    
    // Border radius
    '--radius-sm': '0.25rem',
    '--radius-md': '0.375rem',
    '--radius-lg': '0.5rem',
  },
  dark: {
    // Base colors
    '--primary': '#3b82f6', // blue-500
    '--primary-hover': '#2563eb', // blue-600
    '--secondary': '#9ca3af', // gray-400
    '--muted': '#6b7280', // gray-500
    '--border': '#374151', // gray-700
    
    // Card
    '--card-bg': '#1f2937', // gray-800
    '--card-border': '#374151', // gray-700
    
    // Source type colors
    '--news-color': '#3b82f6', // blue-500
    '--factcheck-color': '#10b981', // emerald-500
    '--tweet-color': '#0ea5e9', // sky-500
    '--dataset-color': '#a78bfa', // violet-400
    '--statistic-color': '#f472b6', // pink-400
    
    // Feedback colors
    '--info': '#60a5fa', // blue-400
    '--success': '#34d399', // emerald-400
    '--warning': '#fbbf24', // amber-400
    '--error': '#f87171', // red-400
    
    // Border radius - same as light
    '--radius-sm': '0.25rem',
    '--radius-md': '0.375rem',
    '--radius-lg': '0.5rem',
  }
};

// MUI theme customization
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // blue-600
    },
    secondary: {
      main: '#6b7280', // gray-500
    },
    error: {
      main: '#ef4444', // red-500
    },
    warning: {
      main: '#f59e0b', // amber-500
    },
    info: {
      main: '#3b82f6', // blue-500
    },
    success: {
      main: '#10b981', // emerald-500
    },
    background: {
      default: '#f9fafb', // gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // gray-900
      secondary: '#4b5563', // gray-600
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.375rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '0.25rem',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // blue-500
    },
    secondary: {
      main: '#9ca3af', // gray-400
    },
    error: {
      main: '#f87171', // red-400
    },
    warning: {
      main: '#fbbf24', // amber-400
    },
    info: {
      main: '#60a5fa', // blue-400
    },
    success: {
      main: '#34d399', // emerald-400
    },
    background: {
      default: '#111827', // gray-900
      paper: '#1f2937', // gray-800
    },
    text: {
      primary: '#f9fafb', // gray-50
      secondary: '#d1d5db', // gray-300
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.375rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '0.25rem',
        },
      },
    },
  },
});

// Function to apply theme CSS variables
export function applyThemeVariables(theme: 'light' | 'dark'): void {
  const variables = cssVariables[theme];
  const root = document.documentElement;
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

export default {
  light: lightTheme,
  dark: darkTheme,
  cssVariables
};