import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ImageViewer from "@/components/molecules/ImageViewer";
import NavigationArrows from "@/components/molecules/NavigationArrows";
import SliderControls from "@/components/molecules/SliderControls";
import ThumbnailStrip from "@/components/molecules/ThumbnailStrip";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideDuration, setSlideDuration] = useState(5);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    const showControls = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    };

    const handleMouseMove = () => showControls();
    const handleKeyDown = () => showControls();

    if (isPlaying) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("keydown", handleKeyDown);
      showControls();
    } else {
      setControlsVisible(true);
    }

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  // Slideshow functionality
  useEffect(() => {
    if (!isPlaying || !images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (prevIndex === images.length - 1) {
          setIsPlaying(false);
          toast.info("Slideshow completed");
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, slideDuration * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, slideDuration, images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
        case " ":
          event.preventDefault();
          togglePlayback();
          break;
        case "Escape":
          event.preventDefault();
          setIsPlaying(false);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, images]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsImageLoading(true);
    }
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsImageLoading(true);
    }
  }, [currentIndex, images.length]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => {
      const newState = !prev;
      toast.success(newState ? "Slideshow started" : "Slideshow paused");
      return newState;
    });
  }, []);

  const handleImageSelect = useCallback((index) => {
    setCurrentIndex(index);
    setIsImageLoading(true);
    if (isPlaying) {
      setIsPlaying(false);
      toast.info("Slideshow paused");
    }
  }, [isPlaying]);

  const handleDurationChange = useCallback((duration) => {
    setSlideDuration(duration);
    toast.success(`Slideshow speed set to ${duration}s`);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsImageLoading(false);
    toast.error("Failed to load image");
  }, []);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Main Image Display */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            <ImageViewer
              image={currentImage}
              isLoading={isImageLoading}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="w-full h-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <NavigationArrows
        onPrevious={goToPrevious}
        onNext={goToNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        isVisible={controlsVisible}
      />

      {/* Bottom Controls */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 space-y-4"
          >
            {/* Slider Controls */}
            <SliderControls
              isPlaying={isPlaying}
              onPlayToggle={togglePlayback}
              onPrevious={goToPrevious}
              onNext={goToNext}
              currentIndex={currentIndex}
              totalImages={images.length}
              slideDuration={slideDuration}
              onDurationChange={handleDurationChange}
            />

            {/* Thumbnail Strip */}
            <ThumbnailStrip
              images={images}
              currentIndex={currentIndex}
              onImageSelect={handleImageSelect}
              className="max-w-4xl mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {isPlaying && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            key={`progress-${currentIndex}`}
            transition={{
              duration: slideDuration,
              ease: "linear"
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ImageSlider;