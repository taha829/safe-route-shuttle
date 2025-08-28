import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/contexts/LanguageContext';
import { 
  MapPin, 
  Bus, 
  Clock, 
  Users,
  Navigation,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Phone,
  MessageSquare
} from 'lucide-react';
import trackingImage from '@/assets/tracking-map.jpg';

const LiveTracking: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBus, setSelectedBus] = useState<string>('bus-01');
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const buses = [
    {
      id: 'bus-01',
      name: 'الحافلة الأولى',
      route: 'المسار الشمالي',
      driver: 'أحمد محمد علي',
      phone: '050-123-4567',
      currentLocation: 'شارع الملك فهد - تقاطع التحلية',
      speed: '35 كم/س',
      students: 28,
      capacity: 35,
      eta: '15 دقيقة',
      status: 'on-route',
      nextStop: 'مدرسة النور الابتدائية',
      batteryLevel: 87,
      lastUpdate: 'منذ 30 ثانية'
    },
    {
      id: 'bus-02', 
      name: 'الحافلة الثانية',
      route: 'المسار الجنوبي',
      driver: 'سارة أحمد حسن',
      phone: '050-234-5678',
      currentLocation: 'حي الواحة - شارع الأمير سلطان',
      speed: '42 كم/س',
      students: 32,
      capacity: 40,
      eta: '8 دقائق',
      status: 'on-route',
      nextStop: 'مجمع الأندلس التعليمي',
      batteryLevel: 92,
      lastUpdate: 'منذ 15 ثانية'
    },
    {
      id: 'bus-03',
      name: 'الحافلة الثالثة', 
      route: 'المسار الشرقي',
      driver: 'محمد عبد الله',
      phone: '050-345-6789',
      currentLocation: 'حي الروضة - طريق الدمام',
      speed: '0 كم/س',
      students: 25,
      capacity: 35,
      eta: 'متوقفة',
      status: 'stopped',
      nextStop: 'مدارس الرواد الأهلية',
      batteryLevel: 45,
      lastUpdate: 'منذ دقيقتين'
    }
  ];

  const currentBus = buses.find(bus => bus.id === selectedBus) || buses[0];

  useEffect(() => {
    if (isLiveTracking) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000); // تحديث كل 30 ثانية

      return () => clearInterval(interval);
    }
  }, [isLiveTracking]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-route':
        return 'text-success';
      case 'stopped':
        return 'text-warning';
      case 'delayed':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-route':
        return <CheckCircle className="w-4 h-4" />;
      case 'stopped':
        return <AlertTriangle className="w-4 h-4" />;
      case 'delayed':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bus className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-route':
        return 'في المسار';
      case 'stopped':
        return 'متوقفة';
      case 'delayed':
        return 'متأخرة';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-bus">
        <h1 className="text-3xl font-bold mb-2">
          {t('gps.title')} 📍
        </h1>
        <p className="text-lg opacity-90 mb-6">
          {t('gps.realTime')} للحافلات المدرسية مع تحديثات لحظية دقيقة
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="glass" 
            size="lg"
            onClick={() => setIsLiveTracking(!isLiveTracking)}
          >
            <RefreshCw className={`w-5 h-5 ${isLiveTracking ? 'animate-spin' : ''}`} />
            {isLiveTracking ? 'إيقاف التتبع المباشر' : 'تفعيل التتبع المباشر'}
          </Button>
          <Button variant="glass" size="lg">
            <Navigation className="w-5 h-5" />
            عرض جميع المسارات
          </Button>
          <Button variant="glass" size="lg">
            <MessageSquare className="w-5 h-5" />
            إرسال رسالة للسائق
          </Button>
        </div>
      </div>

      {/* Bus Selection */}
      <Card className="shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Bus className="w-5 h-5 text-primary" />
            <span>اختيار الحافلة للتتبع</span>
          </CardTitle>
          <CardDescription>
            اختر الحافلة التي تريد تتبعها والمراقبة المباشرة لموقعها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBus} onValueChange={setSelectedBus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر حافلة للتتبع" />
            </SelectTrigger>
            <SelectContent>
              {buses.map((bus) => (
                <SelectItem key={bus.id} value={bus.id}>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Bus className="w-4 h-4" />
                    <span>{bus.name} - {bus.route}</span>
                    <span className={`text-xs ${getStatusColor(bus.status)}`}>
                      ({getStatusText(bus.status)})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <Card className="lg:col-span-2 shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{t('gps.busLocation')}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className={`w-3 h-3 rounded-full ${isLiveTracking ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                <span className="text-sm text-muted-foreground">
                  {isLiveTracking ? 'مباشر' : 'متوقف'}
                </span>
              </div>
            </CardTitle>
            <CardDescription>
              الموقع الحالي: {currentBus.currentLocation}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={trackingImage} 
                alt="Live GPS tracking map" 
                className="w-full h-96 object-cover"
              />
              
              {/* Live indicators on map */}
              <div className="absolute top-4 left-4 space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/95 dark:bg-black/95 px-3 py-2 rounded-lg shadow-md">
                  <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
                  <span className="text-sm font-medium">{currentBus.name}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/95 dark:bg-black/95 px-3 py-2 rounded-lg shadow-md">
                  <Navigation className="w-4 h-4 text-secondary" />
                  <span className="text-sm">السرعة: {currentBus.speed}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/95 dark:bg-black/95 px-3 py-2 rounded-lg shadow-md">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-sm">الوصول: {currentBus.eta}</span>
                </div>
              </div>

              {/* Bus position marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Bus className="w-5 h-5 text-white" />
                </div>
                <div className="w-16 h-16 border-2 border-primary/30 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
              </div>

              {/* Next stop indicator */}
              <div className="absolute bottom-4 right-4">
                <div className="bg-success/90 text-white px-3 py-2 rounded-lg shadow-md">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">المحطة التالية</span>
                  </div>
                  <p className="text-xs mt-1">{currentBus.nextStop}</p>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4" />
                  توسيط الخريطة
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4" />
                  عرض المسار الكامل
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                آخر تحديث: {currentBus.lastUpdate}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bus Details */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Bus className="w-5 h-5 text-primary" />
              <span>تفاصيل الحافلة</span>
            </CardTitle>
            <CardDescription>
              المعلومات الحالية والإحصائيات المباشرة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="p-3 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">الحالة الحالية</span>
                <div className={`flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor(currentBus.status)}`}>
                  {getStatusIcon(currentBus.status)}
                  <span className="text-sm font-medium">{getStatusText(currentBus.status)}</span>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-medium text-foreground mb-2">معلومات السائق</h4>
              <div className="space-y-1">
                <p className="text-sm text-foreground">👨‍✈️ {currentBus.driver}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-4 h-4" />
                  اتصال: {currentBus.phone}
                </Button>
              </div>
            </div>

            {/* Location & Speed */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-3 rounded-lg border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">الموقع الحالي</p>
                  <p className="text-sm font-medium text-foreground">{currentBus.currentLocation}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse p-3 rounded-lg border border-border">
                <Zap className="w-4 h-4 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('gps.speed')}</p>
                  <p className="text-sm font-medium text-foreground">{currentBus.speed}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse p-3 rounded-lg border border-border">
                <Clock className="w-4 h-4 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('gps.eta')}</p>
                  <p className="text-sm font-medium text-foreground">{currentBus.eta}</p>
                </div>
              </div>
            </div>

            {/* Students Count */}
            <div className="p-3 rounded-lg bg-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">عدد الطلاب</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {currentBus.students}/{currentBus.capacity}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(currentBus.students / currentBus.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Battery Level */}
            <div className="p-3 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">مستوى البطارية</span>
                <span className="text-sm font-bold text-foreground">{currentBus.batteryLevel}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentBus.batteryLevel > 50 ? 'bg-success' : 
                    currentBus.batteryLevel > 20 ? 'bg-warning' : 'bg-destructive'
                  }`}
                  style={{ width: `${currentBus.batteryLevel}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4" />
                إرسال رسالة للسائق
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4" />
                اتصال بالسائق
              </Button>
              <Button variant="outline" className="w-full">
                <AlertTriangle className="w-4 h-4" />
                إبلاغ عن مشكلة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Buses Overview */}
      <Card className="shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Navigation className="w-5 h-5 text-primary" />
            <span>نظرة عامة على جميع الحافلات</span>
          </CardTitle>
          <CardDescription>
            حالة جميع حافلات النقل المدرسي في الوقت الفعلي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map((bus) => (
              <div 
                key={bus.id}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-md ${
                  selectedBus === bus.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setSelectedBus(bus.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{bus.name}</h4>
                  <div className={`flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor(bus.status)}`}>
                    {getStatusIcon(bus.status)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{bus.route}</p>
                <p className="text-sm text-foreground mb-2">{bus.driver}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{bus.students}/{bus.capacity} طالب</span>
                  <span>{bus.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTracking;