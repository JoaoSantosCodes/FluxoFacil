import React from "react";
import { cn } from "../../lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "bars";
  className?: string;
}

export const LoaderOne: React.FC<LoaderProps> = ({ 
  size = "md", 
  variant = "spinner",
  className 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const variantClasses = {
    spinner: "animate-spin",
    dots: "animate-pulse",
    pulse: "animate-ping",
    bars: "animate-bounce"
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        <div className={cn(
          "bg-current rounded-full",
          sizeClasses[size],
          "animate-bounce"
        )} style={{ animationDelay: "0ms" }} />
        <div className={cn(
          "bg-current rounded-full",
          sizeClasses[size],
          "animate-bounce"
        )} style={{ animationDelay: "150ms" }} />
        <div className={cn(
          "bg-current rounded-full",
          sizeClasses[size],
          "animate-bounce"
        )} style={{ animationDelay: "300ms" }} />
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex space-x-1", className)}>
        <div className={cn(
          "bg-current rounded",
          size === "sm" ? "w-1 h-4" : size === "md" ? "w-1.5 h-6" : "w-2 h-8",
          "animate-pulse"
        )} style={{ animationDelay: "0ms" }} />
        <div className={cn(
          "bg-current rounded",
          size === "sm" ? "w-1 h-4" : size === "md" ? "w-1.5 h-6" : "w-2 h-8",
          "animate-pulse"
        )} style={{ animationDelay: "150ms" }} />
        <div className={cn(
          "bg-current rounded",
          size === "sm" ? "w-1 h-4" : size === "md" ? "w-1.5 h-6" : "w-2 h-8",
          "animate-pulse"
        )} style={{ animationDelay: "300ms" }} />
      </div>
    );
  }

  return (
    <div className={cn(
      "border-2 border-current border-t-transparent rounded-full",
      sizeClasses[size],
      variantClasses[variant],
      className
    )} />
  );
};

export const LoaderTwo: React.FC<LoaderProps> = ({ 
  size = "md", 
  className 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <div className="absolute inset-1 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
    </div>
  );
};

export const LoaderThree: React.FC<LoaderProps> = ({ 
  size = "md", 
  className 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <div className="absolute inset-2 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "2s" }} />
      <div className="absolute inset-4 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ animationDuration: "1s" }} />
    </div>
  );
}; 