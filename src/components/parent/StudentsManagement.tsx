import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  MapPin, 
  Bus, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Navigation,
  Clock,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import StudentRegistrationModal from '@/components/modals/StudentRegistrationModal';

interface Student {
  id: string;
  student_id: string;
  user_id: string;
  grade: { name: string; level: number };
  parent_phone: string;
  bus_assignment: {
    bus: {
      bus_number: string;
      captain: { full_name: string };
    };
    pickup_location: any;
    current_status: string;
  } | null;
  created_at: string;
}

const StudentsManagement: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) return;

      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          grade:grades(name, level),
          bus_assignment:bus_students(
            current_status,
            pickup_location,
            bus:buses(
              bus_number,
              captain:profiles!inner(full_name)
            )
          )
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // تنسيق البيانات
      const formattedStudents = data?.map(student => ({
        ...student,
        bus_assignment: student.bus_assignment?.[0] || null
      })) || [];

      setStudents(formattedStudents);

    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل بيانات الطلاب"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewLocation = (location: any) => {
    if (!location) return;
    
    toast({
      title: "موقع الطالب",
      description: location.address || "الموقع المحدد على الخريطة"
    });
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;

    try {
      // حذف من bus_students أولاً
      await supabase
        .from('bus_students')
        .delete()
        .eq('student_id', studentId);

      // ثم حذف الطالب
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الطالب بنجاح"
      });

      loadStudents();

    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الطالب"
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'waiting': 'bg-warning/10 text-warning',
      'picked_up': 'bg-primary/10 text-primary',
      'in_transit': 'bg-secondary/10 text-secondary',
      'dropped_off': 'bg-success/10 text-success',
      'absent': 'bg-muted text-muted-foreground'
    };
    return colors[status as keyof typeof colors] || colors.waiting;
  };

  const getStatusText = (status: string) => {
    const texts = {
      'waiting': 'في الانتظار',
      'picked_up': 'تم الاستلام',
      'in_transit': 'في الطريق',
      'dropped_off': 'تم التوصيل',
      'absent': 'غائب'
    };
    return texts[status as keyof typeof texts] || 'غير محدد';
  };

  useEffect(() => {
    loadStudents();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-card-custom">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Users className="w-5 h-5 text-primary" />
                <span>إدارة الطلاب المسجلين</span>
              </CardTitle>
              <CardDescription>
                عرض وإدارة جميع الطلاب المسجلين في النظام
              </CardDescription>
            </div>
            <Button onClick={() => setShowRegistration(true)}>
              <Plus className="w-4 h-4" />
              تسجيل طالب جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                لا يوجد طلاب مسجلين حالياً. انقر على "تسجيل طالب جديد" لإضافة أول طالب.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {student.student_id.substring(0, 2)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <h3 className="font-medium text-foreground">
                          الطالب: {student.student_id}
                        </h3>
                        <Badge variant="outline">
                          {student.grade?.name || 'غير محدد'}
                        </Badge>
                      </div>
                      
                      {student.bus_assignment ? (
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Bus className="w-3 h-3" />
                            <span>{student.bus_assignment.bus.bus_number}</span>
                          </div>
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Users className="w-3 h-3" />
                            <span>{student.bus_assignment.bus.captain.full_name}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          لم يتم ربط الطالب بحافلة بعد
                        </p>
                      )}

                      {student.parent_phone && (
                        <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{student.parent_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {student.bus_assignment && (
                      <Badge className={getStatusColor(student.bus_assignment.current_status)}>
                        {getStatusText(student.bus_assignment.current_status)}
                      </Badge>
                    )}
                    
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      {student.bus_assignment?.pickup_location && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLocation(student.bus_assignment.pickup_location)}
                        >
                          <MapPin className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <StudentRegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onStudentAdded={loadStudents}
      />
    </>
  );
};

export default StudentsManagement;