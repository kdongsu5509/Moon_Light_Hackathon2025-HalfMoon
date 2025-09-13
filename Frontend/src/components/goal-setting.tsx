import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Target, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { getMonthlyGoal, setMonthlyGoal, deleteMonthlyGoal, GoalResponse } from '../api/goal';

interface GoalSettingProps {
  onBack: () => void;
}

export function GoalSetting({ onBack }: GoalSettingProps) {
  const [currentGoal, setCurrentGoal] = useState<GoalResponse | null>(null);
  const [newGoal, setNewGoal] = useState<number>(100);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSetting, setIsSetting] = useState(false);

  // 현재 목표 조회
  useEffect(() => {
    const loadCurrentGoal = async () => {
      try {
        setLoading(true);
        const goal = await getMonthlyGoal();
        setCurrentGoal(goal);
        if (goal?.goalPoints) {
          setNewGoal(goal.goalPoints);
        }
      } catch (error) {
        console.error('목표 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentGoal();
  }, []);

  // 목표 설정
  const handleSetGoal = async () => {
    if (newGoal <= 0) {
      setMessage('목표 포인트는 0보다 커야 합니다.');
      return;
    }

    try {
      setIsSetting(true);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM 형식
      
      await setMonthlyGoal({
        month: currentMonth,
        goal: newGoal
      });
      
      setMessage('목표가 성공적으로 설정되었습니다! 🎯');
      
      // 목표 재조회
      const updatedGoal = await getMonthlyGoal();
      setCurrentGoal(updatedGoal);
      
    } catch (error) {
      console.error('목표 설정 실패:', error);
      setMessage('목표 설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSetting(false);
    }
  };

  // 목표 삭제
  const handleDeleteGoal = async () => {
    try {
      setIsSetting(true);
      await deleteMonthlyGoal();
      setCurrentGoal(null);
      setMessage('목표가 삭제되었습니다.');
    } catch (error) {
      console.error('목표 삭제 실패:', error);
      setMessage('목표 삭제에 실패했습니다.');
    } finally {
      setIsSetting(false);
    }
  };

  const progressPercentage = currentGoal?.goalPoints 
    ? Math.min((currentGoal.currentPoints / currentGoal.goalPoints) * 100, 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">목표 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">월별 목표 설정</h1>
          </div>
        </div>

        {/* 현재 목표 상태 */}
        {currentGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Trophy className="w-5 h-5" />
                  현재 목표 ({currentGoal.month})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">목표 포인트</span>
                  <Badge variant="secondary" className="text-lg font-semibold">
                    {currentGoal.goalPoints?.toLocaleString()} P
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">현재 포인트</span>
                  <Badge variant="outline" className="text-lg font-semibold">
                    {currentGoal.currentPoints?.toLocaleString()} P
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">진행률</span>
                    <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteGoal}
                  disabled={isSetting}
                  className="w-full"
                >
                  목표 삭제
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 목표 설정 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Calendar className="w-5 h-5" />
                {currentGoal ? '목표 수정' : '새 목표 설정'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm font-medium">
                  목표 포인트
                </Label>
                <div className="relative">
                  <Input
                    id="goal"
                    type="number"
                    min="1"
                    max="10000"
                    value={newGoal}
                    onChange={(e) => setNewGoal(Number(e.target.value))}
                    className="pr-12 text-lg"
                    placeholder="목표 포인트를 입력하세요"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    P
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  학습 활동을 통해 포인트를 획득할 수 있습니다
                </p>
              </div>

              {/* 목표 추천 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">추천 목표</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[50, 100, 200, 500].map((goal) => (
                    <Button
                      key={goal}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewGoal(goal)}
                      className="justify-between"
                    >
                      {goal}P
                      <TrendingUp className="w-3 h-3" />
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSetGoal}
                disabled={isSetting || newGoal <= 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isSetting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    설정 중...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    {currentGoal ? '목표 수정' : '목표 설정'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* 메시지 */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-center"
          >
            {message}
          </motion.div>
        )}

        {/* 도움말 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 포인트 획득 방법</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 주제별 학습 완료: 10P</li>
                <li>• 복습 시험 정답: 5P</li>
                <li>• 챗봇 대화: 2P (메시지당)</li>
                <li>• 게시글 작성: 15P</li>
                <li>• 댓글 작성: 3P</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
