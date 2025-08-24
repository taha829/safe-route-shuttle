import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navigation from '@/components/Navigation';
import ParentDashboard from '@/components/dashboards/ParentDashboard';
import CaptainDashboard from '@/components/dashboards/CaptainDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const Index = () => {
  const [currentRole, setCurrentRole] = useState<'parent' | 'captain' | 'admin'>('parent');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderDashboard = () => {
    switch (currentRole) {
      case 'parent':
        return <ParentDashboard />;
      case 'captain':
        return <CaptainDashboard />;
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
            ) : (
              <div className="p-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    This page is under development. The {currentPage} functionality will be available soon.
                  </p>
                  <div className="glass-card p-8 rounded-2xl">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Coming Soon Features:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      {currentPage === 'tracking' && (
                        <>
                          <div>• Real-time GPS tracking</div>
                          <div>• Route optimization</div>
                          <div>• ETA predictions</div>
                          <div>• Geofencing alerts</div>
                        </>
                      )}
                      {currentPage === 'students' && (
                        <>
                          <div>• Student management</div>
                          <div>• Attendance tracking</div>
                          <div>• Parent contact info</div>
                          <div>• Medical information</div>
                        </>
                      )}
                      {currentPage === 'payments' && (
                        <>
                          <div>• Online payment processing</div>
                          <div>• Subscription management</div>
                          <div>• Receipt generation</div>
                          <div>• Payment history</div>
                        </>
                      )}
                      {currentPage === 'routes' && (
                        <>
                          <div>• Route planning</div>
                          <div>• Stop optimization</div>
                          <div>• Traffic integration</div>
                          <div>• Schedule management</div>
                        </>
                      )}
                      {currentPage === 'reports' && (
                        <>
                          <div>• Analytics dashboard</div>
                          <div>• Custom reports</div>
                          <div>• Data export</div>
                          <div>• Performance metrics</div>
                        </>
                      )}
                      {currentPage === 'settings' && (
                        <>
                          <div>• System configuration</div>
                          <div>• User preferences</div>
                          <div>• Notification settings</div>
                          <div>• Security options</div>
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
