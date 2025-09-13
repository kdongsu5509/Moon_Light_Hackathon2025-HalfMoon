import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; 
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Book, MessageCircle, Trophy, Flame, Target, Settings } from "lucide-react";
import { Progress } from "./ui/progress";
import { getMyRecord, MyRecordResponse } from "../api/record"; 
import { getMonthlyGoal, GoalResponse } from "../api/goal";
import { getCompletionRate, CompletionRateResponse } from "../api/subject";
import { GoalSetting } from "./goal-setting";


interface ProgressScreenProps {
  points?: number;
  userProfile?: any;
}

export function ProgressScreen({ points: propPoints, userProfile }: ProgressScreenProps = {}) {
  const [record, setRecord] = useState<MyRecordResponse | null>(null);
  const [goal, setGoal] = useState<GoalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionRate, setCompletionRate] = useState<CompletionRateResponse | null>(null);
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('BEGINNER');

  // 주제명을 한국어로 변환하는 함수
  const getSubjectKoreanName = (subject: string) => {
    const subjectMap: { [key: string]: string } = {
      'SELFINTRODUCTION': '자기소개',
      'FAMILY': '가족',
      'SCHOOL': '학교',
      'FOOD': '음식',
      'WEATHER': '날씨'
    };
    return subjectMap[subject] || subject;
  };

  useEffect(() => {
    console.log("🚀 ProgressScreen 컴포넌트 마운트됨");
    console.log("📋 전달받은 props:", { propPoints, userProfile });
    
    // 토큰 확인
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    console.log("🔑 저장된 토큰들:", { 
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : '없음',
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : '없음'
    });
    
    const loadData = async () => {
      try {
        console.log("🔄 데이터 로딩 시작...");
        setLoading(true);
        
        // 학습 기록 조회
        console.log("🔍 학습 기록 API 호출 시작...");
        const recordData = await getMyRecord();
        console.log("📊 받은 학습 기록 데이터:", recordData);
        setRecord(recordData);
        
        // 완료율 조회 (선택된 난이도에 따라)
        const completionData = await getCompletionRate(selectedLevel as "BEGINNER" | "INTERMEDIATE" | "ADVANCED");
        setCompletionRate(completionData);
        
        // 월별 목표 조회 (실패해도 계속 진행)
        try {
          const goalData = await getMonthlyGoal();
          setGoal(goalData);
        } catch (goalError) {
          console.warn("월별 목표 조회 실패 (목표가 설정되지 않음):", goalError);
          setGoal(null); // 목표가 없음을 명시적으로 설정
        }
        
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedLevel]);

// 목표 설정 페이지에서 목표가 변경되면 다시 로드
const refreshGoal = async () => {
  try {
    const goalData = await getMonthlyGoal();
    setGoal(goalData);
  } catch (error) {
    console.warn("목표 재조회 실패:", error);
    setGoal(null);
  }
};

  if (showGoalSetting) {
    return (
      <GoalSetting 
        onBack={() => {
          setShowGoalSetting(false);
          refreshGoal(); // 목표 설정 페이지에서 돌아올 때 목표 새로고침
        }} 
      />
    );
  }

  if (loading) {
    return <p className="text-center text-gray-500">불러오는 중...</p>;
  }

  if (!record) {
    return <p className="text-center text-red-500">데이터를 가져오지 못했습니다.</p>;
  }

  const currentPoints = goal?.currentPoints ?? 0;   // ⬅️ goal API 값 사용
const goalPoints = goal?.goalPoints ?? 1000;      // ⬅️ 미설정 시 기본값
const progressPercentage = Math.min((currentPoints / goalPoints) * 100, 100);

  // ✅ API 데이터 기반 stats
  const stats = [
    {
      title: "학습한 단어",
      value: record.wordCnt,
      unit: "개",
      icon: Book,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "완료한 대화",
      value: record.talkCnt,
      unit: "개",
      icon: MessageCircle,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "연속 학습일",
      value: record.continueDay,
      unit: "일",
      icon: Flame,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "이번 달 순위",
      value: record.myRank,
      unit: "위",
      icon: Trophy,
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  // ✅ 기존 badge/weeklyData 부분은 그대로 두고 points만 교체
  const badges = [
    { 
      name: "첫 걸음", 
      description: "첫 학습 완료", 
      earned: record.wordCnt >= 1, 
      icon: "🐣",
      color: "bg-green-100 text-green-800",
      category: "basic",
    },
    { 
      name: "말하기 초보", 
      description: "대화 10회 완료", 
      earned: record.talkCnt >= 10, 
      icon: "🗣️",
      color: "bg-blue-100 text-blue-800",
      category: "speaking",
    },
    { 
      name: "성실한 학습자", 
      description: "연속 7일 학습", 
      earned: record.continueDay >= 7, 
      icon: "⭐",
      color: "bg-pink-100 text-pink-800",
      category: "consistency",
    },
    { 
      name: "랭킹 챔피언", 
      description: "1위 달성", 
      earned: record.myRank === 1, 
      icon: "🏆",
      color: "bg-amber-100 text-amber-800",
      category: "achievement",
    },
  ];

  const weeklyData = [
    { day: "월", points: 45 },
    { day: "화", points: 30 },
    { day: "수", points: 60 },
    { day: "목", points: 20 },
    { day: "금", points: 55 },
    { day: "토", points: 40 },
    { day: "일", points: 35 },
  ];
  const maxWeeklyPoints = Math.max(...weeklyData.map((d) => d.points));

  const earnedBadges = badges.filter((badge) => badge.earned);
  const unEarnedBadges = badges.filter((badge) => !badge.earned);

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

{/* 목표 관리 버튼 */}
<div className="flex justify-end mb-4">
  <Button
    onClick={() => setShowGoalSetting(true)}
    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
  >
    <Target className="w-4 h-4 mr-2" />
    목표 설정
  </Button>
</div>


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
                    <span>현재 포인트: {currentPoints}</span>
                    <span>목표: {goalPoints ?? "미설정"}</span>
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
{progressPercentage >= 100
    ? '목표 달성! 🎉'
    : goalPoints
      ? `${goalPoints - currentPoints}포인트 더 필요해요!`
      : '목표가 설정되지 않았습니다'}
</div>

                </div>
              </CardContent>
            </Card>
          </motion.div>

          {completionRate && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">📊 주제별 학습 진도</CardTitle>
          <div className="flex space-x-2">
            {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className={`text-xs ${
                  selectedLevel === level 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : ''
                }`}
              >
                {level === 'BEGINNER' ? '초급' : 
                 level === 'INTERMEDIATE' ? '중급' : '고급'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completionRate.subjectCompletionRates.map((item, index) => (
            <div key={item.subject} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {getSubjectKoreanName(item.subject)}
                </span>
                <span className="text-sm text-gray-600 font-semibold">
                  {item.completionRate.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={item.completionRate} 
                className="h-3"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
)}


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