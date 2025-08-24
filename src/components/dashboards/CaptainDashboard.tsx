import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { 
  Users, 
  Route, 
  Clock, 
  CheckCircle, 
  MapPin,
  AlertTriangle,
  Navigation,
  UserCheck,
  Bus,
  Calendar
} from 'lucide-react';
import captainImage from '@/assets/bus-captain.jpg';

const CaptainDashboard: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: 'عدد الطلاب المخصصين',
      value: '24',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'مسافة المسار الكلية',
      value: '15.2 كم',
      icon: Route,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'استلام طلاب اليوم',
      value: '22/24',
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'الوقت المتوقع للرحلة',
      value: '45 دقيقة',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const todaySchedule = [
    {
      time: '07:00 ص',
      location: 'حي النور الشمالي',
      students: 6,
      status: 'completed',
      type: 'pickup'
    },
    {
      time: '07:15 ص',
      location: 'شارع الأزهر الرئيسي',
      students: 4,
      status: 'completed',
      type: 'pickup'
    },
    {
      time: '07:30 ص',
      location: 'مركز المدينة التجاري',
      students: 8,
      status: 'current',
      type: 'pickup'
    },
    {
      time: '07:45 ص',
      location: 'الوادي الأخضر السكني',
      students: 6,
      status: 'upcoming',
      type: 'pickup'
    }
  ];

  const recentStudents = [
    {
      name: 'أحمد حسن محمود',
      grade: 'الصف الثامن',
      time: '07:42 ص',
      status: 'boarded',
      location: 'شارع النور'
    },
    {
      name: 'فاطمة الزهراء أحمد',
      grade: 'الصف السادس',
      time: '07:40 ص',
      status: 'boarded',
      location: 'شارع النور'
    },
    {
      name: 'عمر عبد الله سالم',
      grade: 'الصف السابع',
      time: '07:38 ص',
      status: 'boarded',
      location: 'شارع النور'
    },
    {
      name: 'مريم سعيد علي',
      grade: 'الصف الخامس',
      time: '07:35 ص',
      status: 'boarded',
      location: 'شارع الأزهر'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${captainImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-secondary/80" />
        <div className="relative p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            صباح الخير أيها الكابتن! 🚌
          </h1>
          <p className="text-lg opacity-90">
            مستعد لضمان النقل الآمن لـ 24 طالباً اليوم بإذن الله
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="glass" size="lg">
              <Navigation className="w-5 h-5" />
              بدء المسار اليومي
            </Button>
            <Button variant="glass" size="lg">
              <UserCheck className="w-5 h-5" />
              تسجيل الحضور
            </Button>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Route Schedule */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar className="w-5 h-5 text-secondary" />
              <span>جدول اليوم المفصل</span>
            </CardTitle>
            <CardDescription>
              نقاط الاستلام والأوقات المتوقعة للوصول
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.map((stop, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
                  stop.status === 'current' 
                    ? 'border-warning bg-warning/10 shadow-md' 
                    : stop.status === 'completed'
                    ? 'border-success bg-success/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    stop.status === 'current' 
                      ? 'bg-warning text-warning-foreground animate-tracking' 
                      : stop.status === 'completed'
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {stop.status === 'completed' 
                      ? <CheckCircle className="w-4 h-4" />
                      : stop.status === 'current'
                      ? <MapPin className="w-4 h-4" />
                      : <Clock className="w-4 h-4" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{stop.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {stop.time} • {stop.students} طالب
                    </p>
                  </div>
                </div>
                {stop.status === 'current' && (
                  <Button variant="captain" size="sm">
                    <UserCheck className="w-4 h-4" />
                    تم الإنجاز
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Student Activity */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-5 h-5 text-primary" />
              <span>النشاط الأخير للطلاب</span>
            </CardTitle>
            <CardDescription>
              آخر عمليات الاستلام والتوصيل للطلاب
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentStudents.map((student, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.grade} • {student.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    تم الصعود
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {student.time}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="captain" className="w-full mt-4">
              <Users className="w-4 h-4" />
              عرض جميع الطلاب
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Bus className="w-5 h-5 text-warning" />
            <span>الإجراءات السريعة</span>
          </CardTitle>
          <CardDescription>
            المهام الشائعة لكابتن الحافلة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="captain" className="h-16 flex-col space-y-2">
              <AlertTriangle className="w-6 h-6" />
              <span>إبلاغ عن تأخير</span>
            </Button>
            <Button variant="tracking" className="h-16 flex-col space-y-2">
              <Navigation className="w-6 h-6" />
              <span>تحديث الموقع</span>
            </Button>
            <Button variant="parent" className="h-16 flex-col space-y-2">
              <UserCheck className="w-6 h-6" />
              <span>اتصال طوارئ</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaptainDashboard;