import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const IconButton = forwardRef(({ 
  icon, 
  className, 
  variant = "ghost", 
  size = "md", 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/20",
    secondary: "bg-surface/60 text-white hover:bg-surface/80 border border-white/10 hover:border-white/20",
    ghost: "bg-black/40 text-white hover:bg-black/60 hover:shadow-lg",
    accent: "bg-gradient-to-r from-accent to-accent/80 text-white hover:from-accent/90 hover:to-accent/70 shadow-lg hover:shadow-xl hover:shadow-accent/20"
  };
  
  const sizes = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4"
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <ApperIcon name={icon} size={iconSizes[size]} />
    </button>
  );
});

IconButton.displayName = "IconButton";

export default IconButton;