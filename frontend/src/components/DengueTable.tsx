import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Tooltip, IconButton, CircularProgress, 
  Alert, TextField, Select, MenuItem, FormControl, InputLabel,
  Grid, Card, CardContent, Snackbar
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { DengueAlert } from '../types/DengueAlert';
import { fetchDengueData } from '../services/dengueService';

interface DengueTableProps {
  data: DengueAlert[];
}

const DengueTable: React.FC<DengueTableProps> = ({ data: initialData }) => {
  const [data, setData] = useState<DengueAlert[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof DengueAlert>('semana_epidemiologica');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [notification, setNotification] = useState<{ message: string; severity: 'warning' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    setData(initialData);
    checkForAlerts(initialData);
  }, [initialData]);

  const checkForAlerts = (data: DengueAlert[]) => {
    const highAlertWeeks = data.filter(item => item.nivel_alerta >= 3);
    if (highAlertWeeks.length > 0) {
      setNotification({
        message: `Alerta: ${highAlertWeeks.length} semana(s) com nível de alerta alto`,
        severity: 'warning'
      });
    }
  };

  const handleSort = (field: keyof DengueAlert) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const filteredAndSortedData = data
    .filter(item => 
      item.semana_epidemiologica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.casos_est.toString().includes(searchTerm) ||
      item.casos_notificados.toString().includes(searchTerm) ||
      item.nivel_alerta.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      return direction * (Number(aValue) - Number(bValue));
    });

  const handleExport = () => {
    const csvContent = [
      ['Semana Epidemiológica', 'Casos Estimados', 'Casos Notificados', 'Nível de Alerta'],
      ...filteredAndSortedData.map(item => [
        item.semana_epidemiologica,
        item.casos_est,
        item.casos_notificados,
        item.nivel_alerta
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dengue-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification?.severity || 'info'}>
          {notification?.message}
        </Alert>
      </Snackbar>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h2">
              Dados de Dengue
            </Typography>
            <Box>
              <TextField
                label="Buscar"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mr: 2 }}
              />
              <IconButton onClick={handleExport} color="primary">
                <Tooltip title="Exportar dados">
                  <FileDownloadIcon />
                </Tooltip>
              </IconButton>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort('semana_epidemiologica')} style={{ cursor: 'pointer' }}>
                    Semana Epidemiológica {sortField === 'semana_epidemiologica' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell onClick={() => handleSort('casos_est')} style={{ cursor: 'pointer' }}>
                    Casos Estimados {sortField === 'casos_est' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell onClick={() => handleSort('casos_notificados')} style={{ cursor: 'pointer' }}>
                    Casos Notificados {sortField === 'casos_notificados' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell onClick={() => handleSort('nivel_alerta')} style={{ cursor: 'pointer' }}>
                    Nível de Alerta {sortField === 'nivel_alerta' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData.map((row) => (
                  <TableRow key={row.semana_epidemiologica}>
                    <TableCell>{row.semana_epidemiologica}</TableCell>
                    <TableCell>{row.casos_est}</TableCell>
                    <TableCell>{row.casos_notificados}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: 
                            row.nivel_alerta === 1 ? '#4caf50' :
                            row.nivel_alerta === 2 ? '#ff9800' :
                            row.nivel_alerta === 3 ? '#f44336' :
                            '#d32f2f',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}
                      >
                        {row.nivel_alerta}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evolução dos Casos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredAndSortedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana_epidemiologica" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="casos_est" stroke="#8884d8" name="Casos Estimados" />
                  <Line type="monotone" dataKey="casos_notificados" stroke="#82ca9d" name="Casos Notificados" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DengueTable; 