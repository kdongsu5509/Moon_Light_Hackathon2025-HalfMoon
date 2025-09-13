import API from "./axios";

export interface GoalResponse {
  month: string;
  goalPoints: number | null;
  currentPoints: number;
}

export const getMonthlyGoal = async (): Promise<GoalResponse | null> => {
  try {
    const res = await API.get("/my/goal", {
      headers: { accept: "application/json" },
    });
    if (res.data.code === 200) {
      return res.data.data as GoalResponse;
    } else {
      console.error("월 목표 조회 실패:", res.data.message);
      return null;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error("인증 오류: JWT 토큰이 유효하지 않음");
    } else if (error.response?.status === 404) {
      console.warn("현재 달 목표가 설정되지 않음 (goalPoints=null)");
    } else if (error.response?.status === 500) {
      console.error("서버 내부 오류: 월 목표 조회 실패");
    } else {
      console.error("알 수 없는 오류:", error.message);
    }
    return null;
  }
};

export interface SetGoalRequest {
  month: string;
  goal: number;
}

export const setMonthlyGoal = async (data: SetGoalRequest): Promise<string> => {
  try {
    const res = await API.post("/my/goal", data, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    if (res.data.code === 200) {
      return res.data.data as string;
    } else {
      throw new Error(res.data.message || "월 목표 설정 실패");
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error("잘못된 요청: month 형식 오류 또는 goal 값이 0 이하");
    } else if (error.response?.status === 401) {
      console.error("인증 오류: JWT 토큰이 유효하지 않음");
    } else if (error.response?.status === 422) {
      console.error("필수 필드 누락 또는 잘못된 데이터 형식");
    } else if (error.response?.status === 500) {
      console.error("서버 내부 오류: 목표 생성/업데이트 실패");
    } else {
      console.error("알 수 없는 오류:", error.message);
    }
    throw error;
  }
};

export const deleteMonthlyGoal = async (): Promise<void> => {
  try {
    const res = await API.delete("/my/goal", {
      headers: { accept: "*/*" },
    });
    if (res.data.code !== 200) {
      throw new Error(res.data.message || "월 목표 삭제 실패");
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error("인증 오류: JWT 토큰이 유효하지 않음");
    } else if (error.response?.status === 404) {
      console.warn("삭제할 목표가 없음 (멱등성 보장)");
    } else if (error.response?.status === 500) {
      console.error("서버 내부 오류: 목표 삭제 실패");
    } else {
      console.error("알 수 없는 오류:", error.message);
    }
    throw error;
  }
};
