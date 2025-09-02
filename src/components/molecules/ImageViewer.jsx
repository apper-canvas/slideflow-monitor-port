import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const ImageViewer = ({ 
  image, 
  isLoading, 
  onLoad, 
  onError,
  className 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [image?.Id]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad && onLoad();
  };

  const handleImageError = () => {
    setImageError(true);
    onError && onError();
  };

  if (!image) return null;

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
      <AnimatePresence mode="wait">
        {!imageLoaded && !imageError && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full max-w-4xl aspect-video bg-gradient-to-br from-surface to-secondary/50 rounded-xl animate-pulse" />
          </motion.div>
        )}
        
        {imageError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center text-white/70 p-8"
          >
            <div className="text-lg font-medium mb-2">Failed to load image</div>
            <div className="text-sm">{image.title}</div>
          </motion.div>
        )}
        
        {!imageError && (
          <motion.img
            key={`image-${image.Id}`}
            ref={imgRef}
            src={image.url}
            alt={image.title}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: imageLoaded ? 1 : 0, 
              scale: imageLoaded ? 1 : 0.95 
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </AnimatePresence>
      
      {/* Image Info Overlay */}
      <AnimatePresence>
        {imageLoaded && image.title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-1">
              {image.title}
            </h3>
            {image.description && (
              <p className="text-sm text-white/80">
                {image.description}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageViewer;