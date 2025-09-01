
import React from 'react';

interface CalculatorCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden animate-fade-in">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="text-primary dark:text-blue-400 mr-3">{icon}</div>
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
