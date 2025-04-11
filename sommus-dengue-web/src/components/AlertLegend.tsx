import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AlertLevel from './AlertLevel';

const AlertLegend: React.FC = () => {
    const levels = [
        { level: 1, description: 'Verde - Normal' },
        { level: 2, description: 'Amarelo - Atenção' },
        { level: 3, description: 'Laranja - Alerta' },
        { level: 4, description: 'Vermelho - Emergência' }
    ];

    return (
        <Paper sx={{ p: 2, mt: 2, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
                Legenda - Níveis de Alerta
            </Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
                {levels.map(({ level, description }) => (
                    <Box key={level} display="flex" alignItems="center" gap={1}>
                        <AlertLevel level={level} />
                        <Typography variant="body2">{description}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default AlertLegend; 