// src/api/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://3.36.107.16:80", // Swagger 문서 base URL
  withCredentials: true, // 필요 시 쿠키/세션 포함
  timeout: 100000 //10초
});

// 요청 인터셉터: JWT 토큰 자동 추가
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken"); // 로그인 시 저장된 액세스 토큰
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 토큰 만료 시 자동 갱신
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API.defaults.baseURL}/api/auth/reissue`, {
            refreshToken: refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          
          // 원래 요청 재시도
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return API.request(error.config);
        } catch (refreshError) {
          // 리프레시 토큰도 만료된 경우 로그아웃
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
