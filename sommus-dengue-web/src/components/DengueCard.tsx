import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { DengueAlert } from '../types/DengueAlert';
import AlertLevel from './AlertLevel';

interface DengueCardProps {
    data: DengueAlert;
    highlighted?: boolean;
}

const DengueCard: React.FC<DengueCardProps> = ({ data, highlighted = false }) => {
    const formatDate = (timestamp: number | null | undefined): string => {
        try {
            console.log('Formatting timestamp:', timestamp);
            
            if (!timestamp) {
                return 'Data não disponível';
            }

            // Verifica se o timestamp está em segundos (10 dígitos) ou milissegundos (13 dígitos)
            const timestampMs = timestamp.toString().length === 10 
                ? timestamp * 1000  // Converte segundos para milissegundos
                : timestamp;        // Já está em milissegundos

            const date = new Date(timestampMs);
            
            if (isNaN(date.getTime())) {
                console.error('Invalid date from timestamp:', timestampMs);
                return 'Data inválida';
            }

            return date.toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Data inválida';
        }
    };

    // Debug log dos dados recebidos
    console.log('Card data:', data);

    return (
        <Card sx={{ 
            minWidth: 275, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: highlighted ? 6 : 3,
            border: highlighted ? 2 : 0,
            borderColor: 'primary.main',
            '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease-in-out'
            }
        }}>
            <CardContent sx={{ flex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                        <Typography variant="h6" component="div" gutterBottom>
                            Semana {data.semanaEpidemiologicaFormatada}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            {formatDate(data.dataIniSETimestamp)}
                        </Typography>
                    </Box>
                    <AlertLevel level={data.nivelAlerta} />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'grid', gap: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Casos Estimados
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {data.casosEstimados?.toFixed(1) ?? '-'}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Casos Notificados
                        </Typography>
                        <Typography variant="h6" color="secondary">
                            {data.casosNotificados ?? '-'}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Incidência por 100k hab.
                        </Typography>
                        <Typography variant="h6">
                            {data.incidenciaPor100k?.toFixed(2) ?? '-'}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DengueCard; 