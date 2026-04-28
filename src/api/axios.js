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
      originalRequest._retry = true; // 무한루프 방지
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await instance.post("/auth/reissue", { refreshToken });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        // 실패했던 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (e) {
        // refreshToken도 만료 → 강제 로그아웃
        console.error("Refresh Token Error:", e.response?.data || e.message);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
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
