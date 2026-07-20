'use client';

import { motion } from 'framer-motion';

const BLOBS = [
  { className: 'left-[-10%] top-[-15%] size-[28rem] bg-primary', duration: 18, delay: 0 },
  { className: 'right-[-12%] top-[10%] size-[24rem] bg-info', duration: 22, delay: 2 },
  { className: 'bottom-[-15%] left-[20%] size-[26rem] bg-primary-container', duration: 20, delay: 4 },
];

export function AnimatedGlowBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full opacity-25 blur-[100px] ${blob.className}`}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
