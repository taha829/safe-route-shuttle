import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Bus, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
}

interface CaptainData {
  id: string;
  user_id: string;
  bus_number: string;
  captain_name: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onStudentAdded
}) => {
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  
  const [studentData, setStudentData] = useState({
    name: '',
    grade: '',
    phoneNumber: '',
    captainId: '',
    location: null as LocationData | null
  });
  
  const [captains, setCaptains] = useState<CaptainData[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock Mapbox implementation - في التطبيق الحقيقي سيتم استخدام Mapbox
  const initializeMap = () => {
    if (!mapContainer.current) return;

    // محاكاة خريطة تفاعلية
    const mockMap = {
      container: mapContainer.current,
      center: [46.6753, 24.7136], // الرياض
      zoom: 12
    };
    
    setMap(mockMap);
  };

  const handleMapClick = (event: any) => {
    // محاكاة اختيار موقع على الخريطة
    const lat = 24.7136 + (Math.random() - 0.5) * 0.1;
    const lng = 46.6753 + (Math.random() - 0.5) * 0.1;
    
    setStudentData(prev => ({
      ...prev,
      location: {
        latitude: lat,
        longitude: lng,
        address: `موقع مخصص في الرياض (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      }
    }));

    toast({
      title: "تم اختيار الموقع",
      description: "تم تحديد موقع الطالب على الخريطة بنجاح"
    });
  };

  const loadCaptains = async () => {
    try {
      const { data: busesData, error: busesError } = await supabase
        .from('buses')
        .select(`
          id,
          bus_number,
          captain_id,
          profiles!inner(full_name)
        `)
        .eq('status', 'active');

      if (busesError) throw busesError;

      const captainsData = busesData?.map(bus => ({
        id: bus.id,
        user_id: bus.captain_id,
        bus_number: bus.bus_number,
        captain_name: bus.profiles.full_name
      })) || [];

      setCaptains(captainsData);
    } catch (error) {
      console.error('Error loading captains:', error);
    }
  };

  const loadGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('level');

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData.name || !studentData.grade || !studentData.captainId || !studentData.location) {
      toast({
        variant: "destructive",
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع البيانات المطلوبة واختيار الموقع على الخريطة"
      });
      return;
    }

    setLoading(true);
    
    try {
      // إنشاء سجل الطالب
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .insert({
          student_id: `STU-${Date.now()}`,
          grade_id: studentData.grade,
          parent_phone: studentData.phoneNumber,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (studentError) throw studentError;

      // ربط الطالب بالحافلة
      const { error: busStudentError } = await supabase
        .from('bus_students')
        .insert({
          bus_id: studentData.captainId,
          student_id: studentRecord.id,
          pickup_location: {
            latitude: studentData.location.latitude,
            longitude: studentData.location.longitude,
            address: studentData.location.address,
            name: studentData.name
          },
          current_status: 'waiting'
        });

      if (busStudentError) throw busStudentError;

      toast({
        title: "تم تسجيل الطالب بنجاح",
        description: `تم تسجيل ${studentData.name} وربطه بالكابتن المحدد`
      });

      onStudentAdded();
      onClose();
      
      // إعادة تعيين النموذج
      setStudentData({
        name: '',
        grade: '',
        phoneNumber: '',
        captainId: '',
        location: null
      });

    } catch (error) {
      console.error('Error registering student:', error);
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: "حدث خطأ أثناء تسجيل الطالب، يرجى المحاولة مرة أخرى"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCaptains();
      loadGrades();
      setTimeout(initializeMap, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Users className="w-5 h-5 text-primary" />
            <span>تسجيل طالب جديد</span>
          </DialogTitle>
          <DialogDescription>
            أدخل بيانات الطالب واختر موقعه على الخريطة لتسجيله في النظام
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* بيانات الطالب */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">بيانات الطالب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">اسم الطالب</Label>
                  <Input
                    id="studentName"
                    value={studentData.name}
                    onChange={(e) => setStudentData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم الطالب الكامل"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">الصف الدراسي</Label>
                  <Select value={studentData.grade} onValueChange={(value) => 
                    setStudentData(prev => ({ ...prev, grade: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصف الدراسي" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={studentData.phoneNumber}
                    onChange={(e) => setStudentData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captain">اختيار الكابتن والحافلة</Label>
                  <Select value={studentData.captainId} onValueChange={(value) => 
                    setStudentData(prev => ({ ...prev, captainId: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الكابتن والحافلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {captains.map((captain) => (
                        <SelectItem key={captain.id} value={captain.id}>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Bus className="w-4 h-4" />
                            <span>{captain.bus_number} - {captain.captain_name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* خريطة اختيار الموقع */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>تحديد موقع الطالب</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={mapContainer}
                  className="w-full h-64 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={handleMapClick}
                >
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      انقر هنا لاختيار موقع الطالب على الخريطة
                    </p>
                  </div>
                </div>
                
                {studentData.location && (
                  <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm text-success font-medium">
                      ✓ تم تحديد الموقع بنجاح
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {studentData.location.address}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading ? 'جاري الحفظ...' : 'تسجيل الطالب'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentRegistrationModal;