import axios from 'axios';
import requestInterceptor from './middleware/requestInterceptor';
import errorInterceptor from './middleware/errorInterceptor';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(errorInterceptor);

export default apiClient;
