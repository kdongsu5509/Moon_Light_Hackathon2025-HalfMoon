import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Send, Mic, MicOff, Bot, User } from 'lucide-react';

interface ChatbotPracticeProps {
  onBack: () => void;
  onPointsEarned: (points: number) => void;
}

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  scenario?: string;
}

const scenarios = [
  {
    id: 'greeting',
    name: '인사하기',
    description: '처음 만나는 사람과 인사 나누기',
    icon: '👋',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'shopping',
    name: '쇼핑하기',
    description: '가게에서 물건 사고 대화하기',
    icon: '🛒',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'restaurant',
    name: '음식점에서',
    description: '음식점에서 주문하고 대화하기',
    icon: '🍽️',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'school',
    name: '학교에서',
    description: '선생님, 친구들과 대화하기',
    icon: '🏫',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'family',
    name: '가족과 대화',
    description: '가족들과 일상 대화하기',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-pink-100 text-pink-800'
  }
];

// 기존 로컬 봇 응답 (API 실패 시 fallback으로 사용)
const botResponses = {
  greeting: {
    initial: "안녕하세요! 저는 AI 한국어 선생님이에요. 처음 만나서 반가워요! 자기소개를 해주세요.",
    responses: {
      "안녕": "안녕하세요! 정말 반가워요. 이름이 뭐예요?",
      "안녕하세요": "네, 안녕하세요! 만나서 정말 기뻐요. 어디서 오셨어요?",
      "반가워요": "저도 정말 반가워요! 한국어 공부한 지 얼마나 됐어요?",
      "이름": "좋은 이름이네요! 저는 반월이라고 불러주세요. 취미가 뭐예요?",
      "처음": "처음 뵙겠습니다! 잘 부탁드려요. 오늘 기분이 어때요?",
      default: "좋아요! 그런데 조금 더 자세히 말해주실 수 있나요? 예를 들어 '안녕하세요, 저는 ○○입니다'라고 말해보세요."
    }
  },
  shopping: {
    initial: "안녕하세요! 편의점에 오신 것을 환영합니다. 무엇을 찾고 계세요?",
    responses: {
      "물": "물이 필요하시군요! 냉장고에 있어요. 어떤 물을 원하세요?",
      "우유": "우유는 냉장고 안쪽에 있어요. 얼마나 필요하세요?",
      "과자": "과자는 3번 선반에 있어요. 어떤 과자를 좋아하세요?",
      "얼마": "이거는 1,500원이에요. 계산해드릴까요?",
      "계산": "네, 계산해드릴게요. 현금으로 내시나요, 카드로 내시나요?",
      default: "죄송해요, 잘 못 들었어요. 다시 말씀해주세요. '○○이 어디 있어요?' 이렇게 물어보세요."
    }
  },
  restaurant: {
    initial: "어서오세요! 한식당에 오신 것을 환영합니다. 몇 분이세요?",
    responses: {
      "한명": "한 분이시군요! 이쪽 자리로 안내해드릴게요. 메뉴 보시겠어요?",
      "두명": "두 분이시군요! 창가 자리 어떠세요? 메뉴판 가져다드릴게요.",
      "메뉴": "네, 여기 메뉴판이에요. 오늘 추천은 김치찌개와 불고기예요!",
      "김치찌개": "김치찌개 정말 맛있어요! 밥이랑 반찬도 나와요. 주문하시겠어요?",
      "불고기": "불고기도 인기가 많아요! 야채도 함께 나와요. 음료수는 뭘로 드릴까요?",
      "주문": "네, 주문 받겠습니다! 김치찌개 하나요? 음료수는 어떻게 하시겠어요?",
      default: "죄송해요, 다시 한 번 말씀해주세요. '○○ 주세요' 또는 '○○ 있어요?' 이렇게 말해보세요."
    }
  },
  school: {
    initial: "안녕! 새로 온 친구구나? 나는 지수야. 너는 이름이 뭐야?",
    responses: {
      "안녕": "안녕! 반가워! 몇 학년이야?",
      "이름": "좋은 이름이네! 어느 나라에서 왔어?",
      "학년": "우리 같은 학년이네! 좋아하는 과목이 뭐야?",
      "나라": "와, 정말 멀리서 왔구나! 한국 어때?",
      "과목": "나도 그 과목 좋아해! 같이 공부할까?",
      "한국": "한국 생활이 어때? 어려운 것 있으면 언제든 물어봐!",
      default: "응? 잘 못 들었어. 다시 말해줄래? 친구들끼리는 편하게 말해도 돼!"
    }
  },
  family: {
    initial: "얘야, 학교 다녀왔니? 오늘 학교에서 뭐 했어?",
    responses: {
      "네": "그래, 잘했어. 오늘 뭐 배웠는지 엄마한테 말해줄래?",
      "한국어": "한국어 공부했구나! 어려웠어? 엄마가 도와줄까?",
      "친구": "친구들이랑 뭐 했어? 재밌게 놀았니?",
      "숙제": "숙제 있어? 있으면 먼저 하고 저녁 먹자.",
      "배고파": "배고프구나! 뭐 먹고 싶어? 엄마가 만들어줄게.",
      "피곤해": "많이 피곤하구나. 조금 쉬다가 저녁 먹자.",
      default: "응? 엄마가 잘 못 들었나? 천천히 다시 말해봐."
    }
  }
};

