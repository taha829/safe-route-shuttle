import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navigation from '@/components/Navigation';
import ParentDashboard from '@/components/dashboards/ParentDashboard';
import CaptainDashboard from '@/components/dashboards/CaptainDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import SchoolNewsFeed from '@/pages/SchoolNewsFeed';
import SchoolDashboard from '@/components/dashboards/SchoolDashboard';
import LiveTracking from '@/pages/LiveTracking';

const Index = () => {
  const [currentRole, setCurrentRole] = useState<'parent' | 'captain' | 'school' | 'admin'>('parent');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderDashboard = () => {
    switch (currentRole) {
      case 'parent':
        return <ParentDashboard />;
      case 'captain':
        return <CaptainDashboard />;
      case 'school':
        return <SchoolDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ParentDashboard />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background">
          <Navigation
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          
          <main className="transition-all duration-300">
            {currentPage === 'dashboard' ? (
              renderDashboard()
            ) : currentPage === 'news' ? (
              <SchoolNewsFeed />
            ) : currentPage === 'tracking' ? (
              <LiveTracking />
            ) : (
              <div className="p-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    صفحة {currentPage === 'tracking' ? 'تتبع الحافلات' :
                            currentPage === 'students' ? 'إدارة الطلاب' :
                            currentPage === 'payments' ? 'نظام المدفوعات' :
                            currentPage === 'routes' ? 'إدارة المسارات' :
                            currentPage === 'news' ? 'آخر الأخبار' :
                            currentPage === 'reports' ? 'التقارير والإحصائيات' :
                            currentPage === 'settings' ? 'الإعدادات العامة' : currentPage}
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    هذه الصفحة قيد التطوير حالياً. ستكون متاحة قريباً بإذن الله
                  </p>
                  <div className="glass-card p-8 rounded-2xl">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      الميزات القادمة قريباً:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      {currentPage === 'tracking' && (
                        <>
                          <div>• تتبع GPS المباشر والفوري</div>
                          <div>• تحسين المسارات تلقائياً</div>
                          <div>• توقع أوقات الوصول الدقيقة</div>
                          <div>• تنبيهات الحدود الجغرافية</div>
                        </>
                      )}
                      {currentPage === 'students' && (
                        <>
                          <div>• إدارة شاملة للطلاب</div>
                          <div>• تتبع الحضور والغياب</div>
                          <div>• معلومات الاتصال بأولياء الأمور</div>
                          <div>• المعلومات الطبية والصحية</div>
                        </>
                      )}
                      {currentPage === 'payments' && (
                        <>
                          <div>• معالجة المدفوعات الإلكترونية</div>
                          <div>• إدارة الاشتراكات الشهرية</div>
                          <div>• إنشاء الإيصالات التلقائية</div>
                          <div>• سجل المدفوعات التفصيلي</div>
                        </>
                      )}
                      {currentPage === 'routes' && (
                        <>
                          <div>• تخطيط المسارات الذكية</div>
                          <div>• تحسين نقاط التوقف</div>
                          <div>• التكامل مع بيانات المرور</div>
                          <div>• إدارة الجداول الزمنية</div>
                        </>
                      )}
                      {currentPage === 'reports' && (
                        <>
                          <div>• لوحة التحليلات المتقدمة</div>
                          <div>• تقارير مخصصة ومفصلة</div>
                          <div>• تصدير البيانات بصيغ متعددة</div>
                          <div>• مقاييس الأداء الشاملة</div>
                        </>
                      )}
                      {currentPage === 'settings' && (
                        <>
                          <div>• إعدادات النظام الأساسية</div>
                          <div>• تفضيلات المستخدم الشخصية</div>
                          <div>• إعدادات الإشعارات والتنبيهات</div>
                          <div>• خيارات الأمان والحماية</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
