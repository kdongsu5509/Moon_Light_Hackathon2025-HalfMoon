import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TopicLearning } from './topic-learning';
import { LearningTest } from './learning-test';
import { ChatbotPractice } from './chatbot-practice';
import { BookOpen, Brain, MessageCircle, GraduationCap, Trophy, Star } from 'lucide-react';
import { getCompletionRate, CompletionRateResponse } from '../api/subject';
import { Progress } from './ui/progress';

const topics = [
  { 
    id: 'selfIntroduction', 
    title: '자기소개',
    description: '이름, 나이, 취미 소개하기',
    emoji: '👋',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    image: '🧑‍💼'
  },
  { 
    id: 'family', 
    title: '가족',
    description: '가족 구성원과 관계 표현',
    emoji: '👨‍👩‍👧‍👦',
    color: 'from-green-400 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    image: '🏠'
  },
  { 
    id: 'school', 
    title: '학교',
    description: '학교생활과 친구들',
    emoji: '🏫',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    image: '📚'
  },
  { 
    id: 'food', 
    title: '음식',
    description: '좋아하는 음식 이야기하기',
    emoji: '🍽️',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100',
    image: '🍕'
  },
  { 
    id: 'weather', 
    title: '날씨',
    description: '날씨와 계절 표현하기',
    emoji: '🌤️',
    color: 'from-cyan-400 to-cyan-600',
    bgColor: 'from-cyan-50 to-cyan-100',
    image: '🌈'
  }
];

const levels = ['beginner', 'intermediate', 'advanced'];
const levelInfo = {
  beginner: { name: '초급', icon: '🌱', color: 'bg-green-100 text-green-700' },
  intermediate: { name: '중급', icon: '🌿', color: 'bg-yellow-100 text-yellow-700' },
  advanced: { name: '고급', icon: '🌳', color: 'bg-purple-100 text-purple-700' }
};

interface LearningEnhancedProps {
  onPointsEarned: (points: number) => void;
}

