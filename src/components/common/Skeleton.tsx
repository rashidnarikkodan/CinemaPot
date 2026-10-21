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
  const baseClass = "relative overflow-hidden bg-zinc-900/60 backdrop-blur-sm border border-white/[0.03]";
  
  const variantClasses = {
    rectangle: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`}>
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default Skeleton;
