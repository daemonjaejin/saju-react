import axios from "axios";
import { useLoadingStore } from "@/store/useLoadingStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  timeout: 10000,
});

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
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setLoading(false); // 응답 오면 로딩 OFF
    return response;
  },
  (error) => {
    useLoadingStore.getState().setLoading(false); // 에러 발생 시 로딩 OFF
    console.error("API Error:", error.response.data || error.message);
    const status = error.response?.status;
    if (status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      // window.location.href = '/login'; // 로그인 페이지로 이동
    } else if (status === 500) {
      alert("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    return Promise.reject(error);
  },
);

export default instance;
