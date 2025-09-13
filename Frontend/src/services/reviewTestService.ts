// API 호출을 위한 서비스
const API_BASE_URL = 'http://3.36.107.16:80/api/study/review-test';

export interface ReviewTestRequest {
  subject: string;
  studyLevel: string;
  questionCount: number;
}

export interface ReviewTestQuestion {
  id: string;
  type: 'multiple' | 'fill' | 'pronunciation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  image: string;
  originalSentence: string;
}

export interface ReviewTestResponse {
  testId: string;
  questions: ReviewTestQuestion[];
  totalQuestions: number;
  timeLimit: number;
}

export interface ReviewTestAnswer {
  questionId: string;
  userAnswer: string;
}

export interface ReviewTestAnswerRequest {
  testId: string;
  answers: ReviewTestAnswer[];
}

export interface QuestionResult {
  questionId: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ReviewTestResult {
  testId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  grade: string;
  earnedPoints: number;
  questionResults: QuestionResult[];
}

// 토큰을 가져오는 헬퍼 함수 (실제 구현에서는 적절한 방법으로 토큰 관리)
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// API 호출 헬퍼 함수
const apiCall = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data; // APIResponse 구조에 따라 data 필드 추출
};

export const reviewTestService = {
  // 복습 시험 생성
  generateReviewTest: async (request: ReviewTestRequest): Promise<ReviewTestResponse> => {
    return apiCall<ReviewTestResponse>('/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // 복습 시험 제출
  submitReviewTest: async (answerRequest: ReviewTestAnswerRequest): Promise<ReviewTestResult> => {
    return apiCall<ReviewTestResult>('/submit', {
      method: 'POST',
      body: JSON.stringify(answerRequest),
    });
  },
};



