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
  const res = await API.get("/api/my/record");
  return res.data.data; // Swagger 응답에서 data 부분만 추출
};
