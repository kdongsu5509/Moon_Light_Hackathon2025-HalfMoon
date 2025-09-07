import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './language-context';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Settings, Moon, Sun, LogOut, UserMinus, Globe, Palette } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SettingsMenuProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function SettingsMenu({ isDarkMode, onDarkModeToggle, onLogout, onDeleteAccount }: SettingsMenuProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    toast.success(`언어가 ${languages.find(l => l.code === languageCode)?.name}로 변경되었습니다`);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    toast.success('로그아웃되었습니다');
  };

  const handleDeleteAccount = () => {
    onDeleteAccount();
    setIsOpen(false);
    toast.success('계정이 삭제되었습니다');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center p-0 hover:scale-110 transition-transform"
          title="설정"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>설정</span>
          </DialogTitle>
          <DialogDescription>
            언어, 테마, 계정 설정을 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Language Setting */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>언어 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Dark Mode Setting */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>테마 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div>
                    <div className="font-medium">다크 모드</div>
                    <div className="text-sm text-gray-500">화면을 어둡게 설정합니다</div>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={onDarkModeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">계정 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Logout */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>로그아웃 확인</AlertDialogTitle>
                    <AlertDialogDescription>
                      정말 로그아웃하시겠습니까? 다시 로그인해야 합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      로그아웃
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Delete Account */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    <UserMinus className="w-4 h-4 mr-2" />
                    계정 탈퇴
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>계정 탈퇴 확인</AlertDialogTitle>
                    <AlertDialogDescription>
                      정말 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 학습 데이터가 삭제됩니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      계정 탈퇴
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="banwol-title text-2xl text-gray-800">반월</div>
                <div className="text-sm text-gray-500">버전 1.0.0</div>
                <div className="text-xs text-gray-400">다문화 가정을 위한 한국어 학습 앱</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}