import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Sidebar from '../Core/Dashboard/Sidebar'; // Import the Sidebar component

// Custom theme for the footer
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8f9fa', // Light grey background color
    },
  },
});

export default function StickyFooter() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: theme.palette.background.default, // Using background color from theme
            display: 'flex',
            flexDirection: 'column', // Align the sidebar and other content vertically
          }}
        >
          {/* Sidebar Component */}
          <Sidebar />

          <Container maxWidth="sm">
            <Typography variant="body1">
              My sticky footer content goes here.
            </Typography>
            {/* Add more content here if needed */}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
