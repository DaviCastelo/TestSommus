import axios from 'axios';
import { DengueAlert } from '../types/DengueAlert';

const api = axios.create({
    baseURL: 'http://localhost:5190/api'
});

export const dengueApi = {
    getLastThreeWeeks: async (): Promise<DengueAlert[]> => {
        const response = await api.get<DengueAlert[]>('/dengue/last-three-weeks');
        return response.data;
    },

    getByWeek: async (ew: number, ey: number): Promise<DengueAlert> => {
        const response = await api.get<DengueAlert>(`/dengue/week?ew=${ew}&ey=${ey}`);
        return response.data;
    },

    syncData: async (): Promise<void> => {
        await api.get('/dengue/sync');
    }
};

export default api; 