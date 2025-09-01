
import React from 'react';
import { CalculatorIcon, UltrasoundIcon, XIcon } from './Icons';

type Page = 'calculators' | 'lung_ultrasound' | 'abdominal_ultrasound';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-primary-light text-white shadow-md'
          : 'text-gray-600 dark:text-gray-300 hover:bg-secondary dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
      role="button"
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  
  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) { // Close sidebar on mobile after click
        setIsOpen(false);
    }
  }

  const sidebarContent = (
      <>
        <div className="p-4 flex justify-between items-center lg:justify-center">
            <h2 className="text-2xl font-bold text-primary dark:text-blue-400">Modules</h2>
            <button 
                onClick={() => setIsOpen(false)} 
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Close sidebar"
            >
                <XIcon />
            </button>
        </div>
        <nav className="flex-1 px-4">
          <ul>
            <NavItem
              icon={<CalculatorIcon />}
              label="Calculators"
              isActive={currentPage === 'calculators'}
              onClick={() => handleNavClick('calculators')}
            />
            <NavItem
              icon={<UltrasoundIcon />}
              label="Lung Ultrasound"
              isActive={currentPage === 'lung_ultrasound'}
              onClick={() => handleNavClick('lung_ultrasound')}
            />
             <NavItem
              icon={<UltrasoundIcon />}
              label="Abdominal Ultrasound"
              isActive={currentPage === 'abdominal_ultrasound'}
              onClick={() => handleNavClick('abdominal_ultrasound')}
            />
          </ul>
        </nav>
      </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-surface-light dark:bg-surface-dark shadow-xl z-40 flex flex-col transition-transform transform lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-surface-light dark:bg-surface-dark shadow-md flex-col flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
};
