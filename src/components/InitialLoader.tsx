'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the loader after the animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-bg/95 backdrop-blur-md"
        >
          <div className="relative flex flex-col items-center">
            {/* Glass Container */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="glass flex h-56 w-56 items-center justify-center rounded-[3rem] border border-border/50 shadow-2xl p-8 relative overflow-hidden"
            >
              {/* Background ambient glow */}
              <div className="absolute inset-0 bg-accent/5 blur-2xl" />

              <div className="relative h-full w-full">
                {/* Greyscale Base Image */}
                <div className="absolute inset-0">
                  <Image 
                    src="/logo.png" 
                    alt="Loading" 
                    fill 
                    className="object-contain grayscale opacity-20" 
                    priority
                  />
                </div>

                {/* Colored Rising Image */}
                <motion.div
                  className="absolute bottom-0 left-0 w-full overflow-hidden"
                  initial={{ height: '0%' }}
                  animate={{ height: '100%' }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 0.5, 
                    ease: [0.45, 0, 0.15, 1] // Elegant smooth easing
                  }}
                >
                  <div className="absolute bottom-0 left-0 w-full h-56">
                    <Image 
                      src="/logo.png" 
                      alt="Loading Colored" 
                      fill 
                      className="object-contain drop-shadow-[0_0_20px_var(--color-accent-glow)]" 
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Loading text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 0.8, duration: 1.5, repeat: Infinity }}
              className="mt-6 text-sm font-bold tracking-widest text-accent uppercase"
            >
              Initializing...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