export function LearningEnhanced({ onPointsEarned }: LearningEnhancedProps) {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('beginner');
  const [activeMode, setActiveMode] = useState<'topics' | 'test' | 'chatbot'>('topics');
  const [completionRate, setCompletionRate] = useState<CompletionRateResponse | null>(null);

  // 완료율 데이터 로드 (선택된 난이도에 따라)
  useEffect(() => {
    const loadCompletionRate = async () => {
      try {
        const level = selectedLevel.toUpperCase() as "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
        const data = await getCompletionRate(level);
        setCompletionRate(data);
      } catch (error) {
        console.error("완료율 조회 실패:", error);
      }
    };
    loadCompletionRate();
  }, [selectedLevel]);

  // 주제별 완료율 가져오기
  const getTopicCompletionRate = (topicId: string) => {
    if (!completionRate) return 0;
    
    const subjectMap: { [key: string]: string } = {
      'selfIntroduction': 'SELFINTRODUCTION',
      'family': 'FAMILY',
      'school': 'SCHOOL',
      'food': 'FOOD',
      'weather': 'WEATHER'
    };
    
    const subject = subjectMap[topicId];
    const rate = completionRate.subjectCompletionRates.find(item => item.subject === subject);
    return rate ? rate.completionRate : 0;
  };

  if (activeMode === 'test') {
    const reviewTestSubject = localStorage.getItem('reviewTestSubject') || 'SELFINTRODUCTION';
    const reviewTestLevel = localStorage.getItem('reviewTestLevel') || selectedLevel.toUpperCase();
    
    return (
      <LearningTest 
        onBack={() => {
          localStorage.removeItem('reviewTestSubject');
          localStorage.removeItem('reviewTestLevel');
          setActiveMode('topics');
        }}
        onPointsEarned={onPointsEarned}
        subject={reviewTestSubject}
        studyLevel={reviewTestLevel}
        questionCount={5}
      />
    );
  }

  if (activeMode === 'chatbot') {
    return (
      <ChatbotPractice 
        onBack={() => setActiveMode('topics')}
        onPointsEarned={onPointsEarned}
      />
    );
  }

  if (selectedTopic) {
    return (
      <TopicLearning
        topic={selectedTopic}
        level={selectedLevel}
        onBack={() => setSelectedTopic(null)}
        onPointsEarned={onPointsEarned}
        onStartReviewTest={(topic, level) => {
          setSelectedTopic(null);
          setActiveMode('test');
          // 주제를 영어로 변환하는 함수 필요
          const subjectMap: { [key: string]: string } = {
            'selfIntroduction': 'SELFINTRODUCTION',
            'family': 'FAMILY',
            'school': 'SCHOOL',
            'food': 'FOOD',
            'weather': 'WEATHER'
          };
          // 복습 시험을 위한 상태 저장 (실제로는 context나 state management 사용)
          localStorage.setItem('reviewTestSubject', subjectMap[topic] || 'SELFINTRODUCTION');
          localStorage.setItem('reviewTestLevel', level.toUpperCase());
        }}
      />
    );
  }

  return (
    <div className="web-container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-4xl">📚</div>
        <h2 className="text-3xl text-gray-800">한국어 학습</h2>
        <p className="text-gray-600 text-lg">단계별로 체계적인 한국어 학습을 시작해보세요!</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              📖
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">주제별 학습</h3>
              <p className="text-sm text-gray-600">일상 대화 상황별 학습</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
          onClick={() => setActiveMode('test')}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              📝
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">복습 시험</h3>
              <p className="text-sm text-gray-600">배운 내용 확인하기</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          onClick={() => setActiveMode('chatbot')}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">대화 연습</h3>
              <p className="text-sm text-gray-600">AI와 실시간 대화</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Level Selection */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-medium text-gray-800">학습 수준을 선택하세요</h3>
        <div className="flex space-x-4">
          {levels.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              onClick={() => setSelectedLevel(level)}
              className={`flex items-center space-x-2 ${
                selectedLevel === level 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : ''
              }`}
            >
              <span>{levelInfo[level as keyof typeof levelInfo].icon}</span>
              <span>{levelInfo[level as keyof typeof levelInfo].name}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Topics Grid */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-gray-800">주제별 학습</h3>
          <Badge className={levelInfo[selectedLevel as keyof typeof levelInfo].color}>
            {levelInfo[selectedLevel as keyof typeof levelInfo].icon} {levelInfo[selectedLevel as keyof typeof levelInfo].name} 수준
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => {
            const topicCompletionRate = getTopicCompletionRate(topic.id);
            return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${topic.bgColor} border-0 h-full`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                <CardHeader className="text-center space-y-4 pb-4">
                  <div className={`w-20 h-20 bg-gradient-to-r ${topic.color} rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-lg`}>
                    {topic.emoji}
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{topic.title}</CardTitle>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Visual Learning Materials */}
                    <div className="bg-white/70 rounded-xl p-4">
                      <div className="flex items-center justify-center space-x-4 mb-3">
                        <div className="text-3xl">{topic.image}</div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">학습 자료</div>
                          <div className="text-sm font-medium">🎯 15개 문장</div>
                          <div className="text-sm font-medium">🖼️ 시각 자료</div>
                          <div className="text-sm font-medium">🎵 음성 파일</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress for current level */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{levelInfo[selectedLevel as keyof typeof levelInfo].name} 진도</span>
                        <span>{topicCompletionRate.toFixed(1)}% 완료</span>
                      </div>
                      <Progress 
                        value={topicCompletionRate} 
                        className="h-2 bg-white/70"
                      />
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${topic.color} hover:opacity-90 text-white border-0 shadow-md`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTopic(topic.id);
                      }}
                    >
                      학습 시작하기 →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Learning Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">💡</div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">효과적인 학습 방법</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>매일 조금씩 꾸준히 학습하세요</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>음성을 따라 하며 발음을 연습하세요</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>배운 표현을 일상에서 사용해보세요</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>복습 시험으로 실력을 확인하세요</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}