// src/api/record.ts
import API from "./axios";

export interface MyRecordResponse {
  wordCnt: number;
  talkCnt: number;
  continueDay: number;
  myRank: number;
}

// 학습 기록 조회 API
export const getMyRecord = async (): Promise<MyRecordResponse> => {
  try {
    console.log("🌐 API 요청: /api/my/record");
    const res = await API.get("/api/my/record");
    console.log("📡 API 응답 전체:", res);
    console.log("📡 API 응답 data:", res.data);
    console.log("📡 API 응답 data.data:", res.data.data);
    
    if (!res.data || !res.data.data) {
      console.error("❌ API 응답에 data가 없습니다:", res.data);
      throw new Error("API 응답에 데이터가 없습니다");
    }
    
    return res.data.data; // Swagger 응답에서 data 부분만 추출
  } catch (error) {
    console.error("❌ 학습 기록 API 호출 실패:", error);
    throw error;
  }
};
