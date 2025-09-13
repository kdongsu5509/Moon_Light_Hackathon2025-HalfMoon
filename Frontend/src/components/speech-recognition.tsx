import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from './language-context';

interface SpeechRecognitionProps {
  conversationId: string;
  onSuccess: () => void;
  onAttempt: () => void;
}

// 발음 평가 API 호출 함수
async function evaluatePronunciation(audioBlob: Blob, token: string) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.wav');
  
  const response = await fetch('http://3.36.107.16:80/api/pron/evaluate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return data.data; // 발음 평가 점수 (1-10)
}

export function SpeechRecognition({ conversationId, onSuccess, onAttempt }: SpeechRecognitionProps) {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setFeedback('음성 녹음이 지원되지 않는 브라우저입니다.');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      setIsRecording(false);
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

      const token = localStorage.getItem('accessToken') || '';
      try {
        const score = await evaluatePronunciation(audioBlob, token);
        setAIResponse(`발음 평가 점수: ${score}/10`);
        onSuccess();
      } catch (error) {
        console.error('발음 평가 오류:', error);
        setFeedback('발음 평가 중 오류가 발생했습니다.');
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
    setFeedback('');
    setAIResponse('');
    onAttempt();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <div className="text-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isRecording ? <MicOff size={30} /> : <Mic size={30} />}
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            {isRecording ? t('recording') : t('clickToSpeak')}
          </p>
        </div>
        {feedback && <div className="text-red-600 font-semibold">{feedback}</div>}
        {aiResponse && (
          <div className="text-center">
            <h4 className="font-semibold text-lg mb-2">발음 평가 결과</h4>
            <p className="text-blue-600 font-bold">{aiResponse}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
