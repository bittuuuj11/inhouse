import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/event-planning-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Event planning overview and AI generation hub'
    },
    {
      label: 'Event Plan',
      path: '/event-plan-details',
      icon: 'Calendar',
      tooltip: 'Detailed timeline and agenda management'
    },
    {
      label: 'Tasks',
      path: '/task-board-management',
      icon: 'CheckSquare',
      tooltip: 'Visual task board and progress tracking'
    },
    {
      label: 'Budget',
      path: '/budget-calculator',
      icon: 'Calculator',
      tooltip: 'Dynamic cost calculation and financial planning'
    },
    {
      label: 'Marketing',
      path: '/marketing-materials',
      icon: 'Megaphone',
      tooltip: 'AI-generated promotional content and assets'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border shadow-card">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/event-planning-dashboard" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Sparkles" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">Smart Event</span>
                <span className="text-xs text-muted-foreground -mt-1">Planner</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <div key={item?.path} className="relative group">
                <a
                  href={item?.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-muted ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={item?.tooltip}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </a>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-1100 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu} />
          <div className="fixed top-0 right-0 w-80 h-full bg-card shadow-modal animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="Sparkles" size={20} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-foreground">Smart Event</span>
                  <span className="text-xs text-muted-foreground -mt-1">Planner</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <nav className="p-6">
              <div className="space-y-2">
                {navigationItems?.map((item) => (
                  <a
                    key={item?.path}
                    href={item?.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-smooth hover:bg-muted ${
                      isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={item?.icon} size={20} />
                    <div className="flex flex-col">
                      <span>{item?.label}</span>
                      <span className="text-xs opacity-75">{item?.tooltip}</span>
                    </div>
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;