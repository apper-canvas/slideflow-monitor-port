import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ onAction }) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-8">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          animate={{
            boxShadow: [
              "0 0 20px rgba(99, 102, 241, 0.3)",
              "0 0 30px rgba(99, 102, 241, 0.5)",
              "0 0 20px rgba(99, 102, 241, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ApperIcon name="Images" size={36} className="text-primary" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-white mb-4">
          No Images Found
        </h3>
        
        <p className="text-white/70 mb-8 leading-relaxed">
          Your image gallery is empty. Add some beautiful images to create your cinematic slideshow experience.
        </p>
        
        {onAction && (
          <motion.button
            onClick={onAction}
            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20 flex items-center space-x-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" size={20} />
            <span>Add Images</span>
          </motion.button>
        )}
        
        <div className="mt-8 text-sm text-white/50">
          Supported formats: JPG, PNG, WebP
        </div>
      </motion.div>
    </div>
  );
};

export default Empty;