import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  translations: Record<string, string>;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.tracking': 'Bus Tracking',
    'nav.students': 'Students',
    'nav.payments': 'Payments',
    'nav.routes': 'Routes',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to SafeRoute',
    'dashboard.subtitle': 'School Bus Tracking & Payment System',
    'dashboard.totalStudents': 'Total Students',
    'dashboard.activebuses': 'Active Buses',
    'dashboard.todayPickups': 'Today\'s Pickups',
    'dashboard.totalRevenue': 'Total Revenue',
    
    // Tracking
    'tracking.title': 'Live Bus Tracking',
    'tracking.subtitle': 'Real-time location of all school buses',
    'tracking.busStatus': 'Bus Status',
    'tracking.onRoute': 'On Route',
    'tracking.delayed': 'Delayed',
    'tracking.arrived': 'Arrived',
    
    // Students
    'students.title': 'Student Management',
    'students.addStudent': 'Add Student',
    'students.name': 'Name',
    'students.grade': 'Grade',
    'students.bus': 'Bus Number',
    'students.status': 'Status',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.search': 'Search...',
    
    // Roles
    'role.parent': 'Parent',
    'role.captain': 'Captain',
    'role.admin': 'Admin'
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.tracking': 'تتبع الحافلة',
    'nav.students': 'الطلاب',
    'nav.payments': 'المدفوعات',
    'nav.routes': 'المسارات',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك في الطريق الآمن',
    'dashboard.subtitle': 'نظام تتبع الحافلات المدرسية والمدفوعات',
    'dashboard.totalStudents': 'إجمالي الطلاب',
    'dashboard.activebuses': 'الحافلات النشطة',
    'dashboard.todayPickups': 'رحلات اليوم',
    'dashboard.totalRevenue': 'إجمالي الإيرادات',
    
    // Tracking
    'tracking.title': 'تتبع الحافلة المباشر',
    'tracking.subtitle': 'الموقع الحقيقي لجميع الحافلات المدرسية',
    'tracking.busStatus': 'حالة الحافلة',
    'tracking.onRoute': 'في الطريق',
    'tracking.delayed': 'متأخرة',
    'tracking.arrived': 'وصلت',
    
    // Students
    'students.title': 'إدارة الطلاب',
    'students.addStudent': 'إضافة طالب',
    'students.name': 'الاسم',
    'students.grade': 'الصف',
    'students.bus': 'رقم الحافلة',
    'students.status': 'الحالة',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض',
    'common.search': 'بحث...',
    
    // Roles
    'role.parent': 'ولي أمر',
    'role.captain': 'كابتن',
    'role.admin': 'مدير'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage or browser
    const saved = localStorage.getItem('safeRoute-language') as Language;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    // Save language preference and update document
    localStorage.setItem('safeRoute-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    dir: language === 'ar' ? 'rtl' : 'ltr',
    translations: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Helper hook for translations
export const useTranslation = () => {
  const { translations } = useLanguage();
  
  const t = (key: string): string => {
    return translations[key] || key;
  };
  
  return { t };
};