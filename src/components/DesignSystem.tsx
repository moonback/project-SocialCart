import React from 'react';
import { motion } from 'framer-motion';

// Composants de boutons avec design glass
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    ghost: 'btn-ghost',
    glass: 'btn-glass',
    floating: 'btn-floating'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}

// Composant de carte avec effet glass
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'glass-hover';
  className?: string;
  onClick?: () => void;
}

export function Card({ 
  children, 
  variant = 'default', 
  className = '',
  onClick 
}: CardProps) {
  const variantClasses = {
    default: 'card',
    glass: 'card-glass',
    'glass-hover': 'card-glass-hover'
  };

  const classes = `${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`;

  if (onClick) {
    return (
      <motion.div
        onClick={onClick}
        className={classes}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

// Composant d'input avec effet glass
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  variant?: 'default' | 'glass';
  error?: boolean;
  success?: boolean;
  [key: string]: any;
}

export function Input({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  variant = 'default',
  error = false,
  success = false,
  ...props
}: InputProps) {
  const baseClasses = 'w-full px-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none placeholder:text-surface-400';
  
  const variantClasses = {
    default: 'input',
    glass: 'input-glass'
  };

  const stateClasses = error ? 'input-error' : success ? 'input-success' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={classes}
      {...props}
    />
  );
}

// Composant de badge avec effet glass
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = ''
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full backdrop-blur-sm border';
  
  const variantClasses = {
    default: 'bg-white/60 text-surface-700 border-white/30',
    primary: 'bg-primary-500/20 text-primary-700 border-primary-300/50',
    secondary: 'bg-secondary-500/20 text-secondary-700 border-secondary-300/50',
    success: 'bg-green-500/20 text-green-700 border-green-300/50',
    warning: 'bg-yellow-500/20 text-yellow-700 border-yellow-300/50',
    error: 'bg-red-500/20 text-red-700 border-red-300/50'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

// Composant de modal avec effet glass
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  className = ''
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full ${sizeClasses[size]} bg-white/90 backdrop-blur-xl rounded-3xl shadow-glass border border-white/20 overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-white/20">
            <h2 className="text-xl font-bold text-surface-900">{title}</h2>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Composant de loading avec effet glass
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

export function Loading({ 
  size = 'md', 
  variant = 'spinner',
  className = ''
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'spinner') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full border-4 border-primary-200/50 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizeClasses[size]} bg-primary-600 rounded-full`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} bg-primary-600 rounded-full ${className}`}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}
