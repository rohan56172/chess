import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

/**
 * Card Container Component
 * 
 * Reusable card with optional title
 */
export function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}