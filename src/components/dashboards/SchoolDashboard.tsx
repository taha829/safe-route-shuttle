import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Bus, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Calendar,
  FileText,
  Settings,
  PlusCircle,
  BookOpen,
  MessageSquare,
  Activity
} from 'lucide-react';
import trackingImage from '@/assets/tracking-map.jpg';

const SchoolDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'إجمالي الطلاب المسجلين',
      value: '458',
      change: '+23',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'الحافلات المدرسية',
      value: '12',
      change: '+2',
      icon: Bus,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'الإيرادات الشهرية',
      value: '34,567 ريال',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'معدل الحضور',
      value: '94.8%',
      change: '+1.2%',
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const schoolRoutes = [
    { id: 'المسار الأول', busNumber: 'حافلة 01', students: 38, driver: 'أحمد محمد علي', status: 'active' },
    { id: 'المسار الثاني', busNumber: 'حافلة 02', students: 42, driver: 'سارة أحمد حسن', status: 'active' },
    { id: 'المسار الثالث', busNumber: 'حافلة 03', students: 35, driver: 'محمد عبد الله', status: 'maintenance' },
    { id: 'المسار الرابع', busNumber: 'حافلة 04', students: 40, driver: 'فاطمة الزهراء', status: 'active' }
  ];

  const recentPosts = [
    {
      id: 1,
      type: 'announcement',
      title: 'إعلان هام عن موعد الامتحانات النهائية',
      content: 'نعلن لجميع أولياء الأمور والطلاب عن موعد بدء الامتحانات النهائية...',
      date: 'منذ ساعتين',
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      type: 'lesson',
      title: 'درس الرياضيات - الهندسة التحليلية',
      content: 'شرح مفصل لدرس الهندسة التحليلية للصف الثالث الثانوي',
      date: 'منذ 4 ساعات',
      likes: 18,
      comments: 12
    },
    {
      id: 3,
      type: 'event',
      title: 'فعالية اليوم الرياضي المدرسي',
      content: 'ندعو جميع الطلاب للمشاركة في فعالية اليوم الرياضي...',
      date: 'أمس',
      likes: 42,
      comments: 15
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-bus">
        <h1 className="text-3xl font-bold mb-2">
          {t('school.title')} 🏫
        </h1>
        <p className="text-lg opacity-90 mb-6">
          لوحة تحكم شاملة لإدارة جميع أنشطة المدرسة والتواصل مع أولياء الأمور
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="glass" size="lg" onClick={() => navigate('/school-news')}>
            <PlusCircle className="w-5 h-5" />
            إنشاء منشور جديد
          </Button>
          <Button variant="glass" size="lg" onClick={() => navigate('/student-registration')}>
            <Users className="w-5 h-5" />
            إدارة الطلاب
          </Button>
          <Button variant="glass" size="lg" onClick={() => navigate('/captain-dashboard')}>
            <Bus className="w-5 h-5" />
            إدارة الحافلات
          </Button>
          <Button variant="glass" size="lg">
            <FileText className="w-5 h-5" />
            التقارير المالية
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
        {/* School Bus Routes */}
        <Card className="lg:col-span-2 shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Bus className="w-5 h-5 text-primary" />
              <span>مسارات الحافلات المدرسية</span>
            </CardTitle>
            <CardDescription>
              إدارة ومراقبة جميع مسارات النقل المدرسي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={trackingImage} 
                alt="School bus routes" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4 space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/90 dark:bg-black/90 px-3 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-success rounded-full animate-tracking" />
                  <span className="text-sm font-medium">11 حافلة نشطة</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/90 dark:bg-black/90 px-3 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-warning rounded-full" />
                  <span className="text-sm font-medium">1 في الصيانة</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {schoolRoutes.map((route, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      route.status === 'active' 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-warning text-warning-foreground'
                    }`}>
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{route.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {route.busNumber} • {route.driver}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {route.students} طالب
                    </p>
                    <p className={`text-xs capitalize ${
                      route.status === 'active' ? 'text-success' : 'text-warning'
                    }`}>
                      {route.status === 'active' ? 'نشطة' : 'صيانة'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent School Posts */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span>المنشورات الأخيرة</span>
            </CardTitle>
            <CardDescription>
              آخر المنشورات والإعلانات المدرسية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.map((post) => (
              <div 
                key={post.id}
                className="p-3 rounded-lg border border-border hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  {post.type === 'announcement' && <Activity className="w-4 h-4 text-primary" />}
                  {post.type === 'lesson' && <BookOpen className="w-4 h-4 text-secondary" />}
                  {post.type === 'event' && <Calendar className="w-4 h-4 text-warning" />}
                  <span className="text-xs font-medium text-muted-foreground">
                    {post.type === 'announcement' ? 'إعلان' : 
                     post.type === 'lesson' ? 'درس' : 'فعالية'}
                  </span>
                </div>
                <h4 className="font-medium text-foreground text-sm mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="school" className="w-full" onClick={() => navigate('/school-news')}>
              <MessageSquare className="w-4 h-4" />
              عرض جميع المنشورات
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card-custom hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/student-registration')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-1">إدارة الطلاب</h3>
            <p className="text-xs text-muted-foreground">تسجيل وإدارة بيانات الطلاب</p>
          </CardContent>
        </Card>

        <Card className="shadow-card-custom hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/captain-dashboard')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-medium text-foreground mb-1">تتبع الحافلات</h3>
            <p className="text-xs text-muted-foreground">مراقبة مباشرة للمواقع</p>
          </CardContent>
        </Card>

        <Card className="shadow-card-custom hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/school-news')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-medium text-foreground mb-1">نشر المنشورات</h3>
            <p className="text-xs text-muted-foreground">إنشاء ونشر الأخبار والإعلانات</p>
          </CardContent>
        </Card>

        <Card className="shadow-card-custom hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-medium text-foreground mb-1">التقارير المالية</h3>
            <p className="text-xs text-muted-foreground">تقارير شاملة وإحصائيات مالية</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolDashboard;