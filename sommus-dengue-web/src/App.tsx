import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  AppBar,
  Toolbar,
  Paper,
  Snackbar
} from '@mui/material';
import { DengueAlert } from './types/DengueAlert';
import { dengueApi } from './services/api';
import DengueCard from './components/DengueCard';
import DengueChart from './components/DengueChart';
import DengueTable from './components/DengueTable';
import AlertLegend from './components/AlertLegend';
import SyncIcon from '@mui/icons-material/Sync';

function App() {
  const [alerts, setAlerts] = useState<DengueAlert[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<DengueAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [threeWeeks, sixMonths] = await Promise.all([
        dengueApi.getLastThreeWeeks(),
        dengueApi.getLastSixMonths()
      ]);

      console.log('Recent alerts:', threeWeeks);
      console.log('All alerts:', sixMonths);

      setRecentAlerts(threeWeeks || []);
      setAlerts(sixMonths || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar os dados';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      setError(null);
      await dengueApi.syncData();
      await fetchData();
      setSyncMessage('Dados sincronizados com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao sincronizar os dados';
      setError(errorMessage);
      console.error('Error syncing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Monitoramento de Dengue - BH
          </Typography>
          <Button
            variant="contained"
            onClick={handleSync}
            disabled={loading}
            color="secondary"
            startIcon={<SyncIcon />}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
          >
            {loading ? 'Sincronizando...' : 'Sincronizar Dados'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom align="center">
                Gráfico de Evolução
              </Typography>
              <DengueChart data={alerts} />
            </Paper>

            <Typography variant="h6" gutterBottom align="center" sx={{ mt: 6, mb: 3 }}>
              Últimas 3 Semanas
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap', 
              mb: 4,
              justifyContent: 'center',
              '& > *': {
                flex: '1 1 300px',
                maxWidth: '400px'
              }
            }}>
              {recentAlerts.map((alert) => (
                <DengueCard key={alert.semanaEpidemiologicaFormatada} data={alert} highlighted />
              ))}
            </Box>

            <Typography variant="h6" gutterBottom align="center" sx={{ mt: 6, mb: 3 }}>
              Histórico dos Últimos 6 Meses
            </Typography>
            <DengueTable data={alerts} />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <AlertLegend />
            </Box>
          </Box>
        )}
      </Container>

      <Snackbar
        open={!!syncMessage}
        autoHideDuration={6000}
        onClose={() => setSyncMessage(null)}
        message={syncMessage}
      />
    </Box>
  );
}

export default App;
