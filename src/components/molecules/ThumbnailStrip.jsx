import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ThumbnailStrip = ({ 
  images, 
  currentIndex, 
  onImageSelect,
  className 
}) => {
  const stripRef = useRef(null);
  const currentThumbnailRef = useRef(null);

  useEffect(() => {
    if (currentThumbnailRef.current && stripRef.current) {
      currentThumbnailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [currentIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={stripRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((image, index) => (
          <motion.button
            key={image.Id}
            ref={index === currentIndex ? currentThumbnailRef : null}
            onClick={() => onImageSelect(index)}
            className={cn(
              "relative flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 border-2",
              index === currentIndex
                ? "border-primary shadow-lg shadow-primary/30 scale-105"
                : "border-white/20 hover:border-white/40 hover:scale-102"
            )}
            whileHover={{ scale: index === currentIndex ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={image.thumbnailUrl || image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            
            {/* Active Indicator */}
            {index === currentIndex && (
              <motion.div
                layoutId="thumbnail-indicator"
                className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ThumbnailStrip;