// src/api/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://3.36.107.16:80/api", // Swagger 문서 base URL
  withCredentials: true, // 필요 시 쿠키/세션 포함
});

// 요청 인터셉터: JWT 토큰 자동 추가
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 로그인 시 저장된 토큰
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
