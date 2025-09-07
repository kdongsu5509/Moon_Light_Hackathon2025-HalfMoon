import React, { useState } from 'react';
import { useLanguage } from './language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { SpeechRecognition } from './speech-recognition';
import { ArrowLeft, Play } from 'lucide-react';

const topicData = {
  selfIntroduction: {
    beginner: {
      phrases: [
        '안녕하세요.',
        '저는 김민수입니다.',
        '저는 열 살입니다.',
        '만나서 반가워요.'
      ],
      images: ['👋', '🙋‍♂️', '🎂', '😊']
    },
    intermediate: {
      phrases: [
        '안녕하세요. 저는 김민수라고 합니다.',
        '저는 베트남에서 온 열 살 학생입니다.',
        '한국에 온 지 6개월 됐어요.',
        '한국어를 열심히 공부하고 있어요.'
      ],
      images: ['👋', '🌏', '📅', '📚']
    },
    advanced: {
      phrases: [
        '안녕하세요. 저는 김민수라고 하며, 베트남에서 온 초등학생입니다.',
        '한국에 온 지 6개월이 지났지만, 아직도 한국어가 어려워요.',
        '그래도 매일 열심히 공부해서 많이 늘었다고 생각해요.',
        '앞으로도 계속 노력해서 한국어를 잘하고 싶어요.'
      ],
      images: ['🎓', '📈', '💪', '🌟']
    }
  },
  family: {
    beginner: {
      phrases: [
        '우리 가족은 네 명이에요.',
        '아버지, 어머니, 저, 동생이에요.',
        '아버지는 회사원이에요.',
        '어머니는 요리를 잘해요.'
      ],
      images: ['👨‍👩‍👧‍👦', '👨', '👩', '🍳']
    },
    intermediate: {
      phrases: [
        '우리 가족은 모두 네 명으로 구성되어 있어요.',
        '아버지는 회사에서 일하시고, 어머니는 집에서 요리를 하세요.',
        '저에게는 귀여운 여동생이 한 명 있어요.',
        '주말에는 온 가족이 함께 시간을 보내요.'
      ],
      images: ['👪', '💼', '👧', '🎮']
    },
    advanced: {
      phrases: [
        '저희 가족은 아버지, 어머니, 저, 그리고 두 살 어린 여동생으로 이루어져 있습니다.',
        '아버지께서는 무역회사에서 근무하시며, 어머니께서는 집안일을 담당하고 계세요.',
        '여동생은 아직 어리지만 매우 영리하고 활발한 성격을 가지고 있어요.',
        '가족들과 함께하는 시간이 저에게는 가장 소중하고 행복한 순간들입니다.'
      ],
      images: ['❤️', '🏢', '🧠', '✨']
    }
  },
  school: {
    beginner: {
      phrases: [
        '저는 초등학생이에요.',
        '학교는 집에서 가까워요.',
        '친구들이 많아요.',
        '공부가 재미있어요.'
      ],
      images: ['🏫', '🚶', '👫', '📖']
    },
    intermediate: {
      phrases: [
        '저는 서울에 있는 초등학교에 다녀요.',
        '학교까지는 걸어서 10분 정도 걸려요.',
        '반에는 25명의 친구들이 있어서 매일 즐거워요.',
        '특히 미술 시간과 체육 시간을 가장 좋아해요.'
      ],
      images: ['🏙️', '⏰', '👥', '🎨']
    },
    advanced: {
      phrases: [
        '저는 서울 강남구에 위치한 대치초등학교 3학년에 재학중입니다.',
        '학교는 지하철역에서 가까워서 교통이 매우 편리한 편이에요.',
        '우리 반 친구들은 모두 친절하고 도움을 많이 주어서 학교 생활이 즐거워요.',
        '앞으로도 열심히 공부해서 좋은 성적을 받고 싶어요.'
      ],
      images: ['🏢', '🚇', '🤝', '🏆']
    }
  },
  food: {
    beginner: {
      phrases: [
        '저는 김치를 좋아해요.',
        '아침에는 밥을 먹어요.',
        '점심에는 라면을 먹어요.',
        '과일도 좋아해요.'
      ],
      images: ['🥬', '🍚', '🍜', '🍎']
    },
    intermediate: {
      phrases: [
        '저는 한국 음식 중에서 김치찌개를 가장 좋아해요.',
        '아침에는 보통 밥과 미역국을 먹어요.',
        '점심시간에는 친구들과 함께 급식을 먹어요.',
        '저녁 후에는 가끔 달콤한 과일을 디저트로 먹어요.'
      ],
      images: ['🍲', '🥣', '🍽️', '🍓']
    },
    advanced: {
      phrases: [
        '저는 한국의 전통 음식인 김치찌개와 된장찌개를 특히 좋아합니다.',
        '아침식사로는 주로 밥과 미역국, 그리고 여러 가지 반찬을 먹어요.',
        '학교 급식은 영양가 있고 맛있어서 점심시간이 항상 기다려져요.',
        '건강을 위해 매일 신선한 채소와 과일을 충분히 섭취하려고 노력해요.'
      ],
      images: ['🥘', '🥗', '⚖️', '💚']
    }
  },
  weather: {
    beginner: {
      phrases: [
        '오늘 날씨가 좋아요.',
        '비가 와요.',
        '날씨가 추워요.',
        '햇빛이 따뜻해요.'
      ],
      images: ['☀️', '🌧️', '❄️', '🌤️']
    },
    intermediate: {
      phrases: [
        '오늘은 맑고 화창한 날씨예요.',
        '어제는 하루 종일 비가 내렸어요.',
        '겨울이라서 날씨가 많이 춥고 바람도 강해요.',
        '봄이 되면 꽃이 피고 날씨가 따뜻해져요.'
      ],
      images: ['🌈', '☔', '🌨️', '🌸']
    },
    advanced: {
      phrases: [
        '오늘은 구름 한 점 없는 맑은 하늘에 따뜻한 햇살이 비춰서 기분이 좋아요.',
        '어제는 갑작스럽게 소나기가 내려서 우산을 가져오지 않아 곤란했어요.',
        '겨울철에는 기온이 영하로 떨어져서 두꺼운 옷을 입어야 해요.',
        '한국의 사계절은 각각 다른 매력이 있어서 계절이 바뀔 때마다 새로운 느낌이에요.'
      ],
      images: ['🌅', '☂️', '🧥', '🍂']
    }
  }
};

