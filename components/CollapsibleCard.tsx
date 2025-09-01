
import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './Icons';

interface CollapsibleCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initialCollapsed?: boolean;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title, icon, children, initialCollapsed = true }) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const uniqueId = `collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg transition-shadow duration-300 animate-fade-in mb-6 overflow-hidden">
      <div className="border-b border-secondary dark:border-gray-600">
        <button
          className="p-6 w-full flex items-center justify-between"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          aria-controls={uniqueId}
        >
          <div className="flex items-center">
            <div className="text-primary dark:text-blue-400 mr-3">{icon}</div>
            <h2 className="text-xl font-bold text-left text-text-light dark:text-text-dark">{title}</h2>
          </div>
          <div className="p-1 text-gray-600 dark:text-gray-300">
            {isCollapsed ? <ChevronDownIcon className="w-6 h-6" /> : <ChevronUpIcon className="w-6 h-6" />}
          </div>
        </button>
      </div>
      
      <div
        id={uniqueId}
        className="transition-[grid-template-rows] duration-300 ease-in-out grid"
        style={{
          gridTemplateRows: isCollapsed ? '0fr' : '1fr',
        }}
      >
        <div className="overflow-hidden">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
