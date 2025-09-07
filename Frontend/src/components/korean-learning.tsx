import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TopicLearning } from './topic-learning';

const topics = [
  { 
    id: 'selfIntroduction', 
    title: '자기소개',
    description: '이름, 나이, 취미 소개하기',
    emoji: '👋',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    illustration: '🧑‍💼'
  },
  { 
    id: 'family', 
    title: '가족',
    description: '가족 구성원과 관계 표현',
    emoji: '👨‍👩‍👧‍👦',
    color: 'from-green-400 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    illustration: '🏠'
  },
  { 
    id: 'school', 
    title: '학교',
    description: '학교생활과 친구들',
    emoji: '🏫',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    illustration: '📚'
  },
  { 
    id: 'food', 
    title: '음식',
    description: '좋아하는 음식 이야기하기',
    emoji: '🍽️',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100',
    illustration: '🍕'
  },
  { 
    id: 'weather', 
    title: '날씨',
    description: '날씨와 계절 표현하기',
    emoji: '🌤️',
    color: 'from-cyan-400 to-cyan-600',
    bgColor: 'from-cyan-50 to-cyan-100',
    illustration: '🌈'
  }
];

interface KoreanLearningProps {
  onPointsEarned: (points: number) => void;
}

export function KoreanLearning({ onPointsEarned }: KoreanLearningProps) {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  if (selectedTopic) {
    return (
      <TopicLearning
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
        onPointsEarned={onPointsEarned}
      />
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-4xl">📚</div>
        <h2 className="text-2xl text-gray-800">한국어 학습</h2>
        <p className="text-gray-600">어떤 주제로 대화를 연습할까요?</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center space-x-6 text-center">
          <div>
            <div className="text-xl">🎯</div>
            <div className="text-sm text-gray-600">오늘의 목표</div>
            <div className="text-lg">50포인트</div>
          </div>
          <div className="w-px h-12 bg-yellow-300"></div>
          <div>
            <div className="text-xl">⭐</div>
            <div className="text-sm text-gray-600">연속 학습</div>
            <div className="text-lg">3일</div>
          </div>
          <div className="w-px h-12 bg-yellow-300"></div>
          <div>
            <div className="text-xl">🏆</div>
            <div className="text-sm text-gray-600">완료한 주제</div>
            <div className="text-lg">2개</div>
          </div>
        </div>
      </motion.div>

      {/* Topic Selection */}
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r ${topic.bgColor} border-0`}
              onClick={() => setSelectedTopic(topic.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Topic Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${topic.color} rounded-2xl flex items-center justify-center text-2xl`}>
                    {topic.emoji}
                  </div>
                  
                  {/* Topic Info */}
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-800 mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {topic.description}
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-white/70 rounded-full h-2">
                        <div 
                          className={`h-full bg-gradient-to-r ${topic.color} rounded-full`}
                          style={{ width: `${Math.random() * 60 + 20}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {Math.floor(Math.random() * 3) + 1}/5 완료
                      </span>
                    </div>
                  </div>
                  
                  {/* Illustration */}
                  <div className="text-3xl opacity-60">
                    {topic.illustration}
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Encouragement Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">🌟</div>
            <h4 className="text-lg text-gray-800 mb-2">학습 팁!</h4>
            <p className="text-sm text-gray-600">
              매일 하나의 주제씩 연습하면 한국어 실력이 빨리 늘어요. 
              친구나 가족과 함께 연습해보세요! 🗣️
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}