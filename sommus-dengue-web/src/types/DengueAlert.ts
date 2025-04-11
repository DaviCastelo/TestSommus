export interface DengueAlert {
    semanaEpidemiologica: number;
    dataIniSE: Date;
    casosEstimados: number;
    casosEstimadosMin: number;
    casosEstimadosMax: number;
    casosNotificados: number;
    probabilidadeRt1: number;
    incidenciaPor100k: number;
    nivelAlerta: number;
    numeroReprodutivoEfetivo: number;
    populacao: number;
    receptividade: number;
    transmissao: number;
    nivelIncidencia: number;
    notificacoesAcumuladasAno: number;
    semanaEpidemiologicaFormatada: string;
} 