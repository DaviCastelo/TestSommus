import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import DengueTable from './components/DengueTable';
import NotificationList from './components/NotificationList';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <DengueTable />
        <NotificationList />
      </Container>
    </ThemeProvider>
  );
};

export default App; 