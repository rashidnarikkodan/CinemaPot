import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rectangle" | "circle" | "text";
}

/**
 * High-performance GPU-accelerated Shimmer Skeleton
 * Used to reduce CLS and improve perceived performance
 */
const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = "rectangle" }) => {
  const baseClass = "relative overflow-hidden bg-zinc-900/50";
  
  const variantClasses = {
    rectangle: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`}>
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
};

export default Skeleton;