export function ChatbotPractice({ onBack, onPointsEarned }: ChatbotPracticeProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isApiEnabled, setIsApiEnabled] = useState(true); // API 사용 여부를 제어하는 상태
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // API 헤더 설정
  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken') || '';
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
    };
  };

  // 대화 시작 API 호출
  const startConversation = async (subject: string) => {
    const url = `/api/chat/start?subject=${encodeURIComponent(subject)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error('대화 시작 실패');
    return data.data.conversationId;
  };

  // 대화 이어가기 API 호출
  const continueConversation = async (talkId: string, userInput: string) => {
    const response = await fetch('/api/chat/continue', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ talkId, userInput }),
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error('대화 이어가기 실패');
    return data.data;
  };

  // TTS API 호출
  const getSpeechFromTTS = async (text: string) => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('TTS 실패');
    return await response.blob();
  };

  // 시나리오 시작 함수
  const startScenario = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setMessageCount(0);
    setConversationId(null);

    // API를 사용하는 경우
    if (isApiEnabled) {
      try {
        const convId = await startConversation(scenarioId.toUpperCase());
        setConversationId(convId);
        
        // API에서 초기 메시지를 받지 못하는 경우 로컬 메시지 사용
        const initialMessage: Message = {
          id: Date.now().toString(),
          content: botResponses[scenarioId as keyof typeof botResponses].initial,
          isBot: true,
          timestamp: new Date(),
          scenario: scenarioId
        };
        setMessages([initialMessage]);
      } catch (error) {
        console.warn('API 대화 시작 실패, 로컬 모드로 전환:', error);
        setIsApiEnabled(false);
        startLocalScenario(scenarioId);
      }
    } else {
      startLocalScenario(scenarioId);
    }
  };

  // 로컬 시나리오 시작
  const startLocalScenario = (scenarioId: string) => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      content: botResponses[scenarioId as keyof typeof botResponses].initial,
      isBot: true,
      timestamp: new Date(),
      scenario: scenarioId
    };
    setMessages([initialMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedScenario) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageCount(prev => prev + 1);

    // 포인트 지급 (메시지당 2포인트)
    onPointsEarned(2);

    const currentInput = inputMessage;
    setInputMessage('');

    // API를 사용하는 경우
    if (isApiEnabled && conversationId) {
      try {
        const aiResponseText = await continueConversation(conversationId, currentInput);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponseText,
          isBot: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);

        // TTS 시도
        try {
          const audioBlob = await getSpeechFromTTS(aiResponseText);
          const url = URL.createObjectURL(audioBlob);
          if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play().catch(console.error);
          }
        } catch (ttsError) {
          console.warn('TTS 실패:', ttsError);
        }

      } catch (error) {
        console.warn('API 응답 실패, 로컬 응답 사용:', error);
        generateLocalBotResponse(currentInput, selectedScenario);
      }
    } else {
      // 로컬 응답 생성
      setTimeout(() => {
        generateLocalBotResponse(currentInput, selectedScenario);
      }, 1000);
    }

    // 10개 메시지마다 보너스 포인트
    if (messageCount + 1 >= 10) {
      setTimeout(() => onPointsEarned(20), 1500);
    }
  };

  // 로컬 봇 응답 생성
  const generateLocalBotResponse = (userInput: string, scenario: string) => {
    const botResponse = generateBotResponse(userInput, scenario);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botResponse,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // 봇 응답 생성 로직 (기존 코드)
  const generateBotResponse = (userInput: string, scenario: string): string => {
    const scenarioResponses = botResponses[scenario as keyof typeof botResponses].responses;
    const lowerInput = userInput.toLowerCase();

    // 키워드 매칭
    for (const [keyword, response] of Object.entries(scenarioResponses)) {
      if (keyword !== 'default' && lowerInput.includes(keyword)) {
        return response;
      }
    }

    // 기본 응답
    return scenarioResponses.default;
  };

  // 음성 인식 시작
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('음성 인식이 지원되지 않는 브라우저입니다.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // 시나리오 선택 화면
  if (!selectedScenario) {
    return (
      <div className="web-container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <div>
            <h2 className="text-2xl text-gray-800">AI 대화 연습</h2>
            <p className="text-gray-600">상황별 대화를 연습해보세요!</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 h-full"
                onClick={() => startScenario(scenario.id)}
              >
                <CardHeader className="text-center space-y-4">
                  <div className="text-4xl">{scenario.icon}</div>
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-gray-600">{scenario.description}</p>
                  <Badge className={scenario.color}>
                    대화 연습
                  </Badge>
                  <Button className="w-full">
                    시작하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🤖</div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">AI 대화 연습 방법</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 상황에 맞는 대화를 선택하세요</li>
                  <li>• 자연스러운 대화를 나누어보세요</li>
                  <li>• 음성 입력도 가능해요</li>
                  <li>• 메시지를 보낼 때마다 포인트를 받아요</li>
                  <li>• AI 응답에는 음성도 제공됩니다</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentScenario = scenarios.find(s => s.id === selectedScenario)!;

  // 대화 화면
  return (
    <div className="web-container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedScenario(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              시나리오 선택
            </Button>
            <Badge className={currentScenario.color}>
              {currentScenario.icon} {currentScenario.name}
            </Badge>
            {!isApiEnabled && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                로컬 모드
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500">
            메시지 수: {messageCount} • 획득 포인트: {messageCount * 2 + (Math.floor(messageCount / 10) * 20)}
          </div>
        </div>

        {/* Chat Area */}
        <Card className="h-[500px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>AI 대화 연습</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[70%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    message.isBot 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
                      : 'bg-gradient-to-r from-purple-400 to-purple-600'
                  }`}>
                    {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  }`}>
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={startVoiceRecognition}
                disabled={isListening}
                className={isListening ? 'bg-red-100' : ''}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Hidden Audio Element for TTS */}
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}