interface TopicLearningProps {
  topic: string;
  level?: string;
  onBack: () => void;
  onPointsEarned: (points: number) => void;
}

export function TopicLearning({ topic, level = 'beginner', onBack, onPointsEarned }: TopicLearningProps) {
  const { t } = useLanguage();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const levelData = topicData[topic as keyof typeof topicData]?.[level as keyof typeof topicData[keyof typeof topicData]];
  const phrases = levelData?.phrases || [];
  const images = levelData?.images || [];
  const currentPhrase = phrases[currentPhraseIndex];
  const currentImage = images[currentPhraseIndex];

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

  const handleSuccess = () => {
    onPointsEarned(10);
    if (currentPhraseIndex < phrases.length - 1) {
      setTimeout(() => {
        setCurrentPhraseIndex(currentPhraseIndex + 1);
      }, 1500);
    } else {
      onPointsEarned(50); // Bonus for completing all phrases
    }
  };

  const handleAttempt = () => {
    onPointsEarned(2);
  };

  return (
    <div className="space-y-6">
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
            {t('practiceConversation')} ({currentPhraseIndex + 1}/{phrases.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-6">
            {/* Visual Learning Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-6xl mb-4">{currentImage}</div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-2xl mb-4 font-medium text-gray-800">{currentPhrase}</p>
                <Button
                  onClick={() => playAudio(currentPhrase)}
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

          <SpeechRecognition
            targetPhrase={currentPhrase}
            onSuccess={handleSuccess}
            onAttempt={handleAttempt}
          />

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
              onClick={() => setCurrentPhraseIndex(Math.min(phrases.length - 1, currentPhraseIndex + 1))}
              disabled={currentPhraseIndex === phrases.length - 1}
            >
              다음 문장
            </Button>
          </div>

          {currentPhraseIndex === phrases.length - 1 && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">축하합니다! 이 주제를 완료했습니다! 🎉</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}