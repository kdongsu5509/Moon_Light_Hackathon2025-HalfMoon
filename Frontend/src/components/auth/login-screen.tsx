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
      }, 500);
    }
  };

  const checkEmailUnique = async (email: string) => {
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
    }
    setEmailCheckLoading(false);
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

      const data = await res.json();

      if (res.status === 200 && data.success) {
        alert('로그인 성공!');
        onLogin();
      } else if (res.status === 401) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else if (res.status === 400) {
        alert('필수 입력값이 누락되었습니다.');
      } else {
        alert('서버 오류가 발생했습니다.');
      }
    } catch (e) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
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
    if (emailUnique === false) {
      alert('이미 사용 중인 이메일입니다.');
      return;
    }
    try {
      const res = await fetch('http://3.36.107.16:80/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          nickname: formData.nickname,
          age: Number(formData.age),
          nativeLanguage: formData.nativeLanguage,
          koreanLevel: formData.koreanLevel,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('회원가입이 완료되었습니다!');
        setIsLogin(true);
        onSignUp();
      } else {
        alert(data.message || '회원가입에 실패했습니다.');
      }
    } catch (e) {
      alert('네트워크 오류가 발생했습니다.');
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
                  className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  {isLogin ? '로그인 🚀' : '회원가입 ✨'}
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
