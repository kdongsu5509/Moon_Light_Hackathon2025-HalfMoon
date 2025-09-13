import API from "./axios";

// 난이도 타입
export type StudyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

// 주제별 완료율 타입
export interface SubjectCompletionRate {
  subject: "INTRODUCTION" | "FAMILY" | "SCHOOL" | "FOOD" | "WEATHER";
  completionRate: number; // 0.0 ~ 100.0
}

// API 응답 데이터 구조
export interface CompletionRateResponse {
  subjectCompletionRates: SubjectCompletionRate[];
}

// ✅ 난이도별 이수율 조회 API
export const getCompletionRate = async (
  studyLevel: StudyLevel
): Promise<CompletionRateResponse | null> => {
  try {
    const res = await API.get(`/api/subject/completion-rate/${studyLevel}`, {
      headers: {
        accept: "application/json",
      },
    });

    if (res.data.code === 200) {
      return res.data.data as CompletionRateResponse;
    } else {
      console.error("이수율 조회 실패:", res.data.message);
      return null;
    }
  } catch (error: any) {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 400:
          console.error("잘못된 studyLevel 값 (예: 'INVALID_LEVEL')");
          break;
        case 401:
          console.error("인증 오류: JWT 토큰이 유효하지 않음");
          break;
        case 500:
          console.error("서버 내부 오류: 이수율 조회 실패");
          break;
        default:
          console.error(`알 수 없는 오류 (status: ${status})`);
      }
    } else {
      console.error("네트워크 오류:", error.message);
    }
    return null;
  }
};

