import React from 'react';
import { motion } from 'motion/react';

interface MoonMascotProps {
  points: number;
  maxPoints?: number;
  size?: 'small' | 'medium' | 'large';
  showSparkles?: boolean;
}

export function MoonMascot({ points, maxPoints = 1000, size = 'medium', showSparkles = true }: MoonMascotProps) {
  const progress = Math.min(points / maxPoints, 1);
  
  const sizes = {
    small: { width: 80, height: 80, crateSizes: [2, 1.5, 3] },
    medium: { width: 120, height: 120, crateSizes: [3, 2, 4] },
    large: { width: 160, height: 160, crateSizes: [4, 3, 5] }
  };
  
  const { width, height, crateSizes } = sizes[size];
  const radius = width * 0.35;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate moon phase
  const getMoonPath = (phase: number) => {
    if (phase <= 0.1) {
      // New moon (crescent)
      const offset = radius * 0.8;
      return `M ${centerX} ${centerY - radius} 
              A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius} 
              A ${offset} ${offset} 0 0 0 ${centerX} ${centerY - radius} Z`;
    } else if (phase >= 0.9) {
      // Full moon
      return `M ${centerX} ${centerY - radius} 
              A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius} 
              A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius} Z`;
    } else {
      // Waxing phases
      const offset = radius * (1 - phase);
      return `M ${centerX} ${centerY - radius} 
              A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius} 
              A ${offset} ${offset} 0 0 0 ${centerX} ${centerY - radius} Z`;
    }
  };

  // Get facial expression based on progress
  const getFaceExpression = (phase: number) => {
    if (phase < 0.3) return 'sleepy';
    if (phase < 0.6) return 'happy';
    if (phase < 0.9) return 'excited';
    return 'joyful';
  };

  const expression = getFaceExpression(progress);

  return (
    <div className="relative flex items-center justify-center">
      <motion.svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        animate={{ 
          scale: progress > 0.8 ? [1, 1.05, 1] : 1,
          rotate: progress > 0.9 ? [0, 5, -5, 0] : 0
        }}
        transition={{ 
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 3, repeat: Infinity }
        }}
        key={progress} // Force re-render on progress change
      >
        {/* Moon shadow/background */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 2}
          fill="#e2e8f0"
          opacity="0.3"
        />
        
        {/* Dark part of moon */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="#cbd5e0"
        />
        
        {/* Bright part of moon */}
        <motion.path
          d={getMoonPath(progress)}
          fill="url(#moonGradient)"
          animate={{ 
            opacity: [0.9, 1, 0.9]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Moon craters */}
        {progress > 0.2 && (
          <>
            <circle cx={centerX - 8} cy={centerY - 12} r={crateSizes[0]} fill="#f4c430" opacity="0.6" />
            <circle cx={centerX + 12} cy={centerY - 5} r={crateSizes[1]} fill="#f4c430" opacity="0.4" />
            <circle cx={centerX - 5} cy={centerY + 10} r={crateSizes[2]} fill="#f4c430" opacity="0.5" />
          </>
        )}
        
        {/* Eyes */}
        <motion.g>
          {expression === 'sleepy' ? (
            <>
              <path d={`M ${centerX - 12} ${centerY - 8} Q ${centerX - 8} ${centerY - 12} ${centerX - 4} ${centerY - 8}`} 
                    stroke="#2d3748" strokeWidth="2" fill="none" />
              <path d={`M ${centerX + 4} ${centerY - 8} Q ${centerX + 8} ${centerY - 12} ${centerX + 12} ${centerY - 8}`} 
                    stroke="#2d3748" strokeWidth="2" fill="none" />
            </>
          ) : (
            <>
              <circle cx={centerX - 8} cy={centerY - 6} r="3" fill="#2d3748" />
              <circle cx={centerX + 8} cy={centerY - 6} r="3" fill="#2d3748" />
              {(expression === 'excited' || expression === 'joyful') && (
                <>
                  <circle cx={centerX - 7} cy={centerY - 7} r="1" fill="#ffffff" />
                  <circle cx={centerX + 9} cy={centerY - 7} r="1" fill="#ffffff" />
                </>
              )}
            </>
          )}
        </motion.g>
        
        {/* Mouth */}
        <motion.g>
          {expression === 'sleepy' && (
            <ellipse cx={centerX} cy={centerY + 6} rx="3" ry="2" fill="#2d3748" />
          )}
          {expression === 'happy' && (
            <path d={`M ${centerX - 8} ${centerY + 6} Q ${centerX} ${centerY + 12} ${centerX + 8} ${centerY + 6}`} 
                  stroke="#2d3748" strokeWidth="2" fill="none" />
          )}
          {expression === 'excited' && (
            <ellipse cx={centerX} cy={centerY + 8} rx="6" ry="4" fill="#2d3748" />
          )}
          {expression === 'joyful' && (
            <>
              <ellipse cx={centerX} cy={centerY + 8} rx="8" ry="5" fill="#2d3748" />
              <ellipse cx={centerX} cy={centerY + 6} rx="6" ry="3" fill="#ffd93d" />
            </>
          )}
        </motion.g>
        
        {/* Cheeks (for happy expressions) */}
        {(expression === 'happy' || expression === 'excited' || expression === 'joyful') && (
          <>
            <circle cx={centerX - 18} cy={centerY + 2} r="4" fill="#fc8181" opacity="0.4" />
            <circle cx={centerX + 18} cy={centerY + 2} r="4" fill="#fc8181" opacity="0.4" />
          </>
        )}
        
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="moonGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="#ffd93d" />
            <stop offset="70%" stopColor="#f4c430" />
            <stop offset="100%" stopColor="#e6b800" />
          </radialGradient>
        </defs>
      </motion.svg>
      
      {/* Sparkles for full moon */}
      {showSparkles && progress > 0.8 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 text-yellow-400"
              style={{
                top: `${20 + Math.sin(i * 60) * 30}%`,
                left: `${50 + Math.cos(i * 60) * 35}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}