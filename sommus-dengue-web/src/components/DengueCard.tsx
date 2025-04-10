import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DengueAlert } from '../types/DengueAlert';
import AlertLevel from './AlertLevel';

interface DengueCardProps {
    data: DengueAlert;
}

const DengueCard: React.FC<DengueCardProps> = ({ data }) => {
    return (
        <Card sx={{ minWidth: 275, mb: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                        Semana {data.semana_epidemiologica}
                    </Typography>
                    <AlertLevel level={data.nivel_alerta} />
                </Box>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Casos Estimados: {data.casos_est}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Casos Notificados: {data.casos_notificados}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default DengueCard; 