import { DengueData } from '../types/dengue';
import { cacheService } from './cacheService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const CACHE_KEY = 'dengue_data_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface CacheData {
  data: DengueData[];
  timestamp: number;
}

const getCachedData = (): DengueData[] | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp }: CacheData = JSON.parse(cached);
  const now = Date.now();

  if (now - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return data;
};

const setCachedData = (data: DengueData[]): void => {
  const cacheData: CacheData = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};

export const fetchDengueData = async (): Promise<DengueData[]> => {
  // Try to get data from cache first
  const cachedData = getCachedData();
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/dengue/latest`);
    if (!response.ok) {
      throw new Error('Failed to fetch dengue data');
    }
    
    const data = await response.json();
    setCachedData(data);
    return data;
  } catch (error) {
    console.error('Error fetching dengue data:', error);
    throw error;
  }
};

export const fetchDengueDataByWeek = async (ew: number, ey: number): Promise<DengueData> => {
  const cacheKey = `dengue-data-${ew}-${ey}`;
  const cachedData = cacheService.get<DengueData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/dengue/week?ew=${ew}&ey=${ey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dengue data for week');
    }
    
    const data = await response.json();
    cacheService.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching dengue data for week:', error);
    throw error;
  }
}; 