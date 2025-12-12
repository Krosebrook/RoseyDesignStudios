
import React, { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

// --- BUTTONS ---

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  leftIcon, 
  rightIcon, 
  children, 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] focus:ring-primary-500",
    secondary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] focus:ring-indigo-500",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-stone-100 text-stone-600 hover:text-stone-900 focus:ring-stone-400",
    outline: "bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-sm focus:ring-stone-400"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-3"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

// --- INPUTS ---

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">{label}</label>}
      <input 
        className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${error ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-stone-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ className = '', label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">{label}</label>}
      <textarea 
        className={`w-full p-3 rounded-lg border text-sm outline-none transition-all resize-none ${error ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-stone-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// --- CONTAINERS ---

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: React.ReactNode }> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-stone-100 font-semibold text-stone-800 bg-stone-50/50">
          {title}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export const Spinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <Loader2 size={size} className={`animate-spin text-primary-500 ${className}`} />
);
