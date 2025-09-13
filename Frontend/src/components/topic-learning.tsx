import React, { useState, useEffect } from 'react';
import { useLanguage } from './language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { SpeechRecognition } from './speech-recognition';
import { ArrowLeft, Play } from 'lucide-react';
import { startSubject } from "../api/subjectStart";   // ✅ 수정된 부분
import { doneSentence } from "../api/subject-done";

interface Sentence {
  id: string;        // 문장 UUID
  sentence: string;  // 한국어 문장
  meaning: string;   // 영어 번역
  isDone: boolean;   // 완료 여부
}

interface TopicLearningProps {
  topic: string;
  level?: string;
  onBack: () => void;
  onPointsEarned: (points: number) => void;
}

export function TopicLearning({ topic, level = 'beginner', onBack, onPointsEarned }: TopicLearningProps) {
  const { t } = useLanguage();

  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [loading, setLoading] = useState(true);

  // 현재 문장
  const currentSentence = sentences[currentPhraseIndex];

  // ✅ 주제 학습 시작 (API에서 문장 불러오기)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await startSubject(topic.toUpperCase(), level?.toUpperCase() || "BEGINNER");
        if (data && data.sentences) {
          setSentences(data.sentences);
        }
      } catch (err) {
        console.error("❌ 학습 데이터를 불러오는 중 오류:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [topic, level]);

  // 오디오 재생
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlayingAudio(false);
      speechSynthesis.speak(utterance);
    }
  };

  // 문장 완료 처리
  const handleSuccess = async () => {
    const currentSentenceId = currentSentence?.id;
    try {
      if (currentSentenceId) {
        const success = await doneSentence(currentSentenceId);
        if (success) console.log("✅ 문장 완료 처리 성공:", currentSentenceId);
      }

      onPointsEarned(10);

      if (currentPhraseIndex < sentences.length - 1) {
        setTimeout(() => {
          setCurrentPhraseIndex(currentPhraseIndex + 1);
        }, 1500);
      } else {
        onPointsEarned(50); // 모든 문장 완료 시 보너스
      }
    } catch (err) {
      console.error("❌ 문장 완료 처리 실패:", err);
    }
  };

  // 시도만 했을 때
  const handleAttempt = () => {
    onPointsEarned(2);
  };

  if (loading) {
    return <div className="text-center py-10">⏳ 학습 데이터를 불러오는 중...</div>;
  }

  if (sentences.length === 0) {
    return <div className="text-center py-10 text-gray-500">⚠️ 학습할 문장이 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>
        <h2 className="text-2xl">{t(topic)}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {t('practiceConversation')} ({currentPhraseIndex + 1}/{sentences.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Learning Card */}
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-6xl mb-4">📝</div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-2xl mb-4 font-medium text-gray-800">
                  {currentSentence?.sentence}
                </p>
                <p className="text-sm text-gray-600">
                  {currentSentence?.meaning}
                </p>
                <Button
                  onClick={() => playAudio(currentSentence?.sentence || "")}
                  disabled={isPlayingAudio}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isPlayingAudio ? '재생 중...' : '발음 듣기'}
                </Button>
              </div>

              {/* Level indicator */}
              <div className="text-sm text-gray-600">
                {level === 'beginner' && '🌱 초급 수준'}
                {level === 'intermediate' && '🌿 중급 수준'}
                {level === 'advanced' && '🌳 고급 수준'}
              </div>
            </div>
          </div>

          {/* 음성 인식 */}
          <SpeechRecognition
            targetPhrase={currentSentence?.sentence || ""}
            onSuccess={handleSuccess}
            onAttempt={handleAttempt}
          />

          {/* 이전/다음 버튼 */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPhraseIndex(Math.max(0, currentPhraseIndex - 1))}
              disabled={currentPhraseIndex === 0}
            >
              이전 문장
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPhraseIndex(Math.min(sentences.length - 1, currentPhraseIndex + 1))}
              disabled={currentPhraseIndex === sentences.length - 1}
            >
              다음 문장
            </Button>
          </div>

          {/* 완료 메시지 */}
          {currentPhraseIndex === sentences.length - 1 && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">축하합니다! 이 주제를 완료했습니다! 🎉</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}