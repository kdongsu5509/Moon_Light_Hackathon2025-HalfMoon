import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../language-context';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export interface UserProfile {
  name: string;
  nickname: string;
  age: string;
  nativeLanguage: string;
  koreanLevel: string;
  avatar: string;
}

const avatarOptions = [
  { id: 'rat', emoji: '🐭', name: '쥐', color: 'bg-gray-100' },
  { id: 'ox', emoji: '🐂', name: '소', color: 'bg-amber-100' },
  { id: 'tiger', emoji: '🐅', name: '호랑이', color: 'bg-orange-100' },
  { id: 'rabbit', emoji: '🐰', name: '토끼', color: 'bg-pink-100' },
  { id: 'dragon', emoji: '🐉', name: '용', color: 'bg-green-100' },
  { id: 'snake', emoji: '🐍', name: '뱀', color: 'bg-emerald-100' },
  { id: 'horse', emoji: '🐴', name: '말', color: 'bg-yellow-100' },
  { id: 'goat', emoji: '🐐', name: '양', color: 'bg-blue-100' },
  { id: 'monkey', emoji: '🐵', name: '원숭이', color: 'bg-purple-100' },
  { id: 'rooster', emoji: '🐓', name: '닭', color: 'bg-red-100' },
  { id: 'dog', emoji: '🐕', name: '개', color: 'bg-indigo-100' },
  { id: 'pig', emoji: '🐷', name: '돼지', color: 'bg-rose-100' }
];

const nativeLanguages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const koreanLevels = [
  { value: 'beginner', label: '처음 배워요 🌱' },
  { value: 'elementary', label: '조금 알아요 🌿' },
  { value: 'intermediate', label: '어느 정도 해요 🌳' },
  { value: 'advanced', label: '잘 해요 🌟' }
];

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { currentLanguage } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    nickname: '',
    age: '',
    nativeLanguage: '',
    koreanLevel: '',
    avatar: 'rat'
  });

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 2;

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return profile.name.trim() && profile.nickname.trim() && profile.age;
      case 1:
        return profile.nativeLanguage && profile.koreanLevel;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl">👋</div>
              <h3 className="text-xl text-gray-800">
                {currentLanguage === 'ko' && '안녕하세요!'}
                {currentLanguage === 'vi' && 'Xin chào!'}
                {currentLanguage === 'zh' && '你好！'}
                {currentLanguage === 'ja' && 'こんにちは！'}
                {currentLanguage === 'en' && 'Hello!'}
              </h3>
              <p className="text-gray-600">
                {currentLanguage === 'ko' && '기본 정보를 알려주세요'}
                {currentLanguage === 'vi' && 'Vui lòng cho biết thông tin cơ bản'}
                {currentLanguage === 'zh' && '请告诉我们基本信息'}
                {currentLanguage === 'ja' && '基本情報を教えてください'}
                {currentLanguage === 'en' && 'Please tell us your basic information'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">
                  {currentLanguage === 'ko' && '이름'}
                  {currentLanguage === 'vi' && 'Tên'}
                  {currentLanguage === 'zh' && '姓名'}
                  {currentLanguage === 'ja' && '名前'}
                  {currentLanguage === 'en' && 'Name'}
                </Label>
                <Input
                  id="name"
                  placeholder="김민수"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="nickname">별명</Label>
                <Input
                  id="nickname"
                  placeholder="민수"
                  value={profile.nickname}
                  onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="age">나이</Label>
                <Select value={profile.age} onValueChange={(value) => setProfile({ ...profile, age: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="나이를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => i + 5).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}살
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl">🌍</div>
              <h3 className="text-xl text-gray-800">언어 정보</h3>
              <p className="text-gray-600">언어 능력을 알려주세요</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>모국어</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {nativeLanguages.map((lang) => (
                    <Card
                      key={lang.code}
                      className={`cursor-pointer transition-all ${profile.nativeLanguage === lang.code
                        ? 'ring-2 ring-blue-400 bg-blue-50'
                        : 'hover:bg-gray-50'
                        }`}
                      onClick={() => setProfile({ ...profile, nativeLanguage: lang.code })}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl mb-1">{lang.flag}</div>
                        <div className="text-sm">{lang.name}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label>한국어 수준</Label>
                <div className="space-y-2 mt-2">
                  {koreanLevels.map((level) => (
                    <Card
                      key={level.value}
                      className={`cursor-pointer transition-all ${profile.koreanLevel === level.value
                        ? 'ring-2 ring-blue-400 bg-blue-50'
                        : 'hover:bg-gray-50'
                        }`}
                      onClick={() => setProfile({ ...profile, koreanLevel: level.value })}
                    >
                      <CardContent className="p-3">
                        <div className="text-center">{level.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      // case 2:
      //   return (
      //     <motion.div
      //       className="space-y-6"
      //       initial={{ opacity: 0, x: 20 }}
      //       animate={{ opacity: 1, x: 0 }}
      //       exit={{ opacity: 0, x: -20 }}
      //     >
      //       <div className="text-center space-y-2">
      //         <div className="text-4xl">🎨</div>
      //         <h3 className="text-xl text-gray-800">아바타 선택</h3>
      //         <p className="text-gray-600">좋아하는 캐릭터를 골라주세요</p>
      //       </div>

      //       <div className="grid grid-cols-4 gap-4">
      //         {avatarOptions.map((avatar) => (
      //           <motion.div
      //             key={avatar.id}
      //             whileHover={{ scale: 1.05, y: -2 }}
      //             whileTap={{ scale: 0.95 }}
      //             transition={{ type: "spring", stiffness: 300, damping: 20 }}
      //           >
      //             <Card
      //               className={`cursor-pointer transition-all aspect-square border-2 ${
      //                 profile.avatar === avatar.id
      //                   ? 'ring-4 ring-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-lg'
      //                   : `hover:shadow-md ${avatar.color} border-gray-200 hover:border-gray-300`
      //               }`}
      //               onClick={() => setProfile({ ...profile, avatar: avatar.id })}
      //             >
      //               <CardContent className="p-4 flex flex-col items-center justify-center h-full relative">
      //                 <motion.div 
      //                   className="text-4xl mb-2"
      //                   animate={profile.avatar === avatar.id ? { 
      //                     scale: [1, 1.2, 1],
      //                     rotate: [0, 10, -10, 0]
      //                   } : {}}
      //                   transition={{ duration: 0.6 }}
      //                 >
      //                   {avatar.emoji}
      //                 </motion.div>
      //                 <div className="text-xs text-center font-medium text-gray-700">
      //                   {avatar.name}
      //                 </div>
      //                 {profile.avatar === avatar.id && (
      //                   <motion.div
      //                     className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
      //                     initial={{ scale: 0 }}
      //                     animate={{ scale: 1 }}
      //                     transition={{ delay: 0.1 }}
      //                   >
      //                     <span className="text-white text-xs">✓</span>
      //                   </motion.div>
      //                 )}
      //               </CardContent>
      //             </Card>
      //           </motion.div>
      //         ))}
      //       </div>
      //     </motion.div>
      //   );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>단계 {currentStep + 1}</span>
                <span>{totalSteps}단계 중</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6"
              >
                이전
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="px-6 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600"
              >
                {currentStep === totalSteps - 1 ? '완료' : '다음'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}