import API from "./axios";

// 개별 답안
export interface ReviewTestAnswer {
  questionId: string;
  userAnswer: string;
}

// 요청 바디 타입
export interface ReviewTestSubmitRequest {
  testId: string;
  answers: ReviewTestAnswer[];
}

// 문제별 채점 결과
export interface QuestionResult {
  questionId: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

// 서버에서 내려주는 data
export interface ReviewTestSubmitResponse {
  testId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  grade: string;
  earnedPoints: number;
  questionResults: QuestionResult[];
}

// 최종 API 함수
export const submitReviewTest = async (
  payload: ReviewTestSubmitRequest
): Promise<ReviewTestSubmitResponse | null> => {
  try {
    const res = await API.post("/api/study/review-test/submit", payload, {
      headers: {
        "Content-Type": "application/json", // 명시적으로 JSON 지정
        Accept: "application/json",
      },
    });

    // API 문서에 따르면 { code, message, data } 구조임
    if (res.data && res.data.code === 200 && res.data.data) {
      return res.data.data as ReviewTestSubmitResponse;
    } else {
      console.error("❌ 서버 응답이 예상과 다릅니다:", res.data);
      return null;
    }
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error("❌ 잘못된 요청: testId나 answers 확인 필요");
          break;
        case 401:
          console.error("❌ 인증 실패: JWT 토큰이 유효하지 않음");
          break;
        case 500:
          console.error("❌ 서버 내부 오류");
          break;
        default:
          console.error("❌ 알 수 없는 오류:", error.response.data || error.message);
      }
    } else {
      console.error("❌ 네트워크 오류:", error.message);
    }
    return null;
  }
};