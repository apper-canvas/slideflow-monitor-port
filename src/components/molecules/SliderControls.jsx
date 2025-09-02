import React from "react";
import { motion } from "framer-motion";
import IconButton from "@/components/atoms/IconButton";
import ApperIcon from "@/components/ApperIcon";

const SliderControls = ({
  isPlaying,
  onPlayToggle,
  onPrevious,
  onNext,
  currentIndex,
  totalImages,
  slideDuration,
  onDurationChange,
  className
}) => {
  const durations = [
    { value: 3, label: "3s" },
    { value: 5, label: "5s" },
    { value: 7, label: "7s" },
    { value: 10, label: "10s" }
  ];

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {/* Previous Button */}
      <IconButton
        icon="ChevronLeft"
        onClick={onPrevious}
        variant="ghost"
        size="md"
        disabled={currentIndex === 0}
        className="disabled:opacity-30"
      />
      
      {/* Play/Pause Button */}
      <motion.button
        onClick={onPlayToggle}
        className="relative p-4 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30 hover:bg-primary/30 hover:border-primary/50 transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isPlaying ? 0 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon 
            name={isPlaying ? "Pause" : "Play"} 
            size={24} 
            className="text-white group-hover:text-primary transition-colors duration-200" 
          />
        </motion.div>
        
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{
            scale: isPlaying ? [1, 1.2, 1] : 1,
            opacity: isPlaying ? [0.5, 0.8, 0.5] : 0
          }}
          transition={{
            duration: 2,
            repeat: isPlaying ? Infinity : 0
          }}
        />
      </motion.button>
      
      {/* Next Button */}
      <IconButton
        icon="ChevronRight"
        onClick={onNext}
        variant="ghost"
        size="md"
        disabled={currentIndex === totalImages - 1}
        className="disabled:opacity-30"
      />
      
      {/* Duration Selector */}
      <div className="relative ml-6">
        <select
          value={slideDuration}
          onChange={(e) => onDurationChange(parseInt(e.target.value))}
          className="appearance-none bg-surface/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 focus:border-primary focus:outline-none transition-all duration-200 cursor-pointer pr-8"
        >
          {durations.map((duration) => (
            <option key={duration.value} value={duration.value} className="bg-surface">
              {duration.label}
            </option>
          ))}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none" 
        />
      </div>
      
      {/* Progress Indicator */}
      <div className="flex items-center space-x-2 ml-6 text-sm text-white/70">
        <span>{currentIndex + 1}</span>
        <span>/</span>
        <span>{totalImages}</span>
      </div>
    </div>
  );
};

export default SliderControls;