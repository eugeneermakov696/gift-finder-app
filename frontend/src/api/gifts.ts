import { apiClient } from './client';

export const getGifts = async () => {
  const response = await apiClient.get('/api/gifts/');
  return response.data;
};