import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Tooltip,
    IconButton,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { DengueAlert } from '../types/DengueAlert';
import AlertLevel from './AlertLevel';

interface DengueTableProps {
    data: DengueAlert[];
}

interface Column {
    id: keyof DengueAlert | 'actions';
    label: string;
    tooltip: string;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => string | JSX.Element;
    minWidth?: number;
}

const DengueTable: React.FC<DengueTableProps> = ({ data }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const columns: Column[] = [
        {
            id: 'semanaEpidemiologicaFormatada',
            label: 'Semana Epidemiológica',
            tooltip: 'Semana epidemiológica e ano (AAAA-SS)',
            minWidth: 120
        },
        {
            id: 'dataIniSETimestamp',
            label: 'Data de Início',
            tooltip: 'Data de início da semana epidemiológica',
            format: (value) => formatDate(value),
            minWidth: 110
        },
        {
            id: 'casosEstimados',
            label: 'Casos Estimados',
            tooltip: 'Número de casos estimados para a semana',
            align: 'right',
            format: (value) => value?.toFixed(1) ?? '-',
            minWidth: 100
        },
        {
            id: 'casosEstimadosMin',
            label: 'Mín. Estimado',
            tooltip: 'Limite inferior do intervalo de confiança da estimativa',
            align: 'right',
            format: (value) => value?.toFixed(1) ?? '-',
            minWidth: 100
        },
        {
            id: 'casosEstimadosMax',
            label: 'Máx. Estimado',
            tooltip: 'Limite superior do intervalo de confiança da estimativa',
            align: 'right',
            format: (value) => value?.toFixed(1) ?? '-',
            minWidth: 100
        },
        {
            id: 'casosNotificados',
            label: 'Casos Notificados',
            tooltip: 'Número de casos notificados na semana',
            align: 'right',
            format: (value) => value ?? '-',
            minWidth: 100
        },
        {
            id: 'probabilidadeRt1',
            label: 'Prob. Rt1',
            tooltip: 'Probabilidade do número reprodutivo efetivo ser maior que 1',
            align: 'right',
            format: (value) => value?.toFixed(3) ?? '-',
            minWidth: 90
        },
        {
            id: 'incidenciaPor100k',
            label: 'Inc./100k hab',
            tooltip: 'Incidência de casos por 100 mil habitantes',
            align: 'right',
            format: (value) => value?.toFixed(2) ?? '-',
            minWidth: 100
        },
        {
            id: 'nivelAlerta',
            label: 'Nível de Alerta',
            tooltip: 'Nível de alerta: 1 (Verde), 2 (Amarelo), 3 (Laranja), 4 (Vermelho)',
            align: 'center',
            format: (value) => <AlertLevel level={value} />,
            minWidth: 110
        },
        {
            id: 'numeroReprodutivoEfetivo',
            label: 'Nº Reprodutivo',
            tooltip: 'Número reprodutivo efetivo (Rt)',
            align: 'right',
            format: (value) => value?.toFixed(3) ?? '-',
            minWidth: 100
        },
        {
            id: 'populacao',
            label: 'População',
            tooltip: 'População do município',
            align: 'right',
            format: (value) => value?.toLocaleString() ?? '-',
            minWidth: 100
        }
    ];

    // Se não for mobile, adiciona mais colunas
    if (!isMobile) {
        columns.push(
            {
                id: 'receptividade',
                label: 'Receptividade',
                tooltip: 'Índice de receptividade do município',
                align: 'center',
                format: (value) => value ?? '-',
                minWidth: 110
            },
            {
                id: 'transmissao',
                label: 'Transmissão',
                tooltip: 'Índice de transmissão',
                align: 'center',
                format: (value) => value ?? '-',
                minWidth: 110
            },
            {
                id: 'nivelIncidencia',
                label: 'Nível Inc.',
                tooltip: 'Nível de incidência',
                align: 'center',
                format: (value) => value ?? '-',
                minWidth: 90
            }
        );
    }

    // Se não for tablet, adiciona a última coluna
    if (!isTablet) {
        columns.push({
            id: 'notificacoesAcumuladasAno',
            label: 'Notif. Acum. Ano',
            tooltip: 'Total de notificações acumuladas no ano',
            align: 'right',
            format: (value) => value ?? '-',
            minWidth: 120
        });
    }

    const formatDate = (timestamp: number | null | undefined): string => {
        try {
            if (!timestamp) {
                return 'Data não disponível';
            }

            const timestampMs = timestamp.toString().length === 10 
                ? timestamp * 1000
                : timestamp;

            const date = new Date(timestampMs);
            
            if (isNaN(date.getTime())) {
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

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', my: 4 }}>
            <Paper sx={{ 
                width: '100%',
                overflow: 'hidden',
                boxShadow: 3,
                borderRadius: 2
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        p: 2, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    Dados Detalhados
                </Typography>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="tabela de dados da dengue">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ 
                                            minWidth: column.minWidth,
                                            backgroundColor: theme.palette.grey[100]
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            justifyContent: column.align === 'right' ? 'flex-end' : 
                                                          column.align === 'center' ? 'center' : 'flex-start',
                                            gap: 0.5
                                        }}>
                                            {column.label}
                                            <Tooltip title={column.tooltip}>
                                                <IconButton size="small">
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    hover
                                    key={row.semanaEpidemiologicaFormatada}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {columns.map((column) => {
                                        const value = row[column.id as keyof DengueAlert];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default DengueTable; 