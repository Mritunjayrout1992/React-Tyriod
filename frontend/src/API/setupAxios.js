import axios from 'axios';

let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

// Attach access token to all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors and refresh token
axios.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const { data } = await axios.post('/auth/refresh', { refreshToken });

          localStorage.setItem('accessToken', data.accessToken);
          onRefreshed(data.accessToken);
          isRefreshing = false;
        } catch (err) {
          isRefreshing = false;
          window.location.href = '/login'; // optional redirect
          return Promise.reject(err);
        }
      }

      return new Promise(resolve => {
        addSubscriber(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
