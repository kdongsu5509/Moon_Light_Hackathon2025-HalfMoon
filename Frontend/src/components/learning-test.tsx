import React, { useState, useEffect } from 'react';

import { motion } from 'motion/react';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Button } from './ui/button';

import { Badge } from './ui/badge';

import { Progress } from './ui/progress';

import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, Loader2 } from 'lucide-react';

import { submitReviewTest, ReviewTestAnswer, ReviewTestSubmitResponse } from '../api/reviewTestSubmit';

import { generateReviewTest, ReviewTestQuestion, ReviewTestGenerateResponse } from '../api/reviewTestGenerate';

interface LearningTestProps {

onBack: () => void;

onPointsEarned: (points: number) => void;

subject?: string;

studyLevel?: string;

questionCount?: number;

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

export function LearningTest({ onBack, onPointsEarned, subject = 'SELFINTRODUCTION', studyLevel = 'BEGINNER', questionCount = 5 }: LearningTestProps) {

const [questions, setQuestions] = useState<ReviewTestQuestion[]>([]);

const [currentQuestion, setCurrentQuestion] = useState(0);

const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);

const [userAnswer, setUserAnswer] = useState('');

const [answers, setAnswers] = useState<ReviewTestAnswer[]>([]);

const [showResult, setShowResult] = useState(false);

const [timeLeft, setTimeLeft] = useState(600); // 10분

const [isFinished, setIsFinished] = useState(false);

const [isLoading, setIsLoading] = useState(true);

const [testId, setTestId] = useState<string>('');

const [testResult, setTestResult] = useState<ReviewTestSubmitResponse | null>(null);

const [error, setError] = useState<string | null>(null);

// 퀴즈 로드

useEffect(() => {

const loadQuestions = async () => {

  try {

    setIsLoading(true);

    setError(null);

    

    const response = await generateReviewTest({

subject,

studyLevel,

questionCount

});

setQuestions(response.questions);

    setTestId(response.testId);

    setTimeLeft(response.timeLimit * 60); // 분을 초로 변환

  } catch (err) {

    console.error('퀴즈 로드 실패:', err);

    setError(err instanceof Error ? err.message : '퀴즈를 불러오는데 실패했습니다.');

    // 에러 발생 시 기본 퀴즈 사용

    setQuestions(testQuestions.map((q, index) => ({

      id: `q${index + 1}`,

      type: q.type,

      question: q.question,

      options: q.options,

      correctAnswer: q.type === 'multiple' ? q.options![q.correct as number] : q.correct as string,

      explanation: q.explanation,

      image: q.image || '📝',

      originalSentence: q.question

    })));

    setTestId('fallback-test');

  } finally {

    setIsLoading(false);

  }

};



loadQuestions();

}, [subject, studyLevel, questionCount]);

useEffect(() => {

if (timeLeft > 0 && !isFinished && !isLoading) {

  const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

  return () => clearTimeout(timer);

} else if (timeLeft === 0) {

  handleFinishTest();

}

}, [timeLeft, isFinished, isLoading]);

const formatTime = (seconds: number) => {

const mins = Math.floor(seconds / 60);

const secs = seconds % 60;

return `${mins}:${secs.toString().padStart(2, '0')}`;

};

const handleAnswerSelect = (answer: string | number) => {

setSelectedAnswer(answer);

};

const handleNext = () => {

const currentQ = questions[currentQuestion];

if (!currentQ) return;



const answerValue = currentQ.type === 'fill' ? userAnswer : 

                   currentQ.type === 'multiple' ? (selectedAnswer !== null ? currentQ.options![selectedAnswer as number] : '') : '';



const newAnswer: ReviewTestAnswer = {

  questionId: currentQ.id,

  userAnswer: answerValue

};



const newAnswers = [...answers, newAnswer];

setAnswers(newAnswers);



if (currentQuestion < questions.length - 1) {

  setCurrentQuestion(currentQuestion + 1);

  setSelectedAnswer(null);

  setUserAnswer('');

} else {

  handleFinishTest(newAnswers);

}

};

const handleFinishTest = async (finalAnswers?: ReviewTestAnswer[]) => {

setIsFinished(true);

const answersToCheck = finalAnswers || answers;



try {

// 서버에 답안 제출

const result = await submitReviewTest({

testId,

answers: answersToCheck

});

if (result) {

setTestResult(result);

onPointsEarned(result.earnedPoints);

setShowResult(true);

} else {

throw new Error("서버 응답이 없습니다.");

}

} catch (err) {

console.error('시험 제출 실패:', err);

// 서버 제출 실패 시 로컬에서 점수 계산

  let correct = 0;

  questions.forEach((q, index) => {

    const userAns = answersToCheck[index]?.userAnswer;

    if (userAns && userAns.toLowerCase().includes(q.correctAnswer.toLowerCase())) {

      correct++;

    }

  });



  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  const points = Math.round(score * 2);

  

  setTestResult({

    testId,

    totalQuestions: questions.length,

    correctAnswers: correct,

    score,

    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D',

    earnedPoints: points,

    questionResults: questions.map((q, index) => ({

      questionId: q.id,

      question: q.question,

      correctAnswer: q.correctAnswer,

      userAnswer: answersToCheck[index]?.userAnswer || '',

      isCorrect: answersToCheck[index]?.userAnswer?.toLowerCase().includes(q.correctAnswer.toLowerCase()) || false,

      explanation: q.explanation

    }))

  });

  

  onPointsEarned(points);

  setShowResult(true);

}

};

const getScore = () => {

if (testResult) {

  return testResult.correctAnswers;

}



let correct = 0;

questions.forEach((q, index) => {

  const userAns = answers[index]?.userAnswer;

  if (userAns && userAns.toLowerCase().includes(q.correctAnswer.toLowerCase())) {

    correct++;

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

// 로딩 중일 때

if (isLoading) {

return (

  <div className="web-container mx-auto p-6">

    <div className="max-w-2xl mx-auto space-y-6">

      <div className="flex items-center justify-center h-64">

        <div className="text-center space-y-4">

          <Loader2 className="w-8 h-8 animate-spin mx-auto" />

          <p className="text-lg text-gray-600">복습 시험을 준비하고 있습니다...</p>

        </div>

      </div>

    </div>

  </div>

);

}

// 에러가 있을 때

if (error && questions.length === 0) {

return (

  <div className="web-container mx-auto p-6">

    <div className="max-w-2xl mx-auto space-y-6">

      <div className="text-center space-y-4">

        <div className="text-6xl">😞</div>

        <h2 className="text-2xl text-gray-800">시험을 불러올 수 없습니다</h2>

        <p className="text-gray-600">{error}</p>

        <Button onClick={onBack} className="mt-4">

          돌아가기

        </Button>

      </div>

    </div>

  </div>

);

}

if (showResult && testResult) {

const correctAnswers = testResult.correctAnswers;

const score = testResult.score;

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

              <div className="text-xl font-bold text-red-600">{testResult.totalQuestions - correctAnswers}</div>

            </div>

            <div className="space-y-2">

              <div className="text-2xl">🏆</div>

              <div className="text-sm text-gray-600">획득 포인트</div>

              <div className="text-xl font-bold text-blue-600">{testResult.earnedPoints}</div>

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

          {testResult.questionResults.map((result, index) => (

            <div key={result.questionId} className="border rounded-lg p-4">

              <div className="flex items-start space-x-3">

                <div className="text-2xl">📝</div>

                <div className="flex-1">

                  <div className="flex items-center space-x-2 mb-2">

                    <span className="font-medium">문제 {index + 1}</span>

                    {result.isCorrect ? (

                      <CheckCircle className="w-5 h-5 text-green-600" />

                    ) : (

                      <XCircle className="w-5 h-5 text-red-600" />

                    )}

                  </div>

                  <p className="mb-2">{result.question}</p>

                  <div className="text-sm text-gray-600">

                    <div>정답: {result.correctAnswer}</div>

                    <div>내 답: {result.userAnswer || '답 안함'}</div>

                    <div className="mt-2 p-2 bg-blue-50 rounded">{result.explanation}</div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </CardContent>

      </Card>

    </motion.div>

  </div>

);

}

const question = questions[currentQuestion];

if (!question) {

return (

  <div className="web-container mx-auto p-6">

    <div className="max-w-2xl mx-auto space-y-6">

      <div className="text-center space-y-4">

        <div className="text-6xl">😞</div>

        <h2 className="text-2xl text-gray-800">문제를 불러올 수 없습니다</h2>

        <Button onClick={onBack} className="mt-4">

          돌아가기

        </Button>

      </div>

    </div>

  </div>

);

}

const progress = ((currentQuestion + 1) / questions.length) * 100;

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

          {currentQuestion + 1} / {questions.length}

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

            <CardTitle className="text-xl">문제 {currentQuestion + 1}</CardTitle>

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

              {currentQuestion === questions.length - 1 ? '완료' : '다음'}

            </Button>

          </div>

        </CardContent>

      </Card>

    </motion.div>

  </div>

</div>

);

}