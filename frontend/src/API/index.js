import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const postRequest = async (url, data, config = {}, method = 'post') => {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const finalConfig = {
    headers: {
      ...(config.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    ...config,
  };

  try {
    const response = await axios({ method, url, data, ...finalConfig });
    return response;
  } catch (error) {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const storedUser = localStorage.getItem('user');
          const refreshRes = await axios.post('/auth/refresh', { refreshToken, user: JSON.parse(storedUser) });

          const newAccessToken = refreshRes.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          isRefreshing = false;
          processQueue(null, newAccessToken);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          isRefreshing = false;
          throw refreshErr;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            resolve(axios(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    if (error.response) {
      throw error.response;
    } else {
      throw { status: 500, data: { message: "Network Error. Please try again." } };
    }
  }
};
