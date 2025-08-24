import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { 
  Users, 
  Bus, 
  DollarSign, 
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Settings,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import trackingImage from '@/assets/tracking-map.jpg';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.totalStudents'),
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: t('dashboard.activebuses'),
      value: '45',
      change: '+3',
      icon: Bus,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: t('dashboard.totalRevenue'),
      value: '89,247 ريال',
      change: '+8.2%',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'كفاءة النظام العامة',
      value: '96.3%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      message: 'الحافلة رقم 12 أبلغت عن عطل ميكانيكي',
      type: 'warning',
      time: 'منذ دقيقتين',
      priority: 'high'
    },
    {
      id: 2,
      message: 'تسجيل طالب جديد: أحمد محمد علي',
      type: 'info',
      time: 'منذ 15 دقيقة',
      priority: 'medium'
    },
    {
      id: 3,
      message: 'تم الانتهاء من تحسين المسار للمنطقة الثالثة',
      type: 'success',
      time: 'منذ ساعة واحدة',
      priority: 'low'
    },
    {
      id: 4,
      message: 'دفعة متأخرة: مدرسة النور الدولية',
      type: 'warning',
      time: 'منذ 3 ساعات',
      priority: 'high'
    }
  ];

  const busStatus = [
    { id: 'حافلة رقم 01', status: 'active', students: 28, route: 'المنطقة الشمالية', driver: 'أحمد حسن محمود' },
    { id: 'حافلة رقم 12', status: 'maintenance', students: 0, route: 'وسط المدينة', driver: 'عمر عبد الله سالم' },
    { id: 'حافلة رقم 07', status: 'active', students: 32, route: 'المنطقة الجنوبية', driver: 'فاطمة الزهراء أحمد' },
    { id: 'حافلة رقم 19', status: 'active', students: 24, route: 'المنطقة الشرقية', driver: 'مريم سعيد علي' },
    { id: 'حافلة رقم 23', status: 'inactive', students: 0, route: 'المنطقة الغربية', driver: 'حسن علي محمد' }
  ];

  const recentTransactions = [
    { school: 'مدرسة النور الدولية', amount: '2,450 ريال', status: 'paid', date: '2024-01-15' },
    { school: 'أكاديمية الوادي الأخضر', amount: '1,890 ريال', status: 'pending', date: '2024-01-14' },
    { school: 'مدرسة قادة المستقبل', amount: '3,200 ريال', status: 'paid', date: '2024-01-13' },
    { school: 'معهد العقول المشرقة', amount: '1,650 ريال', status: 'overdue', date: '2024-01-10' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-bus">
        <h1 className="text-3xl font-bold mb-2">
          نظرة عامة شاملة على النظام 📊
        </h1>
        <p className="text-lg opacity-90 mb-6">
          لوحة التحكم الكاملة لنظام الطريق الآمن لوسائل النقل المدرسي
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="glass" size="lg">
            <PlusCircle className="w-5 h-5" />
            إضافة مدرسة جديدة
          </Button>
          <Button variant="glass" size="lg">
            <Bus className="w-5 h-5" />
            إدارة الأسطول
          </Button>
          <Button variant="glass" size="lg">
            <BarChart3 className="w-5 h-5" />
            التحليلات المفصلة
          </Button>
        </div>
      </div>

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
                    <p className="text-xs text-success font-medium mt-1">
                      {stat.change} من الشهر الماضي
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Overview Map */}
        <Card className="lg:col-span-2 shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <MapPin className="w-5 h-5 text-primary" />
              <span>نظرة عامة على الأسطول</span>
            </CardTitle>
            <CardDescription>
              تتبع مباشر لجميع الحافلات النشطة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={trackingImage} 
                alt="Fleet tracking overview" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4 space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/90 dark:bg-black/90 px-3 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-success rounded-full animate-tracking" />
                  <span className="text-sm font-medium">42 حافلة نشطة</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/90 dark:bg-black/90 px-3 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-warning rounded-full" />
                  <span className="text-sm font-medium">3 في الصيانة</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {busStatus.map((bus, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      bus.status === 'active' 
                        ? 'bg-success text-success-foreground' 
                        : bus.status === 'maintenance'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{bus.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {bus.route} • {bus.driver}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {bus.students} طالب
                    </p>
                    <p className={`text-xs capitalize ${
                      bus.status === 'active' ? 'text-success' : 
                      bus.status === 'maintenance' ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {bus.status === 'active' ? 'نشطة' : 
                       bus.status === 'maintenance' ? 'صيانة' : 'غير نشطة'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>تنبيهات النظام</span>
            </CardTitle>
            <CardDescription>
              الإشعارات والمشاكل الأخيرة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' 
                    ? 'border-warning bg-warning/10' 
                    : alert.type === 'success'
                    ? 'border-success bg-success/10'
                    : 'border-secondary bg-secondary/10'
                } ${alert.priority === 'high' ? 'shadow-md' : ''}`}
              >
                <p className="text-sm font-medium text-foreground">
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.time}
                </p>
              </div>
            ))}
            <Button variant="admin" className="w-full">
              <AlertTriangle className="w-4 h-4" />
              عرض جميع التنبيهات
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card className="shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <DollarSign className="w-5 h-5 text-success" />
            <span>النظرة المالية الشاملة</span>
          </CardTitle>
          <CardDescription>
            المعاملات الأخيرة وحالة المدفوعات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right p-3 font-medium text-muted-foreground">المدرسة</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">المبلغ</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium text-foreground">{transaction.school}</td>
                    <td className="p-3 text-foreground">{transaction.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'paid' 
                          ? 'bg-success/10 text-success' 
                          : transaction.status === 'pending'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {transaction.status === 'paid' ? 'مدفوع' : 
                         transaction.status === 'pending' ? 'في الانتظار' : 'متأخر'}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              عرض 4 من أصل 156 معاملة مالية
            </p>
            <Button variant="admin">
              <FileText className="w-4 h-4" />
              إنشاء تقرير مفصل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;