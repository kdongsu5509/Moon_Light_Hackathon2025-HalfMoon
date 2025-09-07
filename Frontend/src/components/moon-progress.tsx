import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './language-context';
import { MoonMascot } from './moon-mascot';

interface MoonProgressProps {
  points: number;
  maxPoints?: number;
  showMascot?: boolean;
}

export function MoonProgress({ points, maxPoints = 1000, showMascot = true }: MoonProgressProps) {
  const { t } = useLanguage();
  const progress = Math.min(points / maxPoints, 1);
  
  const getProgressText = (progress: number) => {
    if (progress < 0.25) return '초승달 🌒';
    if (progress < 0.5) return '반달 🌓';
    if (progress < 0.75) return '보름달에 가까워요 🌔';
    if (progress < 1) return '거의 다 왔어요! 🌕';
    return '보름달 완성! 🌕✨';
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 rounded-3xl p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        {/* Title */}
        <h3 className="text-lg text-gray-700">이번 달 진행 상황</h3>
        
        {/* Moon Mascot */}
        {showMascot && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
          >
            <MoonMascot points={points} maxPoints={maxPoints} size="medium" />
          </motion.div>
        )}
        
        {/* Progress Info */}
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {getProgressText(progress)}
          </div>
          <div className="text-2xl text-gray-800">
            {points} / {maxPoints}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/70 rounded-full h-3 overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            {Math.round(progress * 100)}% 완료
          </div>
        </div>

        {/* Monthly Reset Info */}
        <div className="bg-white/50 rounded-xl p-3 text-xs text-gray-600">
          <div className="flex items-center justify-center space-x-1">
            <span>📅</span>
            <span>매월 1일에 새로운 달이 시작돼요!</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}