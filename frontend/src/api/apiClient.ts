import axios from 'axios';
import requestInterceptor from './middleware/requestInterceptor';
import errorInterceptor from './middleware/errorInterceptor';
import forbiddenErrorInterceptor from './middleware/forbiddenErrorInterceptor';

const apiClient = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:8000',
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(errorInterceptor, forbiddenErrorInterceptor);

export default apiClient;
