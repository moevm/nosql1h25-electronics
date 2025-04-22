const errorInterceptor = (error: any) => {
  console.error('API Error:', error);
  return Promise.reject(error);
};

export default errorInterceptor;
