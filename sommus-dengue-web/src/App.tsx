import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { DengueAlert } from './types/DengueAlert';
import { dengueApi } from './services/api';
import DengueCard from './components/DengueCard';
import DengueChart from './components/DengueChart';

function App() {
  const [alerts, setAlerts] = useState<DengueAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dengueApi.getLastThreeWeeks();
      setAlerts(data);
    } catch (err) {
      setError('Erro ao carregar os dados. Por favor, tente novamente.');
      console.error(err);
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
    } catch (err) {
      setError('Erro ao sincronizar os dados. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Monitoramento de Dengue - BH
        </Typography>
        <Button
          variant="contained"
          onClick={handleSync}
          disabled={loading}
        >
          Sincronizar Dados
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Gráfico de Evolução
            </Typography>
            <DengueChart data={alerts} />
          </Box>

          <Typography variant="h6" gutterBottom>
            Últimas 3 Semanas
          </Typography>
          {alerts.map((alert) => (
            <DengueCard
              key={alert.semana_epidemiologica}
              data={alert}
            />
          ))}
        </>
      )}
    </Container>
  );
}

export default App;
