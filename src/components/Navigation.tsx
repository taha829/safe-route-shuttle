import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Settings,
  ChevronDown
} from 'lucide-react';

interface NavigationProps {
  currentRole: 'parent' | 'captain' | 'school' | 'admin';
  onRoleChange: (role: 'parent' | 'captain' | 'school' | 'admin') => void;
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
    { key: 'news', icon: FileText, label: t('nav.news') },
    { key: 'reports', icon: FileText, label: t('nav.reports') },
    { key: 'settings', icon: Settings, label: t('nav.settings') },
  ];

  // Language is now Arabic only, no toggle needed

  const getRoleGradient = () => {
    switch (currentRole) {
      case 'admin': return 'from-red-500 to-pink-600';
      case 'school': return 'from-blue-500 to-indigo-600';
      case 'captain': return 'from-green-500 to-emerald-600';
      case 'parent': return 'from-purple-500 to-violet-600';
      default: return 'from-primary to-primary-glow';
    }
  };

  const getRoleTitle = () => {
    switch (currentRole) {
      case 'admin': return 'لوحة الإدارة العامة';
      case 'school': return 'بوابة المدرسة';
      case 'captain': return 'كابتن الباص';
      case 'parent': return 'بوابة الأولياء';
      default: return 'الطريق الآمن';
    }
  };

  return (
    <nav className="bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-elegant sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Professional Logo & Branding */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className={`relative flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${getRoleGradient()} rounded-2xl shadow-glow`}>
              <Bus className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse-glow"></div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-2xl xl:text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                {getRoleTitle()}
              </h1>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRoleGradient()} animate-pulse`}></div>
                <p className="text-sm text-muted-foreground font-medium">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Desktop Menu - Dropdown */}
          <div className="hidden lg:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`group relative flex items-center space-x-3 rtl:space-x-reverse px-6 py-3 rounded-xl transition-all duration-500 bg-gradient-to-r ${getRoleGradient()} text-white shadow-glow hover:scale-105`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-sm font-semibold tracking-wide">القائمة الرئيسية</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-card/95 backdrop-blur-xl border border-border/50 shadow-elegant z-50"
                align="end"
                sideOffset={8}
              >
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.key;
                  return (
                    <DropdownMenuItem
                      key={item.key}
                      onClick={() => onPageChange(item.key)}
                      className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 cursor-pointer transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${getRoleGradient()} text-white`
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="mr-auto w-2 h-2 rounded-full bg-white animate-bounce"></div>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Professional Right Controls */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Enhanced Role Switcher */}
            <div className="hidden xl:flex bg-card border border-border/50 rounded-xl p-1.5 shadow-card-custom">
              {(['parent', 'captain', 'school', 'admin'] as const).map((role) => {
                const isCurrentRole = currentRole === role;
                return (
                  <Button
                    key={role}
                    variant={isCurrentRole ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onRoleChange(role)}
                    className={`relative text-xs px-4 h-9 font-medium transition-all duration-300 ${
                      isCurrentRole 
                        ? `bg-gradient-to-r ${getRoleGradient()} text-white shadow-glow`
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    {t(`role.${role}`)}
                    {isCurrentRole && (
                      <div className="absolute inset-0 bg-white/20 rounded-md animate-pulse-glow"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Enhanced Controls Group */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-card/50 border border-border/50 rounded-xl p-1 shadow-card-custom">
              {/* Professional Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-lg hover:bg-accent/50 transition-all duration-300 hover:scale-110"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>

              {/* Enhanced Language Indicator */}
              <div className="hidden lg:flex items-center px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <Globe className="w-4 h-4 text-primary ml-2" />
                <span className="text-sm font-semibold text-primary">العربية</span>
              </div>
            </div>

            {/* Enhanced Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-12 h-12 rounded-xl hover:bg-accent/50 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border mt-2 py-4 space-y-2">
            {/* Mobile Role Switcher */}
            <div className="flex space-x-2 rtl:space-x-reverse mb-4">
              {(['parent', 'captain', 'school', 'admin'] as const).map((role) => (
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