import axios from 'axios';
import { DengueAlert } from '../types/DengueAlert';

const api = axios.create({
    baseURL: 'http://localhost:5190/api'
});

// Interceptor para logs
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
);

export const dengueApi = {
    getLastThreeWeeks: async (): Promise<DengueAlert[]> => {
        const response = await api.get<DengueAlert[]>('/dengue/last-three-weeks');
        return response.data;
    },

    getLastSixMonths: async (): Promise<DengueAlert[]> => {
        const response = await api.get<DengueAlert[]>('/dengue/last-six-months');
        return response.data;
    },

    getByWeek: async (ew: number, ey: number): Promise<DengueAlert> => {
        const response = await api.get<DengueAlert>(`/dengue/${ey}/${ew}`);
        return response.data;
    },

    syncData: async (): Promise<void> => {
        await api.get('/dengue/sync');
        // Após sincronizar, vamos buscar os dados novamente
        await Promise.all([
            dengueApi.getLastThreeWeeks(),
            dengueApi.getLastSixMonths()
        ]);
    }
};

export default api; 