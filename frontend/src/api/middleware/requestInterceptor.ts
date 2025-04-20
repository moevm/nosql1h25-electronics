import { InternalAxiosRequestConfig } from "axios";

const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers = config.headers ?? {};
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};

export default requestInterceptor;
