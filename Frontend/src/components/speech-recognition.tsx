import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from './language-context';

interface SpeechRecognitionProps {
  targetPhrase: string;
  onSuccess: () => void;
  onAttempt: () => void;
}

export function SpeechRecognition({ targetPhrase, onSuccess, onAttempt }: SpeechRecognitionProps) {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setFeedback('음성 인식이 지원되지 않는 브라우저입니다.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.lang = 'ko-KR';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setFeedback('');
    };

    recognitionRef.current.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      onAttempt();
      
      // Simple similarity check
      const similarity = calculateSimilarity(spokenText.toLowerCase(), targetPhrase.toLowerCase());
      
      if (similarity > 0.8) {
        setFeedback(t('excellent'));
        onSuccess();
      } else if (similarity > 0.6) {
        setFeedback(t('goodJob'));
      } else {
        setFeedback(t('keepTrying'));
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      setFeedback(`오류: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Simple Levenshtein distance for similarity calculation
  const calculateSimilarity = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    const maxLen = Math.max(str1.length, str2.length);
    return maxLen === 0 ? 1 : (maxLen - matrix[str2.length][str1.length]) / maxLen;
  };

  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-lg mb-4">연습할 문장: <strong>{targetPhrase}</strong></p>
          
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isListening ? <MicOff size={30} /> : <Mic size={30} />}
          </Button>
          
          <p className="mt-2 text-sm text-muted-foreground">
            {isListening ? t('listening') : t('speakNow')}
          </p>
        </div>

        {transcript && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">인식된 음성:</p>
            <p className="font-medium">{transcript}</p>
          </div>
        )}

        {feedback && (
          <div className={`p-3 rounded-lg text-center font-medium ${
            feedback === t('excellent') ? 'bg-green-100 text-green-800' :
            feedback === t('goodJob') ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {feedback}
          </div>
        )}
      </CardContent>
    </Card>
  );
}