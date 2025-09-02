import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-8">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6"
          animate={{
            boxShadow: [
              "0 0 20px rgba(239, 68, 68, 0.3)",
              "0 0 30px rgba(239, 68, 68, 0.5)",
              "0 0 20px rgba(239, 68, 68, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ApperIcon name="AlertCircle" size={32} className="text-red-400" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-white mb-3">
          Failed to Load Images
        </h3>
        
        <p className="text-white/70 mb-6 leading-relaxed">
          {message}. Please check your connection and try again.
        </p>
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-medium rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20 flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="RotateCcw" size={18} />
            <span>Try Again</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Error;