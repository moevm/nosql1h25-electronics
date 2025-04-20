import { AxiosError } from 'axios';

const errorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 403) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return Promise.reject(error);
};

export default errorInterceptor;
