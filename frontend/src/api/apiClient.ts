import axios from 'axios';
import requestInterceptor from './middleware/requestInterceptor';
import errorInterceptor from './middleware/errorInterceptor';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8000',
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(response => response, errorInterceptor);

export default apiClient;
