export interface DengueData {
  semana_epidemiologica: string;
  casos_est: number;
  casos_notificados: number;
  nivel_alerta: number;
  data_ini_SE?: number;
  casos_est_min?: number;
  casos_est_max?: number;
  p_rt1?: number;
  p_inc100k?: number;
  Localidade_id?: number;
  id?: number;
  versao_modelo?: string;
  Rt?: number;
  pop?: number;
  tempmin?: number;
  tempmed?: number;
  tempmax?: number;
  umidmin?: number;
  umidmed?: number;
  umidmax?: number;
  receptivo?: number;
  transmissao?: number;
  nivel_inc?: number;
  notif_accum_year?: number;
} 