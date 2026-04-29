import axios from "axios";
import { useLoadingStore } from "@/store/useLoadingStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  failedQueue = [];
};

instance.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setLoading(false);
    return response;
  },
  async (error) => {
    // ✅ async 추가
    useLoadingStore.getState().setLoading(false);

    const status = error.response?.status;
    const originalRequest = error.config;

    // ✅ 기존 401 처리 → 토큰 갱신 로직으로 교체
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await instance.post("/auth/reissue", { refreshToken });
        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);
        processQueue(null, newToken);
        return instance(originalRequest);
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
        return Promise.reject(e);
      }finally{
        isRefreshing = false;
      }
    }

    // ✅ 기존 에러 로그 (401 제외한 나머지)
    console.error("API Error:", error.response?.data || error.message);
    if (status === 500) {
      alert("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }

    return Promise.reject(error);
  },
);

export default instance;
