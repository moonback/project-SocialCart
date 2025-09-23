import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean | string;
  animate?: boolean;
}

export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = true,
  animate = true 
}: SkeletonProps) {
  const roundedClass = typeof rounded === 'string' ? rounded : rounded ? 'rounded' : '';
  
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${roundedClass} ${className}`}
      style={{ width, height }}
      animate={animate ? {
        backgroundPosition: ['200% 0', '-200% 0']
      } : {}}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
}

// Composants Skeleton spécialisés
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}>
      <Skeleton height="200px" className="mb-4" />
      <Skeleton height="1.25rem" width="80%" className="mb-2" />
      <Skeleton height="1rem" width="60%" className="mb-2" />
      <Skeleton height="1.5rem" width="40%" />
    </div>
  );
}

export function SkeletonProductCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}>
      <Skeleton height="180px" className="mb-4" />
      <div className="space-y-2">
        <Skeleton height="1.25rem" width="90%" />
        <Skeleton height="1rem" width="70%" />
        <div className="flex justify-between items-center mt-3">
          <Skeleton height="1.5rem" width="60px" />
          <Skeleton height="2rem" width="80px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonVideoCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-black rounded-2xl overflow-hidden ${className}`}>
      <Skeleton height="400px" />
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <Skeleton height="1rem" width="60%" className="bg-white/20" />
        <Skeleton height="1.25rem" width="80%" className="bg-white/20" />
        <Skeleton height="2rem" width="120px" className="bg-white/20" />
      </div>
    </div>
  );
}

export function SkeletonProfile({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton width="60px" height="60px" className="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton height="1.25rem" width="40%" />
          <Skeleton height="1rem" width="60%" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="90%" />
        <Skeleton height="1rem" width="75%" />
      </div>
    </div>
  );
}

export function SkeletonList({ 
  count = 3, 
  itemComponent: ItemComponent = SkeletonCard,
  className = '' 
}: { 
  count?: number; 
  itemComponent?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ItemComponent />
        </motion.div>
      ))}
    </div>
  );
}

// Hook pour gérer les états de chargement
export function useSkeleton(loading: boolean, children: React.ReactNode, skeleton: React.ReactNode) {
  if (loading) {
    return skeleton;
  }
  return children;
}

// Composant de chargement avec skeleton
export function LoadingWithSkeleton({ 
  loading, 
  children, 
  skeleton,
  className = '' 
}: { 
  loading: boolean; 
  children: React.ReactNode; 
  skeleton?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {loading ? (
        skeleton || <SkeletonCard />
      ) : (
        children
      )}
    </div>
  );
}
