import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Users, 
  AlertTriangle,
  Battery,
  Gauge,
  Route,
  Phone,
  MessageSquare,
  PlayCircle,
  StopCircle
} from 'lucide-react';

interface BusData {
  id: string;
  busNumber: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'inactive' | 'maintenance' | 'emergency';
  speed: number;
  batteryLevel: number;
  studentsCount: number;
  eta: string;
  nextStop: string;
  routeProgress: number;
}

interface LiveBusTrackingProps {
  busId?: string;
}

const LiveBusTracking: React.FC<LiveBusTrackingProps> = ({ busId }) => {
  const [busData, setBusData] = useState<BusData>({
    id: '1',
    busNumber: '101',
    currentLocation: { lat: 24.7136, lng: 46.6753 },
    status: 'active',
    speed: 35,
    batteryLevel: 85,
    studentsCount: 22,
    eta: '15 دقيقة',
    nextStop: 'مركز المدينة التجاري',
    routeProgress: 65
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(updateBusLocation, 30000); // تحديث كل 30 ثانية
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const updateBusLocation = async () => {
    // محاكاة تحديث موقع الحافلة
    setBusData(prev => ({
      ...prev,
      speed: 30 + Math.random() * 20,
      batteryLevel: Math.max(20, prev.batteryLevel - Math.random() * 2),
      routeProgress: Math.min(100, prev.routeProgress + Math.random() * 5)
    }));
  };

  const startTrip = async () => {
    try {
      const { data, error } = await supabase
        .from('bus_trips')
        .insert({
          bus_id: busData.id,
          trip_type: 'morning',
          status: 'active',
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentTrip(data);
      setIsTracking(true);
      
      toast({
        title: "تم بدء الرحلة",
        description: "تم تسجيل بداية الرحلة بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const endTrip = async () => {
    try {
      if (currentTrip) {
        const { error } = await supabase
          .from('bus_trips')
          .update({
            status: 'completed',
            end_time: new Date().toISOString()
          })
          .eq('id', (currentTrip as any).id);

        if (error) throw error;
      }

      setIsTracking(false);
      setCurrentTrip(null);
      
      toast({
        title: "تم إنهاء الرحلة",
        description: "تم تسجيل نهاية الرحلة بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const reportEmergency = () => {
    toast({
      title: "تم إرسال إنذار الطوارئ",
      description: "تم إشعار المدرسة والسلطات المختصة",
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'maintenance': return 'bg-warning text-warning-foreground';
      case 'emergency': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'maintenance': return 'صيانة';
      case 'emergency': return 'طوارئ';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* معلومات الحافلة الرئيسية */}
      <Card className="lg:col-span-2 shadow-card-custom">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Navigation className="w-5 h-5 text-primary" />
              <CardTitle>حافلة رقم {busData.busNumber}</CardTitle>
            </div>
            <Badge className={getStatusColor(busData.status)}>
              {getStatusText(busData.status)}
            </Badge>
          </div>
          <CardDescription>
            التتبع المباشر والتحكم في الرحلة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* معلومات الرحلة الحالية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Gauge className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{busData.speed}</div>
              <div className="text-sm text-muted-foreground">كم/ساعة</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <div className="text-2xl font-bold text-foreground">{busData.studentsCount}</div>
              <div className="text-sm text-muted-foreground">طالب</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-foreground">{busData.eta}</div>
              <div className="text-sm text-muted-foreground">الوصول المتوقع</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Battery className="w-6 h-6 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-foreground">{busData.batteryLevel}%</div>
              <div className="text-sm text-muted-foreground">البطارية</div>
            </div>
          </div>

          {/* تقدم المسار */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">تقدم المسار</span>
              <span className="text-sm text-muted-foreground">{busData.routeProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-primary h-3 rounded-full transition-all duration-1000"
                style={{ width: `${busData.routeProgress}%` }}
              />
            </div>
          </div>

          {/* المحطة التالية */}
          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">المحطة التالية</span>
            </div>
            <p className="text-lg font-semibold text-primary">{busData.nextStop}</p>
            <p className="text-sm text-muted-foreground">الوصول خلال {busData.eta}</p>
          </div>

          {/* أزرار التحكم */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {!isTracking ? (
              <Button 
                variant="captain" 
                onClick={startTrip}
                className="flex-col h-16"
              >
                <PlayCircle className="w-5 h-5 mb-1" />
                <span className="text-xs">بدء الرحلة</span>
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                onClick={endTrip}
                className="flex-col h-16"
              >
                <StopCircle className="w-5 h-5 mb-1" />
                <span className="text-xs">إنهاء الرحلة</span>
              </Button>
            )}
            
            <Button variant="tracking" className="flex-col h-16">
              <Route className="w-5 h-5 mb-1" />
              <span className="text-xs">تحديث المسار</span>
            </Button>
            
            <Button variant="parent" className="flex-col h-16">
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-xs">رسائل الأهل</span>
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={reportEmergency}
              className="flex-col h-16"
            >
              <AlertTriangle className="w-5 h-5 mb-1" />
              <span className="text-xs">طوارئ</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* الإحصائيات والتفاصيل */}
      <div className="space-y-6">
        {/* حالة التتبع */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="text-lg">حالة التتبع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">GPS</span>
                <Badge variant="secondary">متصل</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">الإنترنت</span>
                <Badge variant="secondary">مستقر</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">آخر تحديث</span>
                <span className="text-xs text-muted-foreground">منذ 30 ثانية</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* اتصال سريع */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="text-lg">اتصال سريع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="w-4 h-4" />
              إدارة المدرسة
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4" />
              الدعم الفني
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4" />
              الطوارئ 911
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveBusTracking;