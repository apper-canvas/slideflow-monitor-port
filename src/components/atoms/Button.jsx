import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/20",
    secondary: "bg-surface/80 backdrop-blur-sm text-white hover:bg-surface border border-white/10 hover:border-white/20",
    ghost: "bg-transparent text-white hover:bg-white/10 backdrop-blur-sm",
    accent: "bg-gradient-to-r from-accent to-accent/80 text-white hover:from-accent/90 hover:to-accent/70 shadow-lg hover:shadow-xl hover:shadow-accent/20"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2.5"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;