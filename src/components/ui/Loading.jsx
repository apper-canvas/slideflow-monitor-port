import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Main Image Skeleton */}
        <motion.div
          className="w-full max-w-4xl aspect-video bg-gradient-to-br from-surface to-secondary/50 rounded-xl"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Controls Skeleton */}
        <div className="flex items-center justify-center space-x-6">
          <motion.div
            className="w-12 h-12 bg-surface rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-16 h-12 bg-surface rounded-lg"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
          <motion.div
            className="w-12 h-12 bg-surface rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </div>
        
        {/* Thumbnail Strip Skeleton */}
        <div className="flex space-x-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              className="w-20 h-12 bg-surface rounded-lg flex-shrink-0"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.1
              }}
            />
          ))}
        </div>
        
        {/* Loading Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-lg font-medium text-white/90 mb-2">
            Loading Images...
          </div>
          <div className="text-sm text-white/60">
            Preparing your cinematic experience
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;