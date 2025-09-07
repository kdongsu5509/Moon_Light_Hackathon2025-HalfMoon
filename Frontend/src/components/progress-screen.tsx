import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { MoonMascot } from './moon-mascot';
import { Calendar, Book, MessageCircle, Trophy, Star, Flame } from 'lucide-react';

interface ProgressScreenProps {
  points: number;
  userProfile: any;
}

export function ProgressScreen({ points, userProfile }: ProgressScreenProps) {
  const monthlyGoal = 1000;
  const progressPercentage = Math.min((points / monthlyGoal) * 100, 100);
  
  const stats = [
    {
      title: '학습한 단어',
      value: Math.floor(points / 10),
      unit: '개',
      icon: Book,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '완료한 대화',
      value: Math.floor(points / 50),
      unit: '개',
      icon: MessageCircle,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '연속 학습일',
      value: 3,
      unit: '일',
      icon: Flame,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: '이번 달 순위',
      value: Math.max(1, Math.floor(Math.random() * 20) + 1),
      unit: '위',
      icon: Trophy,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const badges = [
    { 
      name: '첫 걸음', 
      description: '첫 학습 완료', 
      earned: points >= 10, 
      icon: '🐣',
      color: 'bg-green-100 text-green-800',
      category: 'basic'
    },
    { 
      name: '말하기 초보', 
      description: '발음 연습 10회', 
      earned: points >= 50, 
      icon: '🗣️',
      color: 'bg-blue-100 text-blue-800',
      category: 'speaking'
    },
    { 
      name: '단어 수집가', 
      description: '단어 50개 학습', 
      earned: points >= 100, 
      icon: '📚',
      color: 'bg-purple-100 text-purple-800',
      category: 'vocabulary'
    },
    { 
      name: '대화 달인', 
      description: '대화 연습 20회', 
      earned: points >= 200, 
      icon: '💬',
      color: 'bg-yellow-100 text-yellow-800',
      category: 'conversation'
    },
    { 
      name: '성실한 학습자', 
      description: '연속 7일 학습', 
      earned: points >= 300, 
      icon: '⭐',
      color: 'bg-pink-100 text-pink-800',
      category: 'consistency'
    },
    { 
      name: 'Sunrise Speaker', 
      description: '아침 학습 10회', 
      earned: points >= 150, 
      icon: '🌅',
      color: 'bg-orange-100 text-orange-800',
      category: 'timing'
    },
    { 
      name: '문법 마스터', 
      description: '문법 시험 90점 이상', 
      earned: points >= 400, 
      icon: '📝',
      color: 'bg-indigo-100 text-indigo-800',
      category: 'grammar'
    },
    { 
      name: '발음 달인', 
      description: '발음 평가 A등급', 
      earned: points >= 350, 
      icon: '🎤',
      color: 'bg-rose-100 text-rose-800',
      category: 'pronunciation'
    },
    { 
      name: '친구 만들기', 
      description: '게시판 글 10개 작성', 
      earned: points >= 250, 
      icon: '👥',
      color: 'bg-teal-100 text-teal-800',
      category: 'social'
    },
    { 
      name: '도움이 되는 친구', 
      description: '댓글 50개 작성', 
      earned: points >= 500, 
      icon: '💝',
      color: 'bg-emerald-100 text-emerald-800',
      category: 'social'
    },
    { 
      name: '완벽주의자', 
      description: '모든 주제 완료', 
      earned: points >= 800, 
      icon: '🏆',
      color: 'bg-amber-100 text-amber-800',
      category: 'achievement'
    },
    { 
      name: '한국어 전문가', 
      description: '고급 과정 완료', 
      earned: points >= 1000, 
      icon: '🎓',
      color: 'bg-violet-100 text-violet-800',
      category: 'mastery'
    },
    { 
      name: '문화 탐험가', 
      description: '문화 콘텐츠 20개 학습', 
      earned: points >= 450, 
      icon: '🏛️',
      color: 'bg-slate-100 text-slate-800',
      category: 'culture'
    },
    { 
      name: '시험 챔피언', 
      description: '시험 10회 만점', 
      earned: points >= 600, 
      icon: '🥇',
      color: 'bg-yellow-100 text-yellow-800',
      category: 'test'
    },
    { 
      name: '챗봇 마스터', 
      description: '챗봇 대화 100회', 
      earned: points >= 700, 
      icon: '🤖',
      color: 'bg-cyan-100 text-cyan-800',
      category: 'chatbot'
    },
    { 
      name: '월간 우수상', 
      description: '한 달 연속 1위', 
      earned: false, 
      icon: '🏅',
      color: 'bg-gold-100 text-gold-800',
      category: 'special'
    }
  ];

  const weeklyData = [
    { day: '월', points: 45 },
    { day: '화', points: 30 },
    { day: '수', points: 60 },
    { day: '목', points: 20 },
    { day: '금', points: 55 },
    { day: '토', points: 40 },
    { day: '일', points: 35 }
  ];

  const maxWeeklyPoints = Math.max(...weeklyData.map(d => d.points));

  const earnedBadges = badges.filter(badge => badge.earned);
  const unEarnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="web-container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl text-gray-800">나의 학습 진도</h1>
        <p className="text-gray-600 text-lg">멋진 성과를 확인해보세요! 🎉</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Monthly Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl opacity-90 mb-2">9월 목표 달성률</h3>
                    <div className="text-5xl font-bold">{Math.round(progressPercentage)}%</div>
                  </div>
                  <div className="relative w-20 h-20">
                    {/* 배경 달 (회색) */}
                    <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full shadow-inner opacity-50" />
                    
                    {/* 진행률에 따라 채워지는 달 */}
                    <motion.div
                      className="absolute inset-0 overflow-hidden rounded-full"
                      initial={{ clipPath: "inset(100% 0 0 0)" }}
                      animate={{ 
                        clipPath: `inset(${100 - progressPercentage}% 0 0 0)` 
                      }}
                      transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-full shadow-xl relative">
                        {/* 달 얼굴 - 진행률이 50% 이상일 때만 보이기 */}
                        {progressPercentage > 50 && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center text-2xl"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                          >
                            😊
                          </motion.div>
                        )}
                        
                        {/* 완성 시 반짝이 효과 */}
                        {progressPercentage >= 100 && (
                          <>
                            <motion.div
                              className="absolute -top-2 -right-2 text-lg"
                              animate={{
                                scale: [0.8, 1.3, 0.8],
                                rotate: [0, 180, 360],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            >
                              ✨
                            </motion.div>
                            <motion.div
                              className="absolute -bottom-2 -left-2 text-lg"
                              animate={{
                                scale: [1.3, 0.8, 1.3],
                                rotate: [360, 180, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.5,
                              }}
                            >
                              🌟
                            </motion.div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-lg opacity-90">
                    <span>현재 포인트: {points}</span>
                    <span>목표: {monthlyGoal}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-4">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                    />
                  </div>
                  <div className="text-lg opacity-80">
                    {progressPercentage >= 100 ? '목표 달성! 🎉' : `${monthlyGoal - points}포인트 더 필요해요!`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div
            className="grid md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className={`${stat.bgColor} border-0 hover:shadow-lg transition-shadow`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold mb-1">
                            {stat.value}{stat.unit}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stat.title}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Weekly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Calendar className="w-6 h-6" />
                  <span>이번 주 활동</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-40 space-x-4">
                  {weeklyData.map((day, index) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center space-y-3">
                      <motion.div
                        className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg"
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.points / maxWeeklyPoints) * 100}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      />
                      <div className="text-sm font-medium text-gray-600">{day.day}</div>
                      <div className="text-xs text-gray-500">{day.points}pt</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Badges */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🏆 획득한 배지 ({earnedBadges.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {earnedBadges.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">아직 획득한 배지가 없어요!</p>
                ) : (
                  earnedBadges.map((badge, index) => (
                    <motion.div
                      key={badge.name}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <Badge className={badge.color + ' mb-1'}>
                          {badge.name}
                        </Badge>
                        <div className="text-xs text-gray-600">
                          {badge.description}
                        </div>
                      </div>
                      <div className="text-green-500">✓</div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🎯 도전할 배지 ({unEarnedBadges.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {unEarnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.name}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border opacity-60 hover:opacity-80 transition-opacity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 0.6, x: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                  >
                    <div className="text-2xl grayscale">{badge.icon}</div>
                    <div className="flex-1">
                      <Badge className="bg-gray-200 text-gray-500 mb-1">
                        {badge.name}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {badge.description}
                      </div>
                    </div>
                    <div className="text-gray-400">🔒</div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl text-gray-800 mb-4">정말 잘하고 있어요!</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              꾸준히 학습하는 모습이 정말 멋져요. <br />
              내일도 함께 한국어 공부해요! 💪
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}