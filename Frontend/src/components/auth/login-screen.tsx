import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const nativeLanguages = [
  { value: 'VIETNAMESE', label: '베트남어' },
  { value: 'CHINESE', label: '중국어' },
  { value: 'JAPANESE', label: '일본어' },
  { value: 'ENGLISH', label: '영어' },
];

const koreanLevels = [
  { value: 'LOW', label: '초급' },
  { value: 'MID', label: '중급' },
  { value: 'HIGH', label: '고급' },
  { value: 'ADVANCED', label: '심화' },
];

export function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    age: '',
    nativeLanguage: nativeLanguages[0].value,
    koreanLevel: koreanLevels[0].value,
  });

  const [emailUnique, setEmailUnique] = useState<boolean | null>(null);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailCheckError, setEmailCheckError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    setEmailUnique(null);
    setEmailCheckError('');
    if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);

    if (!isLogin && email) {
      emailCheckTimeout.current = setTimeout(() => {
        checkEmailUnique(email);
      }, 300); // 500ms -> 300ms로 단축
    }
  };

  const checkEmailUnique = async (email: string) => {
    // 이메일 형식 검증 먼저 수행
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailUnique(null);
      setEmailCheckError('');
      setEmailCheckLoading(false);
      return;
    }

    setEmailCheckLoading(true);
    setEmailCheckError('');
    try {
      const res = await fetch('http://3.36.107.16:80/api/signup/email-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (res.status === 200) {
        if (typeof result?.data?.isUnique === 'boolean') {
          setEmailUnique(result.data.isUnique);
        } else {
          setEmailUnique(null);
        }
      } else {
        setEmailUnique(null);
        setEmailCheckError('이메일 확인 중 오류가 발생했습니다.');
      }
    } catch {
      setEmailUnique(null);
      setEmailCheckError('네트워크 오류가 발생했습니다.');
    } finally {
      setEmailCheckLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    const fd = new FormData();
    fd.append('username', formData.email);
    fd.append('password', formData.password);

    try {
      const res = await fetch('http://3.36.107.16:80/api/login', {
        method: 'POST',
        body: fd,
      });

      // 응답 상태 확인
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      // 응답 본문이 있는지 확인
      const responseText = await res.text();
      if (!responseText) {
        throw new Error('서버에서 빈 응답을 받았습니다.');
      }

      // JSON 파싱 시도
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.error('응답 텍스트:', responseText);
        throw new Error('서버 응답이 올바른 JSON 형식이 아닙니다.');
      }

      console.log('로그인 응답:', {
        status: res.status,
        data: data
      });

      // JWT 토큰 저장
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      alert('로그인 성공!');
      onLogin();
    } catch (e) {
      console.error('로그인 오류:', e);
      
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      
      if (e instanceof Error) {
        if (e.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
        } else if (e.message.includes('HTTP 401')) {
          errorMessage = '아이디 또는 비밀번호가 일치하지 않습니다.';
        } else if (e.message.includes('HTTP 400')) {
          errorMessage = '필수 입력값이 누락되었습니다.';
        } else if (e.message.includes('빈 응답')) {
          errorMessage = '서버에서 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.';
        } else if (e.message.includes('JSON')) {
          errorMessage = '서버 응답에 문제가 있습니다. 관리자에게 문의해주세요.';
        } else {
          errorMessage = `오류: ${e.message}`;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleSignUp = async () => {
    // 중복 제출 방지
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. 비밀번호 확인 검증
      if (formData.password !== formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      // 2. 필수 필드 검증
      if (
        !formData.email ||
        !formData.password ||
        !formData.name ||
        !formData.nickname ||
        !formData.age ||
        !formData.nativeLanguage ||
        !formData.koreanLevel
      ) {
        alert('모든 필수 정보를 입력해 주세요.');
        return;
      }
      
      // 3. 이메일 중복 체크 검증
      if (emailUnique === false) {
        alert('이미 사용 중인 이메일입니다.');
        return;
      }
      
      // 4. 이메일 중복 체크가 진행 중인 경우 대기
      if (emailCheckLoading) {
        alert('이메일 확인 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      
      // 5. 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }
      
      // 6. 나이 검증
      const age = Number(formData.age);
      if (isNaN(age) || age < 1 || age > 150) {
        alert('올바른 나이를 입력해주세요. (1-150)');
        return;
      }
      
      // 7. 비밀번호 길이 검증
      if (formData.password.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.');
        return;
      }
      
      // 8. 닉네임 길이 검증
      if (formData.nickname.length < 2) {
        alert('닉네임은 2자 이상이어야 합니다.');
        return;
      }
      
      // 9. 이름 길이 검증
      if (formData.name.length < 2) {
        alert('이름은 2자 이상이어야 합니다.');
        return;
      }
    
      const res = await fetch('http://3.36.107.16:80/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim(),
          nickname: formData.nickname.trim(),
          age: age, // 이미 검증된 숫자 값 사용
          nativeLanguage: formData.nativeLanguage,
          koreanLevel: formData.koreanLevel,
        }),
      });

      // 응답 상태 확인
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      // 응답 본문이 있는지 확인
      const responseText = await res.text();
      if (!responseText || responseText.trim() === '') {
        // 빈 응답이어도 200 상태라면 성공으로 처리
        if (res.status === 200) {
          alert('회원가입이 완료되었습니다!');
          setIsLogin(true);
          return;
        }
        throw new Error('서버에서 빈 응답을 받았습니다.');
      }

      // JSON 파싱 시도
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.error('응답 텍스트:', responseText);
        throw new Error('서버 응답이 올바른 JSON 형식이 아닙니다.');
      }

      // 성공 응답 처리
      alert('회원가입이 완료되었습니다!');
      setIsLogin(true);
      // 회원가입 성공 후 로그인 모드로 전환하여 사용자가 로그인할 수 있도록 함
    } catch (e) {
      console.error('회원가입 오류:', e);
      
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      if (e instanceof Error) {
        if (e.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
        } else if (e.message.includes('timeout')) {
          errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
        } else if (e.message.includes('NetworkError')) {
          errorMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.';
        } else if (e.message.includes('HTTP')) {
          errorMessage = `서버 오류: ${e.message}`;
        } else if (e.message.includes('빈 응답')) {
          errorMessage = '서버에서 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.';
        } else if (e.message.includes('JSON')) {
          errorMessage = '서버 응답에 문제가 있습니다. 관리자에게 문의해주세요.';
        } else {
          errorMessage = `오류: ${e.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="text-8xl"
              animate={{
                filter: [
                  "drop-shadow(0 0 20px rgba(255, 217, 61, 0.4))",
                  "drop-shadow(0 0 30px rgba(255, 217, 61, 0.6))",
                  "drop-shadow(0 0 20px rgba(255, 217, 61, 0.4))"
                ],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🌙
            </motion.div>
          </div>
          <h1 className="banwol-title text-5xl mb-2 text-gray-800">
            반월
          </h1>
          <p className="text-gray-600">한국어 학습의 즐거운 여행</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{isLogin ? '로그인' : '회원가입'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className="mt-1"
                    required
                  />
                  {!isLogin && !!formData.email && (
                    <div className="mt-1 min-h-[24px] text-sm">
                      {emailCheckLoading && (
                        <span className="text-gray-500">이메일 중복 확인 중...</span>
                      )}
                      {!emailCheckLoading && emailUnique === true && (
                        <span className="text-green-600">사용 가능한 이메일입니다.</span>
                      )}
                      {!emailCheckLoading && emailUnique === false && (
                        <span className="text-red-600">이미 사용 중인 이메일입니다.</span>
                      )}
                      {!emailCheckLoading && emailCheckError && (
                        <span className="text-red-600">{emailCheckError}</span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">실명</Label>
                      <Input
                        id="name"
                        placeholder="실명을 입력하세요"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nickname">닉네임</Label>
                      <Input
                        id="nickname"
                        placeholder="닉네임을 입력하세요"
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">나이</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="나이를 입력하세요"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        min={1}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nativeLanguage">모국어</Label>
                      <select
                        id="nativeLanguage"
                        value={formData.nativeLanguage}
                        onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                        className="mt-1 w-full border rounded-md p-2"
                        required
                      >
                        {nativeLanguages.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="koreanLevel">한국어 수준</Label>
                      <select
                        id="koreanLevel"
                        value={formData.koreanLevel}
                        onChange={(e) => setFormData({ ...formData, koreanLevel: e.target.value })}
                        className="mt-1 w-full border rounded-md p-2"
                        required
                      >
                        {koreanLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || emailCheckLoading}
                  className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting 
                    ? (isLogin ? '로그인 중...' : '회원가입 중...') 
                    : (isLogin ? '로그인 🚀' : '회원가입 ✨')
                  }
                </Button>
              </form>
              <div className="text-center mt-6 space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {isLogin
                    ? '처음이신가요? 회원가입하기'
                    : '이미 계정이 있으신가요? 로그인하기'}
                </Button>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-center">
                  <p className="text-sm text-yellow-800 mb-2">체험해보기</p>
                  <Button
                    variant="outline"
                    onClick={onLogin}
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                  >
                    데모 모드로 시작하기 🎮
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
