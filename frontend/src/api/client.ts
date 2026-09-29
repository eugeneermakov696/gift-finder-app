import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/gifts/${location.search}',
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});