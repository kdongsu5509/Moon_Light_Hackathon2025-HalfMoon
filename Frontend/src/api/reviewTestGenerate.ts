// src/api/reviewTestGenerate.ts
import API from "./axios";

export interface ReviewTestGenerateRequest {
  subject: string;
  studyLevel: string;
  questionCount: number;
}

export interface ReviewTestQuestion {
  id: string;
  type: "multiple" | "fill" | "pronunciation";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  image?: string;
  originalSentence: string;
}

export interface ReviewTestGenerateResponse {
  testId: string;
  questions: ReviewTestQuestion[];
  totalQuestions: number;
  timeLimit: number; // 분 단위
}

export const generateReviewTest = async (
  req: ReviewTestGenerateRequest
): Promise<ReviewTestGenerateResponse | null> => {
  try {
    const res = await API.post("/api/study/review-test/generate", req, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.code === 200) {
      return res.data.data as ReviewTestGenerateResponse;
    } else {
      console.error("❌ 시험 생성 실패:", res.data.message);
      return null;
    }
  } catch (err: any) {
    console.error("🚨 시험 생성 API 오류:", err.message);
    return null;
  }
};