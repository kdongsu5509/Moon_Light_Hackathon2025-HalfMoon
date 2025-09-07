import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLanguage, Language } from '../language-context';

interface LanguageSelectionProps {
  onNext: () => void;
}

const languages = [
  { code: 'ko', name: '한국어', nativeName: '한국어', flag: '🇰🇷', color: 'from-red-100 to-blue-100' },
  { code: 'vi', name: 'Tiếng Việt', nativeName: 'Vietnamese', flag: '🇻🇳', color: 'from-red-100 to-yellow-100' },
  { code: 'zh', name: '中文', nativeName: 'Chinese', flag: '🇨🇳', color: 'from-red-100 to-yellow-200' },
  { code: 'ja', name: '日本語', nativeName: 'Japanese', flag: '🇯🇵', color: 'from-white to-red-100' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', color: 'from-blue-100 to-red-100' }
];

export function LanguageSelection({ onNext }: LanguageSelectionProps) {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);

  const handleLanguageSelect = (langCode: Language) => {
    setSelectedLang(langCode);
    setLanguage(langCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-6xl">🌍</div>
          <h2 className="text-2xl text-gray-800">
            {selectedLang === 'ko' && '언어를 선택해주세요'}
            {selectedLang === 'vi' && 'Chọn ngôn ngữ của bạn'}
            {selectedLang === 'zh' && '请选择您的语言'}
            {selectedLang === 'ja' && '言語を選択してください'}
            {selectedLang === 'en' && 'Choose your language'}
          </h2>
          <p className="text-gray-600">
            {selectedLang === 'ko' && '어떤 언어로 시작할까요?'}
            {selectedLang === 'vi' && 'Bạn muốn bắt đầu với ngôn ngữ nào?'}
            {selectedLang === 'zh' && '您想从哪种语言开始？'}
            {selectedLang === 'ja' && 'どの言語で始めますか？'}
            {selectedLang === 'en' && 'Which language would you like to start with?'}
          </p>
        </motion.div>

        {/* Language Options */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {languages.map((language, index) => (
            <motion.div
              key={language.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedLang === language.code 
                    ? 'ring-2 ring-blue-400 bg-gradient-to-r ' + language.color 
                    : 'hover:shadow-lg bg-white/80'
                }`}
                onClick={() => handleLanguageSelect(language.code as Language)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{language.flag}</div>
                    <div className="flex-1">
                      <div className="text-lg font-medium text-gray-800">
                        {language.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {language.nativeName}
                      </div>
                    </div>
                    {selectedLang === language.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-blue-500 text-xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white text-lg py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
          >
{selectedLang === 'ko' && '다음으로 🚀'}
            {selectedLang === 'vi' && 'Tiếp theo 🚀'}
            {selectedLang === 'zh' && '下一步 🚀'}
            {selectedLang === 'ja' && '次へ 🚀'}
            {selectedLang === 'en' && 'Next 🚀'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}