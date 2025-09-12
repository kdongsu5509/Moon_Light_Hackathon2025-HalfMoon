import API from "./axios";

export type SubjectType = "INTRODUCTION" | "FAMILY" | "SCHOOL" | "FOOD" | "WEATHER";
export type StudyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Sentence {
  id: string;          // 문장 UUID
  sentence: string;    // 한국어 문장
  meaning: string;     // 영어 의미
  isDone: boolean;     // 완료 여부
}

export interface SubjectStartResponse {
  id: string;          // 콘텐츠 ID
  sentences: Sentence[];
}

export const startSubject = async (
  subject: SubjectType,
  studyLevel: StudyLevel
): Promise<SubjectStartResponse | null> => {
  try {
    const res = await API.post(
      "/api/subject/start",
      { subject, studyLevel },
      { headers: { accept: "application/json" } }
    );

    if (res.data.code === 200) {
      return res.data.data as SubjectStartResponse;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error("잘못된 subject 또는 studyLevel 값");
    } else if (error.response?.status === 401) {
      console.error("JWT 토큰이 유효하지 않음");
    } else if (error.response?.status === 422) {
      console.error("필수 필드 누락 또는 잘못된 데이터 형식");
    } else if (error.response?.status === 500) {
      console.error("서버 내부 오류: 콘텐츠 생성 실패");
    } else {
      console.error("알 수 없는 오류:", error.message);
    }
    return null;
  }
};
