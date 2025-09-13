import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider } from './components/language-context';
import { WelcomeScreen } from './components/onboarding/welcome-screen';
import { LanguageSelection } from './components/onboarding/language-selection';
import { ProfileSetup, UserProfile } from './components/onboarding/profile-setup';
import { LoginScreen } from './components/auth/login-screen';
import { HomeDashboard } from './components/home-dashboard';
import { LearningEnhanced } from './components/learning-enhanced';
import { BoardEnhanced } from './components/board-enhanced';
import { ProgressScreen } from './components/progress-screen';
import { Button } from './components/ui/button';
import { Home as HomeIcon, BookOpen, MessageSquare, TrendingUp, Settings } from 'lucide-react';
import { SettingsMenu } from './components/settings-menu';
import { toast } from 'sonner@2.0.3';

type AppState = 'welcome' | 'login' | 'language' | 'profile' | 'app';
type AppTab = 'home' | 'learning' | 'board' | 'progress';

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [points, setPoints] = useState(250);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handlePointsEarned = (earnedPoints: number) => {
    setPoints(prev => {
      const newPoints = prev + earnedPoints;
      
      // Show different toasts based on points earned
      if (earnedPoints >= 50) {
        toast.success(`🎉 ${earnedPoints}포인트 획득! 대단해요!`);
      } else if (earnedPoints >= 20) {
        toast.success(`⭐ ${earnedPoints}포인트 획득! 잘하고 있어요!`);
      } else {
        toast.success(`✨ ${earnedPoints}포인트 획득!`);
      }
      
      return newPoints;
    });
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  const handleLogout = () => {
    // JWT 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    setAppState('welcome');
    setActiveTab('home');
    setUserProfile(null);
    setPoints(0);
  };

  const handleDeleteAccount = () => {
    // JWT 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    setAppState('welcome');
    setActiveTab('home');
    setUserProfile(null);
    setPoints(0);
  };

  const renderOnboarding = () => {
    switch (appState) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setAppState('login')} />;
      case 'login':
        return (
          <LoginScreen 
            onLogin={() => setAppState('language')}
            onSignUp={() => {}}
          />
        );
      case 'language':
        return <LanguageSelection onNext={() => setAppState('profile')} />;
      case 'profile':
        return (
          <ProfileSetup 
            onComplete={(profile) => {
              setUserProfile(profile);
              setAppState('app');
            }} 
          />
        );
      default:
        return null;
    }
  };

  const renderMainApp = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header - only show on non-home tabs */}
        {activeTab !== 'home' && (
          <motion.header 
            className="bg-white shadow-sm sticky top-0 z-50 border-b"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="web-container mx-auto flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('home')}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  ← 홈으로
                </Button>
                <h1 className="banwol-title text-2xl text-gray-800">
                  반월 🌙
                </h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <SettingsMenu
                  isDarkMode={isDarkMode}
                  onDarkModeToggle={handleDarkModeToggle}
                  onLogout={handleLogout}
                  onDeleteAccount={handleDeleteAccount}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('progress')}
                  className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg p-0 hover:scale-110 transition-transform"
                  title="학습 기록과 통계 보기"
                >
                  {userProfile?.avatar ? 
                    ['🐭', '🐂', '🐅', '🐰', '🐉', '🐍', '🐴', '🐐', '🐵', '🐓', '🐕', '🐷'][
                      ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'].indexOf(userProfile.avatar)
                    ] || '🐭' : '🐭'}
                </Button>
              </div>
            </div>
          </motion.header>
        )}

        {/* Main Content */}
        <main className={`${activeTab !== 'home' ? 'pt-0' : ''} ${activeTab === 'home' ? '' : 'pb-20'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'home' && (
                <HomeDashboard 
                  points={points} 
                  userProfile={userProfile}
                  onNavigate={setActiveTab}
                  isDarkMode={isDarkMode}
                  onDarkModeToggle={handleDarkModeToggle}
                  onLogout={handleLogout}
                  onDeleteAccount={handleDeleteAccount}
                />
              )}
              {activeTab === 'learning' && (
                <LearningEnhanced onPointsEarned={handlePointsEarned} />
              )}
              {activeTab === 'board' && (
                <BoardEnhanced />
              )}
              {activeTab === 'progress' && (
                <ProgressScreen points={points} userProfile={userProfile} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Desktop Navigation - only show on non-home tabs */}
        {activeTab !== 'home' && (
          <motion.nav 
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl z-50 px-2 py-2"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex space-x-2">
              {[
                { tab: 'home', icon: HomeIcon, label: '홈', color: 'text-blue-500' },
                { tab: 'learning', icon: BookOpen, label: '학습', color: 'text-green-500' },
                { tab: 'board', icon: MessageSquare, label: '게시판', color: 'text-purple-500' },
                { tab: 'progress', icon: TrendingUp, label: '진도', color: 'text-orange-500' }
              ].map(({ tab, icon: Icon, label, color }) => (
                <Button
                  key={tab}
                  variant="ghost"
                  className={`h-12 px-4 rounded-xl flex items-center space-x-2 transition-all duration-200 ${
                    activeTab === tab 
                      ? `${color} bg-gradient-to-r from-${color.split('-')[1]}-100 to-${color.split('-')[1]}-200 shadow-md` 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab as AppTab)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                  {activeTab === tab && (
                    <motion.div
                      className={`w-2 h-2 ${color.replace('text-', 'bg-')} rounded-full`}
                      layoutId="activeTabDesktop"
                    />
                  )}
                </Button>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    );
  };

  return (
    <LanguageProvider>
      <AnimatePresence mode="wait">
        {appState !== 'app' ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderOnboarding()}
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderMainApp()}
          </motion.div>
        )}
      </AnimatePresence>
    </LanguageProvider>
  );
}