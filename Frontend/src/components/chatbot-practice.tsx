import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Send, Mic, MicOff, Bot, User } from 'lucide-react';

// 대화 삭제 API 호출 함수 유지
async function deleteConversation(conversationId: string, token: string) {
  const response = await fetch(`/api/chat/delete/${conversationId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

// 대화 시작 API 호출 함수 (GET에 subject 있음 → 요청 파라미터로 전달)
async function startConversation(subject: string, token: string) {
  // GET 기준이지만, 명세에 Request Body 있는 경우 rare함. 보통 query param으로 넣음.
  // 단순화 위해 subject를 쿼리 파라미터로 처리 가정
  const url = `/api/chat/start?subject=${encodeURIComponent(subject)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.code !== 200) throw new Error('대화 시작 실패');
  return data.data.conversationId;
}

// 대화 이어가기 API
async function continueConversation(talkId: string, userInput: string, token: string) {
  const response = await fetch('/api/chat/continue', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      talkId,
      userInput,
    }),
  });
  const data = await response.json();
  if (data.code !== 200) throw new Error('API 에러');
  return data.data;
}

// TTS API (생략, 위와 동일)

// ... 시나리오, botResponses, 타입 등 기존 유지 ...

export function ChatbotPractice({
  onBack,
  onPointsEarned,
}: ChatbotPracticeProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null); // UI 시나리오용
  const [conversationId, setConversationId] = useState<string | null>(null); // 실제 대화 ID 관리
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 시나리오 선택 + 대화 시작 API 호출하여 conversationId 획득
  const startScenario = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setMessageCount(0);
    setMessages([]);
    const token = localStorage.getItem('jwtToken') || '';
    try {
      // 시나리오 id를 subject로 사용
      const newConversationId = await startConversation(scenarioId.toUpperCase(), token);
      setConversationId(newConversationId);

      // 초기 봇 메시지
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: botResponses[scenarioId as keyof typeof botResponses].initial,
        isBot: true,
        timestamp: new Date(),
        scenario: scenarioId,
      };
      setMessages([initialMessage]);
    } catch (error) {
      alert('대화 시작 실패: ' + error.message);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessageCount((prev) => prev + 1);
    onPointsEarned(2);

    try {
      const token = localStorage.getItem('jwtToken') || '';
      const aiResponseText = await continueConversation(conversationId, inputMessage, token);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // TTS 연동 (생략 가능)
      // const audioBlob = await getSpeechFromTTS(aiResponseText, token);
      // const audioUrl = URL.createObjectURL(audioBlob);
      // setAudioUrl(audioUrl);
      // if (audioRef.current) audioRef.current.play();

    } catch (error) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '서버에 연결하지 못했습니다. 나중에 다시 시도해주세요.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInputMessage('');

    if (messageCount + 1 >= 10) {
      setTimeout(() => onPointsEarned(20), 1500);
    }
  };

  // handleDelete 등 기존 유지...

  if (!selectedScenario) {
    return (
      <div className="web-container mx-auto p-6 space-y-6">
        {/* 시나리오 선택 UI, Button onClick={() => startScenario(scenario.id)} */}
        {/* 기존 시나리오 목록 UI 유지 */}
      </div>
    );
  }

  const currentScenario = scenarios.find((s) => s.id === selectedScenario)!;
  return (
    <div className="web-container mx-auto p-6">
      {/* Header, 메시지 UI, Input 영역 기존 코드를 적절히 유지 */}
      {/* TTS용 audio 태그는 유지해도 됨 */}
    </div>
  );
}
