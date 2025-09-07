import React from 'react';
import { useLanguage, Language } from './language-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <Select value={currentLanguage} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger className="w-40">
        <SelectValue>
          <div className="flex items-center space-x-2">
            <span>{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
            <span>{languages.find(lang => lang.code === currentLanguage)?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}