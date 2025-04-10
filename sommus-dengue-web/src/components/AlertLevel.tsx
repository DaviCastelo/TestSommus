import React from 'react';
import { Chip } from '@mui/material';

interface AlertLevelProps {
    level: number;
}

const AlertLevel: React.FC<AlertLevelProps> = ({ level }) => {
    const getColor = () => {
        switch (level) {
            case 1:
                return 'success';
            case 2:
                return 'warning';
            case 3:
                return 'error';
            case 4:
                return 'error';
            default:
                return 'default';
        }
    };

    const getLabel = () => {
        switch (level) {
            case 1:
                return 'Verde';
            case 2:
                return 'Amarelo';
            case 3:
                return 'Laranja';
            case 4:
                return 'Vermelho';
            default:
                return 'Desconhecido';
        }
    };

    return (
        <Chip
            label={getLabel()}
            color={getColor()}
            variant="outlined"
            size="small"
        />
    );
};

export default AlertLevel; 