import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
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
      <Container maxWidth={false} sx={{ py: 4 }}>
        <DengueTable data={[]} />
        <NotificationList />
      </Container>
    </ThemeProvider>
  );
};

export default App; 