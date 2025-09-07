import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './language-context';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, MessageSquare, TrendingUp, Star, Calendar, Users } from 'lucide-react';
import { MoonMascot } from './moon-mascot';
import { SettingsMenu } from './settings-menu';

interface HomeDashboardProps {
  points: number;
  userProfile: any;
  onNavigate: (tab: string) => void;
  isDarkMode?: boolean;
  onDarkModeToggle?: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

export function HomeDashboard({ 
  points, 
  userProfile, 
  onNavigate, 
  isDarkMode = false, 
  onDarkModeToggle = () => {}, 
  onLogout = () => {}, 
  onDeleteAccount = () => {} 
}: HomeDashboardProps) {
  const { t } = useLanguage();

  const quickActions = [
    {
      id: 'learning',
      title: '한국어 학습',
      description: '상황별 회화 연습하기',
      icon: BookOpen,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      emoji: '📚'
    },
    {
      id: 'board',
      title: '친구들과 소통',
      description: '게시판에서 이야기 나누기',
      icon: MessageSquare,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      emoji: '💬'
    }
  ];

  const achievements = [
    { 
      label: '연속 학습', 
      value: '3일', 
      icon: '🔥',
      color: 'text-orange-600 bg-orange-50'
    },
    { 
      label: '학습한 단어', 
      value: `${Math.floor(points / 10)}개`, 
      icon: '📝',
      color: 'text-blue-600 bg-blue-50'
    },
    { 
      label: '완료한 대화', 
      value: `${Math.floor(points / 50)}개`, 
      icon: '🗣️',
      color: 'text-green-600 bg-green-50'
    },
    { 
      label: '획득 배지', 
      value: points > 500 ? '3개' : points > 200 ? '2개' : '1개', 
      icon: '🏆',
      color: 'text-yellow-600 bg-yellow-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <motion.header 
        className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 shadow-sm border-b relative overflow-hidden"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Soft night sky stars */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="web-container mx-auto flex items-center justify-between p-6 relative z-10">
          <div className="flex items-center space-x-4">
            <h1 className="banwol-title text-3xl text-transparent bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-100 bg-clip-text">반월</h1>
            {/* 자연스러운 반달 아이콘 */}
            <motion.div
              className="text-2xl"
              animate={{
                filter: [
                  "drop-shadow(0 0 8px rgba(255, 217, 61, 0.3))",
                  "drop-shadow(0 0 12px rgba(255, 217, 61, 0.5))",
                  "drop-shadow(0 0 8px rgba(255, 217, 61, 0.3))"
                ],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🌙
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-200 bg-white/12 backdrop-blur-sm px-4 py-2 rounded-full border border-white/25">
              {points} 포인트
            </div>
            <SettingsMenu
              isDarkMode={isDarkMode}
              onDarkModeToggle={onDarkModeToggle}
              onLogout={onLogout}
              onDeleteAccount={onDeleteAccount}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('progress')}
              className="w-12 h-12 bg-white/12 backdrop-blur-sm border border-white/25 rounded-full flex items-center justify-center text-white text-xl shadow-md p-0 hover:scale-110 transition-transform hover:bg-white/20"
              title="학습 기록과 통계 보기"
            >
              {userProfile?.avatar ? 
                ['🐭', '🐂', '🐅', '🐰', '🐉', '🐍', '🐴', '🐐', '🐵', '🐓', '🐕', '🐷'][
                  ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'].indexOf(userProfile.avatar)
                ] || '🐭' : '🐭'}
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="web-container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-3xl mb-2">
            {userProfile?.avatar ? 
              ['🐱', '🐶', '🐰', '🐻', '🦊', '🐼', '🐨', '🐵', '🦄', '🐉', '🦉', '🐧', '🐹', '🐯', '🦁', '🐸'][
                ['cat', 'dog', 'rabbit', 'bear', 'fox', 'panda', 'koala', 'monkey', 'unicorn', 'dragon', 'owl', 'penguin', 'hamster', 'tiger', 'lion', 'frog'].indexOf(userProfile.avatar)
              ] || '🐱' : '🐱'}
          </div>
          <h1 className="text-3xl text-gray-800 mb-2">
            안녕, {userProfile?.nickname || '친구'}야! 👋
          </h1>
          <p className="text-lg text-gray-600 mb-6">오늘도 함께 한국어를 배워볼까요?</p>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => onNavigate('progress')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="scale-75 relative">
                {/* 진행률에 따른 달 모양 */}
                <div className="relative w-16 h-16">
                  {/* 배경 달 (회색) */}
                  <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shadow-inner opacity-40" />
                  
                  {/* 진행률에 따라 채워지는 달 */}
                  <motion.div
                    className="absolute inset-0 overflow-hidden rounded-full"
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ 
                      clipPath: `inset(${100 - Math.min((points / 1000) * 100, 100)}% 0 0 0)` 
                    }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full shadow-lg relative">
                      {/* 달 얼굴 - 진행률이 50% 이상일 때만 보이기 */}
                      {Math.min((points / 1000) * 100, 100) > 50 && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center text-lg"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1, duration: 0.5 }}
                        >
                          😊
                        </motion.div>
                      )}
                      
                      {/* 반짝이 효과 */}
                      {Math.min((points / 1000) * 100, 100) > 75 && (
                        <>
                          <motion.div
                            className="absolute -top-1 -right-1 text-xs"
                            animate={{
                              scale: [0.8, 1.2, 0.8],
                              rotate: [0, 180, 360],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: 0.5,
                            }}
                          >
                            ✨
                          </motion.div>
                          <motion.div
                            className="absolute -bottom-1 -left-1 text-xs"
                            animate={{
                              scale: [1.2, 0.8, 1.2],
                              rotate: [360, 180, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: 1,
                            }}
                          >
                            ✨
                          </motion.div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">9월 학습 진행률</h3>
                <div className="text-3xl font-bold text-gray-900">{points} / 1000</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">{Math.round((points/1000)*100)}% 완료</div>
              <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((points / 1000) * 100, 100)}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">클릭하여 상세보기 →</div>
            </div>
          </div>
        </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl text-gray-800 text-center mb-8">무엇을 할까요?</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card 
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white border border-gray-200 h-full"
                onClick={() => onNavigate(action.id)}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-3xl">
                    {action.emoji}
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-800 mb-3 font-medium">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {action.description}
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-md py-3 text-lg"
                  >
                    시작하기 →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievement Stats */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl text-gray-800 text-center">나의 기록</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{achievement.icon}</span>
                  </div>
                  <div className="text-2xl font-bold mb-2">{achievement.value}</div>
                  <div className="text-sm text-gray-600">{achievement.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Today's Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="text-lg text-gray-800 mb-2">오늘의 한국어 팁</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "안녕하세요"는 언제나 사용할 수 있는 인사말이에요. 
                  친구에게는 "안녕"이라고 짧게 말할 수도 있어요! 😊
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}