import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
      {/* Soft night sky stars */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Soft floating clouds */}
      <motion.div
        className="absolute top-32 left-16 w-24 h-12 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-xl"
        animate={{
          x: [0, 30, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-40 right-20 w-20 h-8 bg-gradient-to-r from-white/3 to-white/8 rounded-full blur-lg"
        animate={{
          x: [0, -25, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Title and Moon */}
        <motion.div
          className="relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Soft moonlight glow effect behind title */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-yellow-300/20 rounded-full blur-3xl scale-150"
            animate={{
              scale: [1.2, 1.4, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <div className="flex items-center justify-center gap-6 mb-4">
            <h1 className="banwol-title text-8xl text-transparent bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-100 bg-clip-text relative">
              반월
            </h1>
            <div className="relative">
              {/* 반달의 부드러운 후광 효과 */}
              <motion.div
                className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-yellow-200/25 to-yellow-300/25 rounded-full blur-xl"
                animate={{
                  scale: [1.2, 1.4, 1.2],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* 자연스러운 반달 - 이모지로 심플하게 */}
              <motion.div
                className="relative w-20 h-20 flex items-center justify-center"
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
                <div className="text-6xl">🌙</div>
              </motion.div>
              
              {/* 달 주변 부드러운 반짝이 */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-yellow-200 rounded-full"
                  style={{
                    left: `${50 + 30 * Math.cos((i * Math.PI) / 3)}%`,
                    top: `${50 + 30 * Math.sin((i * Math.PI) / 3)}%`,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Subtitle with night theme */}
          <motion.p
            className="text-lg text-slate-300/80 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            밤하늘 아래 한국어 학습 여행
          </motion.p>
        </motion.div>

        {/* 국기들 */}
        <motion.div
          className="flex justify-center items-center space-x-6 mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          {[
            { flag: '🇰🇷', code: 'KR' },
            { flag: '🇻🇳', code: 'VN' },
            { flag: '🇨🇳', code: 'CN' },
            { flag: '🇯🇵', code: 'JP' },
            { flag: '🇺🇸', code: 'US' }
          ].map((country, index) => (
            <motion.div
              key={country.code}
              className="relative group"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.8 }}
            >
              {/* Soft moonlight glow around flags */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/8 to-yellow-300/8 rounded-full blur-lg group-hover:from-yellow-200/15 group-hover:to-yellow-300/15 transition-all duration-300" />
              
              <motion.div
                className="relative bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center group-hover:bg-white/12 transition-all duration-300"
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 10,
                  boxShadow: "0 8px 32px rgba(255, 217, 61, 0.2)"
                }}
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  y: {
                    duration: 3 + index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
              >
                <div className="text-4xl filter drop-shadow-lg">{country.flag}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* 밤하늘 로딩 표시 */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          {/* Floating gentle particles */}
          <div className="relative w-48 h-8 mx-auto mb-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-full"
                animate={{
                  x: [0, 180, 0],
                  y: [0, Math.sin(i) * 8, 0],
                  scale: [0.6, 1, 0.6],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Progress bar with moonlight effect */}
          <div className="w-48 h-1 bg-white/15 rounded-full mx-auto overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 2.5, duration: 2.5, ease: "easeInOut" }}
            >
              {/* Soft glowing effect on progress bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 rounded-full blur-sm opacity-50"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </div>
          
          <motion.p
            className="text-sm text-slate-300/70 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.8 }}
          >
            달빛길을 준비하고 있습니다...
          </motion.p>
        </motion.div>

        {/* Additional soft night decorations */}
        <motion.div
          className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-r from-slate-700/8 to-slate-600/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-yellow-200/5 to-slate-700/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.08, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </div>
  );
}