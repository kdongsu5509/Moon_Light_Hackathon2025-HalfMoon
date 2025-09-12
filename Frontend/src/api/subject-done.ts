import API from "./axios";

export const doneSentence = async (sentenceId: string): Promise<boolean> => {
  try {
    const res = await API.post(
      `/api/subject/done/${sentenceId}`,
      {}, // ✅ 요청 본문은 비워두되 안전하게 빈 객체 전송
      {
        headers: { accept: "*/*" },
      }
    );

    return res.data.code === 200;
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error("잘못된 UUID 형식");
    } else if (error.response?.status === 401) {
      console.error("JWT 토큰이 유효하지 않음");
    } else if (error.response?.status === 403) {
      console.error("다른 사용자의 문장에 접근 시도");
    } else if (error.response?.status === 404) {
      console.error("존재하지 않는 문장 ID");
    } else if (error.response?.status === 500) {
      console.error("서버 내부 오류");
    } else {
      console.error("알 수 없는 오류:", error.message);
    }
    return false;
  }
};
