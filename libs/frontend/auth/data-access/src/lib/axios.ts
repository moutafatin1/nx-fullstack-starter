import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: null | ReturnType<typeof refreshTokenFn> = null;

async function refreshTokenFn() {
  const res = await refreshTokenAxios.post<{ accessToken: string }>(
    '/auth/refresh-tokens'
  );
  return res.data;
}

export const authAxios = axios.create({
  baseURL: '/api',
});

const refreshTokenAxios = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

authAxios.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem('nx_accessToken');
  if (accessToken) {
    request.headers = request.headers ?? {};
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return request;
});

authAxios.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as CustomAxiosRequestConfig;
    if (
      originalRequest?.url !== '/auth/signin' &&
      err.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshTokenFn().finally(
          () => (refreshPromise = null)
        );
      }

      try {
        const auth = await refreshPromise;
        localStorage.setItem('nx_accessToken', auth.accessToken);
        return axios(originalRequest);
      } catch (error) {
        localStorage.removeItem('nx_accessToken');
        window.location.replace('/signin');
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);
