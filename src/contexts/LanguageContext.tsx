import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl';
  translations: Record<string, string>;
}

const translations = {
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم الرئيسية',
    'nav.tracking': 'تتبع الحافلات المباشر',
    'nav.students': 'إدارة الطلاب',
    'nav.payments': 'نظام المدفوعات',
    'nav.routes': 'مسارات الحافلات',
    'nav.reports': 'التقارير والإحصائيات',
    'nav.settings': 'الإعدادات العامة',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك في منصة الطريق الآمن',
    'dashboard.subtitle': 'نظام تتبع ومراقبة الحافلات المدرسية والمدفوعات الإلكترونية',
    'dashboard.totalStudents': 'إجمالي عدد الطلاب',
    'dashboard.activebuses': 'الحافلات النشطة حالياً',
    'dashboard.todayPickups': 'رحلات اليوم المكتملة',
    'dashboard.totalRevenue': 'إجمالي الإيرادات الشهرية',
    
    // Tracking
    'tracking.title': 'نظام التتبع المباشر للحافلات',
    'tracking.subtitle': 'مراقبة الموقع الحقيقي لجميع الحافلات المدرسية لحظة بلحظة',
    'tracking.busStatus': 'حالة الحافلة الحالية',
    'tracking.onRoute': 'في المسار المحدد',
    'tracking.delayed': 'متأخرة عن الموعد',
    'tracking.arrived': 'وصلت للوجهة',
    
    // Students
    'students.title': 'نظام إدارة الطلاب الشامل',
    'students.addStudent': 'إضافة طالب جديد',
    'students.name': 'الاسم الكامل',
    'students.grade': 'الصف الدراسي',
    'students.bus': 'رقم الحافلة المخصصة',
    'students.status': 'الحالة الحالية',
    
    // Common
    'common.loading': 'جاري التحميل والمعالجة...',
    'common.save': 'حفظ المعلومات',
    'common.cancel': 'إلغاء العملية',
    'common.edit': 'تعديل البيانات',
    'common.delete': 'حذف نهائي',
    'common.view': 'عرض التفاصيل',
    'common.search': 'البحث في النظام...',
    
    // Roles
    'role.parent': 'ولي الأمر',
    'role.captain': 'كابتن الحافلة',
    'role.admin': 'مدير النظام',
    
    // Additional translations
    'welcome.morning': 'صباح الخير',
    'welcome.afternoon': 'مساء الخير',
    'status.active': 'نشط',
    'status.inactive': 'غير نشط',
    'status.onboard': 'في الحافلة',
    'status.atschool': 'في المدرسة',
    'status.athome': 'في المنزل',
    'notification.pickup': 'تم استلام الطالب',
    'notification.dropoff': 'تم توصيل الطالب',
    'notification.delay': 'تأخير في الرحلة',
    'payment.paid': 'تم الدفع',
    'payment.pending': 'في انتظار الدفع',
    'payment.overdue': 'متأخر عن الدفع'
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
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Always set to Arabic and RTL
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.documentElement.className = 'arabic-text';
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    dir: 'rtl',
    translations: translations.ar
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