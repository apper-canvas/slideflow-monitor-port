import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import IconButton from "@/components/atoms/IconButton";

const NavigationArrows = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isVisible = true,
  className
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Previous Arrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10"
          >
            <IconButton
              icon="ChevronLeft"
              onClick={onPrevious}
              variant="ghost"
              size="lg"
              disabled={!canGoPrevious}
              className="disabled:opacity-20 hover:scale-110 active:scale-95"
            />
          </motion.div>
          
          {/* Next Arrow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10"
          >
            <IconButton
              icon="ChevronRight"
              onClick={onNext}
              variant="ghost"
              size="lg"
              disabled={!canGoNext}
              className="disabled:opacity-20 hover:scale-110 active:scale-95"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavigationArrows;