import React, { createContext, useContext, useState } from 'react';

export type Language = 'ko' | 'vi' | 'zh' | 'ja' | 'en';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ko: {
    appName: '반월',
    home: '홈',
    learning: '한국어 학습',
    board: '게시판',
    points: '포인트',
    currentPoints: '현재 포인트',
    moonProgress: '달 진행 상황',
    selfIntroduction: '자기소개',
    family: '가족',
    school: '학교',
    food: '음식',
    weather: '날씨',
    startLearning: '학습 시작',
    speakNow: '지금 말해보세요',
    listening: '듣고 있습니다...',
    tryAgain: '다시 시도',
    excellent: '훌륭해요!',
    goodJob: '잘했어요!',
    keepTrying: '계속 노력해요!',
    newPost: '새 게시글',
    writePost: '게시글 작성',
    posts: '게시글',
    welcome: '환영합니다',
    selectTopic: '주제를 선택하세요',
    practiceConversation: '회화 연습'
  },
  vi: {
    appName: '반월',
    home: 'Trang chủ',
    learning: 'Học tiếng Hàn',
    board: 'Bảng tin',
    points: 'Điểm',
    currentPoints: 'Điểm hiện tại',
    moonProgress: 'Tiến trình mặt trăng',
    selfIntroduction: 'Tự giới thiệu',
    family: 'Gia đình',
    school: 'Trường học',
    food: 'Đồ ăn',
    weather: 'Thời tiết',
    startLearning: 'Bắt đầu học',
    speakNow: 'Hãy nói bây giờ',
    listening: 'Đang nghe...',
    tryAgain: 'Thử lại',
    excellent: 'Xuất sắc!',
    goodJob: 'Làm tốt lắm!',
    keepTrying: 'Hãy tiếp tục cố gắng!',
    newPost: 'Bài viết mới',
    writePost: 'Viết bài',
    posts: 'Bài viết',
    welcome: 'Chào mừng',
    selectTopic: 'Chọn chủ đề',
    practiceConversation: 'Luyện hội thoại'
  },
  zh: {
    appName: '반월',
    home: '首页',
    learning: '韩语学习',
    board: '留言板',
    points: '积分',
    currentPoints: '当前积分',
    moonProgress: '月亮进度',
    selfIntroduction: '自我介绍',
    family: '家庭',
    school: '学校',
    food: '食物',
    weather: '天气',
    startLearning: '开始学习',
    speakNow: '现在请说话',
    listening: '正在听...',
    tryAgain: '再试一次',
    excellent: '太棒了！',
    goodJob: '做得好！',
    keepTrying: '继续努力！',
    newPost: '新帖子',
    writePost: '写帖子',
    posts: '帖子',
    welcome: '欢迎',
    selectTopic: '选择主题',
    practiceConversation: '对话练习'
  },
  ja: {
    appName: '반월',
    home: 'ホーム',
    learning: '韓国語学習',
    board: '掲示板',
    points: 'ポイント',
    currentPoints: '現在のポイント',
    moonProgress: '月の進捗',
    selfIntroduction: '自己紹介',
    family: '家族',
    school: '学校',
    food: '食べ物',
    weather: '天気',
    startLearning: '学習開始',
    speakNow: '今話してください',
    listening: '聞いています...',
    tryAgain: 'もう一度',
    excellent: '素晴らしい！',
    goodJob: 'よくできました！',
    keepTrying: '頑張り続けて！',
    newPost: '新しい投稿',
    writePost: '投稿を書く',
    posts: '投稿',
    welcome: 'ようこそ',
    selectTopic: 'トピックを選択',
    practiceConversation: '会話練習'
  },
  en: {
    appName: '반월',
    home: 'Home',
    learning: 'Korean Learning',
    board: 'Board',
    points: 'Points',
    currentPoints: 'Current Points',
    moonProgress: 'Moon Progress',
    selfIntroduction: 'Self Introduction',
    family: 'Family',
    school: 'School',
    food: 'Food',
    weather: 'Weather',
    startLearning: 'Start Learning',
    speakNow: 'Speak now',
    listening: 'Listening...',
    tryAgain: 'Try Again',
    excellent: 'Excellent!',
    goodJob: 'Good Job!',
    keepTrying: 'Keep Trying!',
    newPost: 'New Post',
    writePost: 'Write Post',
    posts: 'Posts',
    welcome: 'Welcome',
    selectTopic: 'Select Topic',
    practiceConversation: 'Practice Conversation'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations['ko']] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}