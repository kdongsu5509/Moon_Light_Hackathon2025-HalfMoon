import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface LearningTestProps {
  onBack: () => void;
  onPointsEarned: (points: number) => void;
}

interface Question {
  id: number;
  type: 'multiple' | 'fill' | 'pronunciation';
  question: string;
  options?: string[];
  correct: string | number;
  explanation: string;
  image?: string;
}

const testQuestions: Question[] = [
  {
    id: 1,
    type: 'multiple',
    question: '"안녕하세요"의 올바른 사용 시간은?',
    options: ['아침에만', '저녁에만', '언제나', '점심에만'],
    correct: 2,
    explanation: '"안녕하세요"는 하루 중 언제든지 사용할 수 있는 기본 인사말입니다.',
    image: '👋'
  },
  {
    id: 2,
    type: 'fill',
    question: '빈칸에 들어갈 말은? "저는 ___살입니다."',
    correct: '열',
    explanation: '나이를 말할 때는 "열살", "스무살"처럼 순우리말 숫자를 사용합니다.',
    image: '🎂'
  },
  {
    id: 3,
    type: 'multiple',
    question: '가족을 소개할 때 "아버지"의 높임말은?',
    options: ['아빠', '아버님', '아버지', '할아버지'],
    correct: 1,
    explanation: '다른 사람에게 자신의 아버지를 소개할 때는 "아버님"이라고 높여서 말합니다.',
    image: '👨'
  },
  {
    id: 4,
    type: 'multiple',
    question: '학교에서 친구에게 하는 인사는?',
    options: ['안녕하세요', '안녕', '반갑습니다', '처음 뵙겠습니다'],
    correct: 1,
    explanation: '친구처럼 가까운 사이에서는 "안녕"이라고 간단히 인사할 수 있습니다.',
    image: '👫'
  },
  {
    id: 5,
    type: 'fill',
    question: '빈칸에 들어갈 말은? "김치찌개를 ___해요."',
    correct: '좋아',
    explanation: '좋아하는 음식을 말할 때는 "좋아해요"라고 표현합니다.',
    image: '🍲'
  }
];

export function LearningTest({ onBack, onPointsEarned }: LearningTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10분
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinishTest();
    }
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const answer = testQuestions[currentQuestion].type === 'fill' ? userAnswer : selectedAnswer;
    const newAnswers = [...answers, answer as string | number];
    setAnswers(newAnswers);

    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setUserAnswer('');
    } else {
      handleFinishTest(newAnswers);
    }
  };

  const handleFinishTest = (finalAnswers?: (string | number)[]) => {
    setIsFinished(true);
    const answersToCheck = finalAnswers || answers;
    
    // 점수 계산
    let correct = 0;
    testQuestions.forEach((q, index) => {
      const userAns = answersToCheck[index];
      if (q.type === 'fill') {
        if (typeof userAns === 'string' && userAns.includes(q.correct as string)) {
          correct++;
        }
      } else {
        if (userAns === q.correct) {
          correct++;
        }
      }
    });

    const score = Math.round((correct / testQuestions.length) * 100);
    const points = Math.round(score * 2); // 점수에 따른 포인트
    onPointsEarned(points);
    setShowResult(true);
  };

  const getScore = () => {
    let correct = 0;
    testQuestions.forEach((q, index) => {
      const userAns = answers[index];
      if (q.type === 'fill') {
        if (typeof userAns === 'string' && userAns.includes(q.correct as string)) {
          correct++;
        }
      } else {
        if (userAns === q.correct) {
          correct++;
        }
      }
    });
    return correct;
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600', message: '훌륭해요!' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600', message: '잘했어요!' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600', message: '조금 더 노력해요!' };
    return { grade: 'D', color: 'text-red-600', message: '다시 공부해볼까요?' };
  };

  if (showResult) {
    const correctAnswers = getScore();
    const score = Math.round((correctAnswers / testQuestions.length) * 100);
    const gradeInfo = getGrade(score);

    return (
      <div className="web-container mx-auto p-6">
        <motion.div
          className="max-w-2xl mx-auto space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center">
            <CardHeader>
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className="text-2xl">시험 완료!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className={`text-6xl font-bold ${gradeInfo.color}`}>
                  {gradeInfo.grade}
                </div>
                <div className="text-3xl">{score}점</div>
                <div className="text-lg text-gray-600">{gradeInfo.message}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl">✅</div>
                  <div className="text-sm text-gray-600">정답</div>
                  <div className="text-xl font-bold text-green-600">{correctAnswers}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">❌</div>
                  <div className="text-sm text-gray-600">오답</div>
                  <div className="text-xl font-bold text-red-600">{testQuestions.length - correctAnswers}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">🏆</div>
                  <div className="text-sm text-gray-600">획득 포인트</div>
                  <div className="text-xl font-bold text-blue-600">{Math.round(score * 2)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={onBack} className="w-full">
                  학습 메뉴로 돌아가기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 상세 결과 */}
          <Card>
            <CardHeader>
              <CardTitle>상세 결과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testQuestions.map((q, index) => {
                const userAns = answers[index];
                const isCorrect = q.type === 'fill' 
                  ? typeof userAns === 'string' && userAns.includes(q.correct as string)
                  : userAns === q.correct;

                return (
                  <div key={q.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{q.image}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">문제 {q.id}</span>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <p className="mb-2">{q.question}</p>
                        <div className="text-sm text-gray-600">
                          <div>정답: {q.type === 'multiple' ? q.options![q.correct as number] : q.correct}</div>
                          <div>내 답: {q.type === 'multiple' ? (q.options![userAns as number] || '선택 안함') : (userAns || '답 안함')}</div>
                          <div className="mt-2 p-2 bg-blue-50 rounded">{q.explanation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const question = testQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

  return (
    <div className="web-container mx-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className={timeLeft < 60 ? 'text-red-600 font-bold' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} / {testQuestions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>진행률</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="text-center space-y-4">
                <div className="text-4xl">{question.image}</div>
                <CardTitle className="text-xl">문제 {question.id}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-center font-medium">
                {question.question}
              </div>

              {question.type === 'multiple' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto py-4"
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="mr-3 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {question.type === 'fill' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="답을 입력하세요"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full p-4 border rounded-lg text-center text-lg"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={
                    question.type === 'multiple' 
                      ? selectedAnswer === null 
                      : !userAnswer.trim()
                  }
                  className="px-8"
                >
                  {currentQuestion === testQuestions.length - 1 ? '완료' : '다음'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}