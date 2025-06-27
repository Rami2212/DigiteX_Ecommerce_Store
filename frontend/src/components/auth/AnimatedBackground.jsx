import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* More Vibrant Colorful Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-200/60 via-blue-200/50 to-pink-200/60 dark:from-purple-900/20 dark:via-blue-900/15 dark:to-pink-900/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-100/40 via-transparent to-yellow-100/40 dark:from-cyan-900/10 dark:via-transparent dark:to-yellow-900/10"></div>
      
      {/* Floating Magical Elements - Crystals and Gems */}
      <div className="absolute inset-0">
        {/* Top Row Crystals */}
        <motion.div
          animate={{ 
            x: [0, 30, -30, 0],
            y: [0, 20, -20, 0],
            opacity: [0.4, 0.8, 0.3, 0.4],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[8%] left-[8%]"
        >
          <div className="relative">
            <div className="w-16 h-20 bg-gradient-to-br from-emerald-300/80 to-emerald-600/60 dark:from-emerald-500/60 dark:to-emerald-800/40 transform -skew-x-12 rounded-lg shadow-lg border-2 border-emerald-400/70"></div>
            <div className="absolute top-2 left-2 w-3 h-3 bg-white/60 rounded-full blur-sm"></div>
            <div className="absolute bottom-3 right-2 w-2 h-2 bg-white/40 rounded-full blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            x: [0, -25, 25, 0],
            y: [0, 15, -15, 0],
            opacity: [0.5, 0.9, 0.4, 0.5],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[12%] right-[12%]"
        >
          <div className="relative">
            <div className="w-12 h-16 bg-gradient-to-br from-purple-400/80 to-purple-700/60 dark:from-purple-500/60 dark:to-purple-800/40 transform skew-y-12 rounded-lg shadow-lg border-2 border-purple-500/70"></div>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white/70 rounded-full blur-sm"></div>
            <div className="absolute bottom-2 right-1 w-1 h-1 bg-white/50 rounded-full blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            x: [0, 20, -20, 0],
            y: [0, -15, 15, 0],
            opacity: [0.3, 0.7, 0.2, 0.3],
            rotate: [0, 8, -8, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[18%] left-[75%]"
        >
          <div className="relative">
            <div className="w-14 h-18 bg-gradient-to-br from-rose-300/80 to-rose-600/60 dark:from-rose-500/60 dark:to-rose-800/40 transform -skew-y-6 rounded-lg shadow-lg border-2 border-rose-400/70"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
          </div>
        </motion.div>

        {/* Middle Row Magical Items */}
        <motion.div
          animate={{ 
            x: [0, 20, -20, 0],
            y: [0, -25, 25, 0],
            opacity: [0.3, 0.6, 0.2, 0.3],
            rotate: [0, 12, -12, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[40%] left-[3%]"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400/80 to-orange-600/60 dark:from-amber-500/60 dark:to-orange-800/40 rounded-full shadow-lg border-2 border-amber-500/70"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-200/60 to-orange-300/40 rounded-full"></div>
            <div className="absolute top-1 left-1 w-1 h-1 bg-white/80 rounded-full blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            x: [0, -30, 30, 0],
            y: [0, 20, -20, 0],
            opacity: [0.4, 0.8, 0.3, 0.4],
            rotate: [0, -15, 15, 0]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[35%] right-[5%]"
        >
          <div className="relative">
            <div className="w-18 h-12 bg-gradient-to-br from-cyan-300/80 to-teal-600/60 dark:from-cyan-500/60 dark:to-teal-800/40 transform skew-x-6 rounded-lg shadow-lg border-2 border-cyan-400/70"></div>
            <div className="absolute top-1 left-3 w-3 h-3 bg-white/50 rounded-full blur-sm"></div>
            <div className="absolute bottom-1 right-2 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            x: [0, 15, -15, 0],
            y: [0, -20, 20, 0],
            opacity: [0.35, 0.7, 0.25, 0.35],
            rotate: [0, 20, -20, 0]
          }}
          transition={{ 
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[45%] left-[45%]"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400/80 to-blue-700/60 dark:from-indigo-500/60 dark:to-blue-800/40 transform rotate-45 shadow-lg border-2 border-indigo-500/70"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-blue-200/40 to-indigo-300/30 transform rotate-45"></div>
          </div>
        </motion.div>

        {/* Bottom Row Magical Elements */}
        <motion.div
          animate={{ 
            x: [0, -20, 20, 0],
            y: [0, 15, -15, 0],
            opacity: [0.3, 0.6, 0.2, 0.3],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[25%] left-[15%]"
        >
          <div className="relative">
            <div className="w-16 h-14 bg-gradient-to-br from-violet-400/80 to-purple-700/60 dark:from-violet-500/60 dark:to-purple-800/40 transform -skew-x-6 rounded-lg shadow-lg border-2 border-violet-500/70"></div>
            <div className="absolute top-2 left-2 w-2 h-2 bg-white/70 rounded-full blur-sm"></div>
            <div className="absolute bottom-1 right-3 w-3 h-3 bg-white/40 rounded-full blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            x: [0, 30, -30, 0],
            y: [0, -25, 25, 0],
            opacity: [0.4, 0.8, 0.3, 0.4],
            rotate: [0, -12, 12, 0]
          }}
          transition={{ 
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[20%] right-[20%]"
        >
          <div className="relative">
            <div className="w-12 h-20 bg-gradient-to-br from-pink-400/80 to-rose-700/60 dark:from-pink-500/60 dark:to-rose-800/40 transform skew-y-6 rounded-lg shadow-lg border-2 border-pink-500/70"></div>
            <div className="absolute top-3 left-1 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
            <div className="absolute bottom-2 right-1 w-1 h-1 bg-white/80 rounded-full blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            x: [0, 25, -25, 0],
            y: [0, 10, -10, 0],
            opacity: [0.25, 0.5, 0.15, 0.25],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ 
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[8%] left-[70%]"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400/80 to-emerald-700/60 dark:from-green-500/60 dark:to-emerald-800/40 rounded-full shadow-lg border-2 border-green-500/70"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-lime-200/50 to-green-300/30 rounded-full"></div>
            <div className="absolute top-1 right-1 w-1 h-1 bg-white/90 rounded-full blur-sm"></div>
          </div>
        </motion.div>

        {/* Additional Floating Gems */}
        <motion.div
          animate={{ 
            x: [0, -15, 15, 0],
            y: [0, 25, -25, 0],
            opacity: [0.2, 0.4, 0.1, 0.2],
            rotate: [0, 25, -25, 0]
          }}
          transition={{ 
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[60%] left-[80%]"
        >
          <div className="relative">
            <div className="w-6 h-8 bg-gradient-to-br from-teal-400/70 to-cyan-700/50 dark:from-teal-500/50 dark:to-cyan-800/30 transform -skew-x-12 rounded shadow-lg border border-teal-500/60"></div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Particle System */}
      <div className="absolute inset-0">
        {/* Floating Sparkles */}
        {[...Array(120)].map((_, i) => {
          const colors = [
            'bg-yellow-500 dark:bg-yellow-300/70', 'bg-pink-500 dark:bg-pink-300/70', 'bg-blue-500 dark:bg-blue-300/70', 'bg-purple-500 dark:bg-purple-300/70',
            'bg-green-500 dark:bg-green-300/70', 'bg-cyan-500 dark:bg-cyan-300/70', 'bg-orange-500 dark:bg-orange-300/70', 'bg-red-500 dark:bg-red-300/70',
            'bg-indigo-500 dark:bg-indigo-300/70', 'bg-violet-500 dark:bg-violet-300/70', 'bg-emerald-500 dark:bg-emerald-300/70', 'bg-rose-500 dark:bg-rose-300/70'
          ];
          const randomColor = colors[i % colors.length];
          return (
            <motion.div
              key={`sparkle-${i}`}
              className={`absolute w-1 h-1 ${randomColor} rounded-full shadow-md`}
              animate={{ 
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                opacity: [0, 0.9, 0.5, 0],
                scale: [0.3, 1.2, 0.8, 0.3]
              }}
              transition={{ 
                duration: Math.random() * 25 + 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Glowing Orbs */}
        {[...Array(60)].map((_, i) => {
          const colors = [
            'bg-blue-600 dark:bg-blue-400/60', 'bg-purple-600 dark:bg-purple-400/60', 'bg-pink-600 dark:bg-pink-400/60', 'bg-green-600 dark:bg-green-400/60', 
            'bg-yellow-600 dark:bg-yellow-400/60', 'bg-cyan-600 dark:bg-cyan-400/60', 'bg-red-600 dark:bg-red-400/60', 'bg-indigo-600 dark:bg-indigo-400/60',
            'bg-teal-600 dark:bg-teal-400/60', 'bg-orange-600 dark:bg-orange-400/60', 'bg-violet-600 dark:bg-violet-400/60', 'bg-emerald-600 dark:bg-emerald-400/60'
          ];
          const randomColor = colors[i % colors.length];
          return (
            <motion.div
              key={`orb-${i}`}
              className={`absolute w-2 h-2 ${randomColor} rounded-full shadow-lg`}
              animate={{ 
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{ 
                duration: Math.random() * 30 + 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Twinkling Stars */}
        {[...Array(80)].map((_, i) => {
          const colors = [
            'bg-gray-700 dark:bg-white/80', 'bg-yellow-500 dark:bg-yellow-200/90', 'bg-blue-600 dark:bg-blue-200/80', 'bg-pink-600 dark:bg-pink-200/80',
            'bg-purple-600 dark:bg-purple-200/80', 'bg-green-600 dark:bg-green-200/80', 'bg-cyan-600 dark:bg-cyan-200/80'
          ];
          const randomColor = colors[i % colors.length];
          return (
            <motion.div
              key={`star-${i}`}
              className={`absolute w-0.5 h-0.5 ${randomColor} rounded-full shadow-sm`}
              animate={{ 
                opacity: [0, 1, 0.3, 1, 0],
                scale: [0.5, 1.5, 0.8, 2, 0.5]
              }}
              transition={{ 
                duration: Math.random() * 6 + 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 8
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          );
        })}

        {/* Floating Geometric Shapes */}
        {[...Array(40)].map((_, i) => {
          const colors = [
            'bg-indigo-600 dark:bg-indigo-300/50', 'bg-violet-600 dark:bg-violet-300/50', 'bg-fuchsia-600 dark:bg-fuchsia-300/50', 'bg-rose-600 dark:bg-rose-300/50',
            'bg-emerald-600 dark:bg-emerald-300/50', 'bg-teal-600 dark:bg-teal-300/50', 'bg-sky-600 dark:bg-sky-300/50', 'bg-amber-600 dark:bg-amber-300/50'
          ];
          const randomColor = colors[i % colors.length];
          const shapes = ['rounded-full', 'transform rotate-45', 'rounded-sm'];
          const randomShape = shapes[i % shapes.length];
          return (
            <motion.div
              key={`shape-${i}`}
              className={`absolute w-1.5 h-1.5 ${randomColor} ${randomShape} shadow-md`}
              animate={{ 
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                opacity: [0, 0.7, 0],
                rotate: [0, 360, 720]
              }}
              transition={{ 
                duration: Math.random() * 35 + 30,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          );
        })}

        {/* Magical Dust Particles */}
        {[...Array(100)].map((_, i) => {
          const colors = [
            'bg-yellow-700 dark:bg-yellow-400/40', 'bg-pink-700 dark:bg-pink-400/40', 'bg-blue-700 dark:bg-blue-400/40', 'bg-purple-700 dark:bg-purple-400/40',
            'bg-green-700 dark:bg-green-400/40', 'bg-cyan-700 dark:bg-cyan-400/40', 'bg-orange-700 dark:bg-orange-400/40', 'bg-red-700 dark:bg-red-400/40'
          ];
          const randomColor = colors[i % colors.length];
          return (
            <motion.div
              key={`dust-${i}`}
              className={`absolute w-0.5 h-0.5 ${randomColor} rounded-full shadow-sm`}
              animate={{ 
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Gradient Bubbles */}
        {[...Array(30)].map((_, i) => {
          const gradients = [
            'bg-gradient-to-br from-blue-300/30 to-purple-400/20',
            'bg-gradient-to-br from-pink-300/30 to-rose-400/20',
            'bg-gradient-to-br from-green-300/30 to-emerald-400/20',
            'bg-gradient-to-br from-yellow-300/30 to-orange-400/20',
            'bg-gradient-to-br from-cyan-300/30 to-teal-400/20',
            'bg-gradient-to-br from-purple-300/30 to-violet-400/20'
          ];
          const randomGradient = gradients[i % gradients.length];
          return (
            <motion.div
              key={`bubble-${i}`}
              className={`absolute w-3 h-3 ${randomGradient} rounded-full shadow-sm border border-white/20`}
              animate={{ 
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                opacity: [0, 0.6, 0],
                scale: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: Math.random() * 40 + 35,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedBackground;