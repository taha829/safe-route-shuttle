import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage, useTranslation } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Globe, 
  Sun, 
  Moon, 
  Bus, 
  Menu, 
  X,
  LayoutDashboard,
  MapPin,
  Users,
  CreditCard,
  Route,
  FileText,
  Settings
} from 'lucide-react';

interface NavigationProps {
  currentRole: 'parent' | 'captain' | 'admin';
  onRoleChange: (role: 'parent' | 'captain' | 'admin') => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentRole, 
  onRoleChange, 
  currentPage, 
  onPageChange 
}) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { key: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { key: 'tracking', icon: MapPin, label: t('nav.tracking') },
    { key: 'students', icon: Users, label: t('nav.students') },
    { key: 'payments', icon: CreditCard, label: t('nav.payments') },
    { key: 'routes', icon: Route, label: t('nav.routes') },
    { key: 'reports', icon: FileText, label: t('nav.reports') },
    { key: 'settings', icon: Settings, label: t('nav.settings') },
  ];

  // Language is now Arabic only, no toggle needed

  return (
    <nav className="bg-card border-b border-border shadow-card-custom sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg shadow-bus">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                الطريق الآمن
              </h1>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.subtitle')}
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => onPageChange(item.key)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.key
                      ? 'bg-gradient-primary text-white shadow-bus'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Role Switcher */}
            <div className="hidden md:flex bg-muted rounded-lg p-1">
              {(['parent', 'captain', 'admin'] as const).map((role) => (
                <Button
                  key={role}
                  variant={currentRole === role ? role : 'ghost'}
                  size="sm"
                  onClick={() => onRoleChange(role)}
                  className="text-xs px-3 h-8"
                >
                  {t(`role.${role}`)}
                </Button>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

            {/* Arabic Language Indicator */}
            <div className="hidden md:flex items-center px-3 py-1 bg-primary/10 rounded-lg">
              <Globe className="w-4 h-4 text-primary ml-2" />
              <span className="text-sm font-medium text-primary">العربية</span>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border mt-2 py-4 space-y-2">
            {/* Mobile Role Switcher */}
            <div className="flex space-x-2 rtl:space-x-reverse mb-4">
              {(['parent', 'captain', 'admin'] as const).map((role) => (
                <Button
                  key={role}
                  variant={currentRole === role ? role : 'outline'}
                  size="sm"
                  onClick={() => onRoleChange(role)}
                  className="flex-1 text-xs"
                >
                  {t(`role.${role}`)}
                </Button>
              ))}
            </div>

            {/* Mobile Menu Items */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onPageChange(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-all duration-300 ${
                    currentPage === item.key
                      ? 'bg-gradient-primary text-white shadow-bus'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;