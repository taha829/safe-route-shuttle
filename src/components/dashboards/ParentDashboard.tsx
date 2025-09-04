import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/contexts/LanguageContext';
import { 
  Users, 
  Bus, 
  MapPin, 
  Clock, 
  CreditCard, 
  Bell,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Plus,
  Settings,
  Activity,
  TestTube,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-bus.jpg';
import trackingImage from '@/assets/tracking-map.jpg';
import StudentsManagement from '@/components/parent/StudentsManagement';
import LiveBusTracking from '@/components/tracking/LiveBusTracking';

const ParentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMode, setDemoMode] = useState(true);
  const [realTimeStats, setRealTimeStats] = useState({
    totalStudents: 0,
    activeBuses: 0,
    todayPickups: 0,
    paymentStatus: 'تم الدفع'
  });
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);

  const loadRealTimeData = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // تحميل إحصائيات الطلاب
      const { data: studentsData } = await supabase
        .from('students')
        .select('id, bus_assignment:bus_students(*)')
        .eq('user_id', user.user.id);

      const totalStudents = studentsData?.length || 0;
      const activeBuses = new Set(
        studentsData
          ?.filter(s => s.bus_assignment?.[0])
          .map(s => s.bus_assignment[0].bus_id)
      ).size;

      setRealTimeStats(prev => ({
        ...prev,
        totalStudents,
        activeBuses,
        todayPickups: totalStudents * 2 // ذهاب وإياب
      }));

    } catch (error) {
      console.error('Error loading real-time data:', error);
    }
  };

  const stats = [
    {
      title: t('dashboard.totalStudents'),
      value: realTimeStats.totalStudents.toString(),
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: t('dashboard.activebuses'),
      value: realTimeStats.activeBuses.toString(),
      icon: Bus,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: t('dashboard.todayPickups'),
      value: realTimeStats.todayPickups.toString(),
      icon: Clock,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'حالة الدفع الشهري',
      value: realTimeStats.paymentStatus,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  const busUpdates = [
    {
      time: '07:45 ص',
      message: 'الحافلة رقم 12 تقترب من نقطة الاستلام',
      type: 'info',
      icon: Navigation
    },
    {
      time: '07:30 ص',
      message: 'أحمد ركب الحافلة رقم 12 بأمان',
      type: 'success',
      icon: CheckCircle
    },
    {
      time: '03:20 م',
      message: 'تم توصيل فاطمة بأمان إلى المنزل',
      type: 'success',
      icon: CheckCircle
    },
    {
      time: '03:15 م',
      message: 'الحافلة رقم 12 متأخرة 5 دقائق بسبب الازدحام',
      type: 'warning',
      icon: AlertTriangle
    }
  ];

  const children = [
    {
      name: 'أحمد محمد علي',
      grade: 'الصف الثامن',
      bus: 'حافلة رقم 12',
      status: 'في الحافلة',
      statusColor: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      name: 'فاطمة أحمد علي',
      grade: 'الصف الخامس',
      bus: 'حافلة رقم 12',
      status: 'في المدرسة',
      statusColor: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  useEffect(() => {
    loadRealTimeData();
    
    // إعداد الاستماع للتحديثات المباشرة
    const channel = supabase
      .channel('parent-dashboard-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bus_students'
      }, () => {
        loadRealTimeData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero/80" />
        <div className="relative p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {t('dashboard.welcome')} 👋
          </h1>
          <p className="text-lg opacity-90">
            تابع رحلة أطفالك الآمنة من وإلى المدرسة بكل سهولة وطمأنينة
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              variant="glass" 
              size="lg"
              onClick={() => setActiveTab('tracking')}
            >
              <MapPin className="w-5 h-5" />
              {t('nav.tracking')}
            </Button>
            <Button 
              variant="glass" 
              size="lg"
              onClick={() => setActiveTab('students')}
            >
              <Plus className="w-5 h-5" />
              إدارة الطلاب
            </Button>
            <Button variant="glass" size="lg">
              <Bell className="w-5 h-5" />
              التنبيهات والإشعارات
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Mode Card */}
      {demoMode && (
        <Card className="shadow-card-custom border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TestTube className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">الوضع التجريبي</h3>
                  <p className="text-sm text-muted-foreground">جرب جميع الميزات مجاناً</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDemoMode(false)}
              >
                إنهاء التجربة
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>تتبع مباشر للحافلات والطلاب</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>إشعارات فورية لحالة الأطفال</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>إدارة متعددة للطلاب</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>تحديث المسارات تلقائياً</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">
                  اشترك الآن واحصل على 30 يوم مجاناً
                </span>
              </div>
            </div>

            <Button variant="default" className="w-full mt-4">
              <CreditCard className="w-4 h-4" />
              ابدأ الاشتراك المجاني
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card-custom hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* الأقسام الرئيسية */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Activity className="w-4 h-4" />
            <span>نظرة عامة</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Users className="w-4 h-4" />
            <span>إدارة الطلاب</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center space-x-2 rtl:space-x-reverse">
            <MapPin className="w-4 h-4" />
            <span>التتبع المباشر</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Bell className="w-4 h-4" />
            <span>الإشعارات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Tracking */}
            <Card className="shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{t('tracking.title')}</span>
                </CardTitle>
                <CardDescription>
                  {t('tracking.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={trackingImage} 
                    alt="Bus tracking map" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/90 dark:bg-black/90 px-3 py-2 rounded-lg">
                      <div className="w-3 h-3 bg-success rounded-full animate-tracking" />
                      <span className="text-sm font-medium">{t('tracking.onRoute')}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="tracking" 
                  className="w-full"
                  onClick={() => setActiveTab('tracking')}
                >
                  <Navigation className="w-4 h-4" />
                  عرض الخريطة كاملة
                </Button>
              </CardContent>
            </Card>

            {/* Children Status */}
            <Card className="shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="w-5 h-5 text-success" />
                  <span>أطفالي</span>
                </CardTitle>
                <CardDescription>
                  الحالة الحالية والموقع المباشر
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {children.map((child, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{child.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {child.grade} • {child.bus}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${child.bgColor} ${child.statusColor}`}>
                      {child.status}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="parent" 
                  className="w-full mt-4"
                  onClick={() => setActiveTab('students')}
                >
                  <Users className="w-4 h-4" />
                  إدارة بيانات الأطفال
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Updates */}
          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Bell className="w-5 h-5 text-warning" />
                <span>آخر التحديثات والإشعارات</span>
              </CardTitle>
              <CardDescription>
                أحدث الإشعارات حول رحلة أطفالك اليومية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {busUpdates.map((update, index) => {
                  const Icon = update.icon;
                  return (
                    <div 
                      key={index}
                      className="flex items-start space-x-3 rtl:space-x-reverse p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className={`p-2 rounded-lg ${
                        update.type === 'success' 
                          ? 'bg-success/10 text-success' 
                          : update.type === 'warning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {update.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {update.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <StudentsManagement />
        </TabsContent>

        <TabsContent value="tracking">
          <LiveBusTracking />
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle>مركز الإشعارات</CardTitle>
              <CardDescription>
                إدارة جميع الإشعارات والتنبيهات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {busUpdates.map((update, index) => {
                  const Icon = update.icon;
                  return (
                    <div 
                      key={index}
                      className="flex items-start space-x-3 rtl:space-x-reverse p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${
                        update.type === 'success' 
                          ? 'bg-success/10 text-success' 
                          : update.type === 'warning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {update.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {update.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;