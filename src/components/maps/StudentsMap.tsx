import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  MapPin, 
  Navigation, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Phone,
  MessageSquare
} from 'lucide-react';
import trackingMapImage from '@/assets/tracking-map.jpg';

interface StudentLocation {
  id: string;
  name: string;
  grade: string;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'waiting' | 'picked_up' | 'dropped_off' | 'absent';
  pickupTime: string;
  parentPhone?: string;
}

interface StudentsMapProps {
  busId?: string;
}

const StudentsMap: React.FC<StudentsMapProps> = ({ busId }) => {
  const [students, setStudents] = useState<StudentLocation[]>([]);
  const [busLocation, setBusLocation] = useState({ lat: 24.7136, lng: 46.6753 });
  const [selectedStudent, setSelectedStudent] = useState<StudentLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentsLocation();
  }, [busId]);

  const fetchStudentsLocation = async () => {
    try {
      // جلب بيانات الطلاب مع معلومات الملف الشخصي
      const { data: busStudents, error } = await supabase
        .from('bus_students')
        .select(`
          id,
          pickup_location,
          pickup_time,
          current_status,
          students!inner (
            id,
            student_id,
            parent_phone
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      // جلب معلومات الملفات الشخصية للطلاب
      const studentIds = busStudents?.map(bs => bs.students?.student_id).filter(Boolean) || [];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', studentIds);

      const { data: grades } = await supabase
        .from('grades')
        .select('*');

      const formattedStudents: StudentLocation[] = busStudents?.map(student => {
        const profile = profiles?.find(p => p.user_id === student.students?.student_id);
        const randomGrade = grades?.[Math.floor(Math.random() * (grades?.length || 1))];
        
        return {
          id: student.id,
          name: profile?.full_name || 'غير محدد',
          grade: randomGrade?.name || 'الصف الأول',
          pickupLocation: student.pickup_location as any,
          status: student.current_status as any,
          pickupTime: student.pickup_time || '07:00',
          parentPhone: student.students?.parent_phone
        };
      }) || [];

      setStudents(formattedStudents);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب البيانات",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (studentId: string, newStatus: StudentLocation['status']) => {
    try {
      const { error } = await supabase
        .from('bus_students')
        .update({ 
          current_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId);

      if (error) throw error;

      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, status: newStatus }
          : student
      ));

      toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث حالة الطالب إلى ${getStatusText(newStatus)}`
      });
    } catch (error: any) {
      toast({
        title: "خطأ في التحديث",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: StudentLocation['status']) => {
    switch (status) {
      case 'waiting': return 'bg-warning text-warning-foreground';
      case 'picked_up': return 'bg-success text-success-foreground';
      case 'dropped_off': return 'bg-muted text-muted-foreground';
      case 'absent': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: StudentLocation['status']) => {
    switch (status) {
      case 'waiting': return 'في الانتظار';
      case 'picked_up': return 'تم الاستلام';
      case 'dropped_off': return 'تم التوصيل';
      case 'absent': return 'غائب';
      default: return 'غير محدد';
    }
  };

  const getStatusIcon = (status: StudentLocation['status']) => {
    switch (status) {
      case 'waiting': return <Clock className="w-4 h-4" />;
      case 'picked_up': return <CheckCircle className="w-4 h-4" />;
      case 'dropped_off': return <CheckCircle className="w-4 h-4" />;
      case 'absent': return <AlertCircle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <MapPin className="w-5 h-5 text-primary" />
            <span>خريطة مواقع الطلاب</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">جاري التحميل...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* الخريطة التفاعلية */}
      <Card className="lg:col-span-2 shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <MapPin className="w-5 h-5 text-primary" />
            <span>خريطة مواقع الطلاب</span>
          </CardTitle>
          <CardDescription>
            تتبع مواقع الطلاب في الوقت الفعلي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg overflow-hidden">
            <div 
              className="w-full h-96 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${trackingMapImage})` }}
            >
              {/* موقع الحافلة */}
              <div 
                className="absolute w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-lg animate-pulse"
                style={{ 
                  left: '45%', 
                  top: '40%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Navigation className="w-4 h-4" />
              </div>

              {/* مواقع الطلاب */}
              {students.map((student, index) => (
                <div
                  key={student.id}
                  className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${getStatusColor(student.status)}`}
                  style={{
                    left: `${30 + (index * 8) % 40}%`,
                    top: `${20 + (index * 6) % 60}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedStudent(student)}
                >
                  {getStatusIcon(student.status)}
                </div>
              ))}

              {/* معلومات الطالب المحدد */}
              {selectedStudent && (
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-64">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{selectedStudent.name}</h4>
                    <Badge className={getStatusColor(selectedStudent.status)}>
                      {getStatusText(selectedStudent.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>الصف: {selectedStudent.grade}</p>
                    <p>وقت الاستلام: {selectedStudent.pickupTime}</p>
                    <p>العنوان: {selectedStudent.pickupLocation.address}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {selectedStudent.status === 'waiting' && (
                      <Button 
                        size="sm" 
                        variant="captain"
                        onClick={() => updateStudentStatus(selectedStudent.id, 'picked_up')}
                      >
                        تم الاستلام
                      </Button>
                    )}
                    {selectedStudent.parentPhone && (
                      <Button size="sm" variant="outline">
                        <Phone className="w-3 h-3" />
                        اتصال
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-primary rounded-full"></div>
                <span>موقع الحافلة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span>في الانتظار</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span>تم الاستلام</span>
              </div>
            </div>
            <Button variant="tracking">
              <Navigation className="w-4 h-4" />
              تحديث المسار
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الطلاب */}
      <Card className="shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Users className="w-5 h-5 text-secondary" />
            <span>قائمة الطلاب</span>
          </CardTitle>
          <CardDescription>
            {students.length} طالب مسجل
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {students.map((student) => (
            <div 
              key={student.id}
              className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedStudent?.id === student.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-muted/30'
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">{student.name}</div>
                <Badge className={getStatusColor(student.status)}>
                  {getStatusText(student.status)}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                <div>{student.grade}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {student.pickupTime}
                </div>
              </div>
              {student.status === 'waiting' && (
                <Button 
                  size="sm" 
                  variant="captain" 
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStudentStatus(student.id, 'picked_up');
                  }}
                >
                  تأكيد الاستلام
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsMap;