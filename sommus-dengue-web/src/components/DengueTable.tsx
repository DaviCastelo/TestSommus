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
    IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { DengueAlert } from '../types/DengueAlert';
import AlertLevel from './AlertLevel';

interface DengueTableProps {
    data: DengueAlert[];
}

const DengueTable: React.FC<DengueTableProps> = ({ data }) => {
    const getTooltip = (field: string) => {
        const tooltips: { [key: string]: string } = {
            semana: "Semana epidemiológica e ano (AAAA-SS)",
            data: "Data de início da semana epidemiológica",
            casos_est: "Número de casos estimados para a semana",
            min_est: "Limite inferior do intervalo de confiança da estimativa",
            max_est: "Limite superior do intervalo de confiança da estimativa",
            notificados: "Número de casos notificados na semana",
            rt1: "Probabilidade do número reprodutivo efetivo ser maior que 1",
            incidencia: "Incidência de casos por 100 mil habitantes",
            alerta: "Nível de alerta: 1 (Verde), 2 (Amarelo), 3 (Laranja), 4 (Vermelho)",
            reprodutivo: "Número reprodutivo efetivo (Rt)",
            populacao: "População do município",
            receptividade: "Índice de receptividade do município",
            transmissao: "Índice de transmissão",
            nivel_inc: "Nível de incidência",
            acumulado: "Total de notificações acumuladas no ano"
        };
        return tooltips[field] || "";
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                Dados Detalhados
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de dados da dengue">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Semana Epidemiológica
                            <Tooltip title={getTooltip('semana')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            Data de Início
                            <Tooltip title={getTooltip('data')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            Casos Estimados
                            <Tooltip title={getTooltip('casos_est')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            Mín. Estimado
                            <Tooltip title={getTooltip('min_est')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            Máx. Estimado
                            <Tooltip title={getTooltip('max_est')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            Casos Notificados
                            <Tooltip title={getTooltip('notificados')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            Prob. Rt1
                            <Tooltip title={getTooltip('rt1')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            Inc./100k hab
                            <Tooltip title={getTooltip('incidencia')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                            Nível de Alerta
                            <Tooltip title={getTooltip('alerta')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            Nº Reprodutivo
                            <Tooltip title={getTooltip('reprodutivo')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            População
                            <Tooltip title={getTooltip('populacao')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                            Receptividade
                            <Tooltip title={getTooltip('receptividade')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                            Transmissão
                            <Tooltip title={getTooltip('transmissao')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                            Nível Inc.
                            <Tooltip title={getTooltip('nivel_inc')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            Notif. Acum. Ano
                            <Tooltip title={getTooltip('acumulado')}>
                                <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row.semanaEpidemiologicaFormatada}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.semanaEpidemiologicaFormatada}
                            </TableCell>
                            <TableCell>{new Date(row.dataIniSE).toLocaleDateString()}</TableCell>
                            <TableCell align="right">{row.casosEstimados?.toFixed(1) ?? '-'}</TableCell>
                            <TableCell align="right">{row.casosEstimadosMin?.toFixed(1) ?? '-'}</TableCell>
                            <TableCell align="right">{row.casosEstimadosMax?.toFixed(1) ?? '-'}</TableCell>
                            <TableCell align="right">{row.casosNotificados ?? '-'}</TableCell>
                            <TableCell align="right">{row.probabilidadeRt1?.toFixed(3) ?? '-'}</TableCell>
                            <TableCell align="right">{row.incidenciaPor100k?.toFixed(2) ?? '-'}</TableCell>
                            <TableCell align="center">
                                <AlertLevel level={row.nivelAlerta} />
                            </TableCell>
                            <TableCell align="right">{row.numeroReprodutivoEfetivo?.toFixed(3) ?? '-'}</TableCell>
                            <TableCell align="right">{row.populacao?.toLocaleString() ?? '-'}</TableCell>
                            <TableCell align="center">{row.receptividade ?? '-'}</TableCell>
                            <TableCell align="center">{row.transmissao ?? '-'}</TableCell>
                            <TableCell align="center">{row.nivelIncidencia ?? '-'}</TableCell>
                            <TableCell align="right">{row.notificacoesAcumuladasAno ?? '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DengueTable; 