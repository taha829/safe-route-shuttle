import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  Calendar,
  Map,
  Activity,
  Phone,
  Play,
  Square
} from 'lucide-react';
import captainImage from '@/assets/bus-captain.jpg';
import StudentsMap from '@/components/maps/StudentsMap';
import LiveBusTracking from '@/components/tracking/LiveBusTracking';

const CaptainDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [busData, setBusData] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch captain's bus and students data
  useEffect(() => {
    fetchCaptainData();
  }, []);

  const fetchCaptainData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get captain's bus
      const { data: bus, error: busError } = await supabase
        .from('buses')
        .select('*')
        .eq('captain_id', user.id)
        .single();

      if (busError) {
        console.error('Error fetching bus:', busError);
        return;
      }

      setBusData(bus);

      // Get students assigned to this bus
      const { data: busStudents, error: studentsError } = await supabase
        .from('bus_students')
        .select(`
          *,
          students!inner(
            *,
            profiles!inner(full_name),
            grades(name)
          )
        `)
        .eq('bus_id', bus.id)
        .eq('is_active', true);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        return;
      }

      setStudentsData(busStudents || []);

      // Get current trip if exists
      const { data: trip } = await supabase
        .from('bus_trips')
        .select('*')
        .eq('bus_id', bus.id)
        .eq('trip_date', new Date().toISOString().split('T')[0])
        .eq('status', 'active')
        .single();

      setCurrentTrip(trip);

    } catch (error) {
      console.error('Error fetching captain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'عدد الطلاب المخصصين',
      value: studentsData.length.toString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'حالة الحافلة',
      value: busData?.status === 'active' ? 'نشطة' : 'غير نشطة',
      icon: Bus,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'الطلاب المتواجدون',
      value: `${studentsData.filter(s => s.current_status === 'boarded').length}/${studentsData.length}`,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'حالة الرحلة',
      value: currentTrip ? 'جارية' : 'لم تبدأ',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  // Start new trip
  const startTrip = async () => {
    if (!busData) return;

    try {
      const { data, error } = await supabase
        .from('bus_trips')
        .insert({
          bus_id: busData.id,
          trip_date: new Date().toISOString().split('T')[0],
          start_time: new Date().toISOString(),
          status: 'active',
          trip_type: 'morning'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentTrip(data);
      toast({
        title: "تم بدء الرحلة بنجاح",
        description: "يمكنك الآن تسجيل حضور الطلاب",
      });
    } catch (error) {
      console.error('Error starting trip:', error);
      toast({
        title: "خطأ في بدء الرحلة",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  // End current trip
  const endTrip = async () => {
    if (!currentTrip) return;

    try {
      const { error } = await supabase
        .from('bus_trips')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', currentTrip.id);

      if (error) throw error;

      setCurrentTrip(null);
      toast({
        title: "تم إنهاء الرحلة بنجاح",
        description: "شكراً لك على النقل الآمن",
      });
    } catch (error) {
      console.error('Error ending trip:', error);
      toast({
        title: "خطأ في إنهاء الرحلة",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  // Update student status
  const updateStudentStatus = async (studentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bus_students')
        .update({ 
          current_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('student_id', studentId);

      if (error) throw error;

      // Create attendance record if trip is active
      if (currentTrip && status === 'boarded') {
        await supabase
          .from('student_attendance')
          .insert({
            trip_id: currentTrip.id,
            student_id: studentId,
            status: 'picked_up',
            pickup_time: new Date().toISOString()
          });
      }

      // Refresh data
      fetchCaptainData();
      
      toast({
        title: "تم تحديث حالة الطالب",
        description: status === 'boarded' ? "تم تسجيل صعود الطالب" : "تم تحديث الحالة",
      });
    } catch (error) {
      console.error('Error updating student status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  // Report delay
  const reportDelay = () => {
    toast({
      title: "تم إرسال تقرير التأخير",
      description: "سيتم إشعار المدرسة وأولياء الأمور",
    });
  };

  // Update location
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { error } = await supabase
            .from('buses')
            .update({
              current_location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: new Date().toISOString()
              }
            })
            .eq('id', busData?.id);

          if (error) throw error;

          toast({
            title: "تم تحديث الموقع",
            description: "الموقع الحالي محدث الآن",
          });
        } catch (error) {
          console.error('Error updating location:', error);
        }
      });
    }
  };

  // Emergency call
  const emergencyCall = () => {
    toast({
      title: "اتصال الطوارئ",
      description: "سيتم الاتصال بالرقم المحدد...",
      variant: "destructive",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            {busData?.bus_number ? `حافلة رقم ${busData.bus_number}` : 'حافلة'} - مستعد لضمان النقل الآمن لـ {studentsData.length} طالباً اليوم بإذن الله
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!currentTrip ? (
              <Button variant="glass" size="lg" onClick={startTrip}>
                <Play className="w-5 h-5" />
                بدء الرحلة
              </Button>
            ) : (
              <Button variant="glass" size="lg" onClick={endTrip}>
                <Square className="w-5 h-5" />
                إنهاء الرحلة
              </Button>
            )}
            <Button variant="glass" size="lg" onClick={() => setActiveTab('map')}>
              <Map className="w-5 h-5" />
              خريطة الطلاب
            </Button>
            <Button variant="glass" size="lg" onClick={() => setActiveTab('tracking')}>
              <Activity className="w-5 h-5" />
              التتبع المباشر
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            خريطة الطلاب
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            التتبع المباشر
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">

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
        {/* Students Management */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-5 h-5 text-primary" />
              <span>إدارة الطلاب</span>
            </CardTitle>
            <CardDescription>
              تسجيل الحضور وإدارة حالة الطلاب
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {studentsData.map((busStudent, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {busStudent.students?.profiles?.full_name?.charAt(0) || 'ط'}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {busStudent.students?.profiles?.full_name || 'طالب'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {busStudent.students?.grades?.name || 'غير محدد'} • {busStudent.pickup_time || 'غير محدد'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    busStudent.current_status === 'boarded' 
                      ? 'bg-success/10 text-success' 
                      : busStudent.current_status === 'waiting'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {busStudent.current_status === 'boarded' ? 'تم الصعود' : 
                     busStudent.current_status === 'waiting' ? 'في الانتظار' : 'غير محدد'}
                  </div>
                  {busStudent.current_status !== 'boarded' && currentTrip && (
                    <Button 
                      variant="captain" 
                      size="sm"
                      onClick={() => updateStudentStatus(busStudent.student_id, 'boarded')}
                    >
                      <UserCheck className="w-3 h-3" />
                    </Button>
                  )}
                  {busStudent.students?.parent_phone && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`tel:${busStudent.students.parent_phone}`)}
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {studentsData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد طلاب مخصصون لهذه الحافلة
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trip Status */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Bus className="w-5 h-5 text-secondary" />
              <span>حالة الرحلة الحالية</span>
            </CardTitle>
            <CardDescription>
              معلومات الرحلة والحالة الحالية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentTrip ? (
              <div className="space-y-4">
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <h4 className="font-semibold text-success mb-2">رحلة نشطة</h4>
                  <p className="text-sm text-muted-foreground">
                    بدأت في: {new Date(currentTrip.start_time).toLocaleString('ar')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    نوع الرحلة: {currentTrip.trip_type === 'morning' ? 'صباحية' : 'مسائية'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">طلاب صعدوا</p>
                    <p className="text-xl font-bold text-success">
                      {studentsData.filter(s => s.current_status === 'boarded').length}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">في الانتظار</p>
                    <p className="text-xl font-bold text-warning">
                      {studentsData.filter(s => s.current_status === 'waiting').length}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">لا توجد رحلة نشطة حالياً</p>
                <Button onClick={startTrip} variant="captain">
                  <Play className="w-4 h-4" />
                  بدء رحلة جديدة
                </Button>
              </div>
            )}
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
            <Button variant="captain" className="h-16 flex-col space-y-2" onClick={reportDelay}>
              <AlertTriangle className="w-6 h-6" />
              <span>إبلاغ عن تأخير</span>
            </Button>
            <Button variant="tracking" className="h-16 flex-col space-y-2" onClick={updateLocation}>
              <Navigation className="w-6 h-6" />
              <span>تحديث الموقع</span>
            </Button>
            <Button variant="parent" className="h-16 flex-col space-y-2" onClick={emergencyCall}>
              <Phone className="w-6 h-6" />
              <span>اتصال طوارئ</span>
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <StudentsMap busId={busData?.id} />
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <LiveBusTracking busId={busData?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaptainDashboard;