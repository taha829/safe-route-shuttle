import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, UserPlus, GraduationCap, Users, CreditCard } from 'lucide-react';

interface Grade {
  id: string;
  name: string;
  level: number;
}

interface Teacher {
  id: string;
  user_id: string;
  subject: string;
  profiles?: {
    full_name: string;
  } | null;
}

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    parentPhone: '',
    gradeId: '',
    teacherId: '',
    parentName: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب الصفوف الدراسية
        const { data: gradesData, error: gradesError } = await supabase
          .from('grades')
          .select('*')
          .order('level', { ascending: true });

        if (gradesError) throw gradesError;
        setGrades(gradesData || []);

        // جلب المعلمين المعتمدين
        const { data: teachersData, error: teachersError } = await supabase
          .from('teachers')
          .select(`
            id,
            user_id,
            subject,
            profiles(full_name)
          `)
          .eq('is_approved', true);

        if (teachersError) throw teachersError;
        setTeachers((teachersData as any) || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء جلب البيانات',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateStudentId = () => {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const newId = `STU${currentYear}${randomNum}`;
    setFormData(prev => ({ ...prev, studentId: newId }));
  };

  useEffect(() => {
    if (!formData.studentId) {
      generateStudentId();
    }
  }, [formData.studentId]);

  const validateStep1 = () => {
    return formData.fullName && formData.email && formData.phone && formData.parentName && formData.parentPhone;
  };

  const validateStep2 = () => {
    return formData.gradeId && formData.teacherId;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else {
      toast({
        title: 'بيانات ناقصة',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2()) {
      toast({
        title: 'بيانات ناقصة',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // إدراج بيانات الطالب
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          student_id: formData.studentId,
          grade_id: formData.gradeId,
          teacher_id: formData.teacherId,
          parent_phone: formData.parentPhone,
          enrollment_date: new Date().toISOString().split('T')[0],
          is_active: true
        })
        .select()
        .single();

      if (studentError) throw studentError;

      toast({
        title: 'تم التسجيل بنجاح',
        description: 'تم تسجيل الطالب بنجاح في المنصة',
      });

      // الانتقال إلى صفحة الدفع أو العودة للوحة التحكم
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error registering student:', error);
      toast({
        title: 'خطأ في التسجيل',
        description: error.message || 'حدث خطأ أثناء تسجيل الطالب',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedGrade = grades.find(g => g.id === formData.gradeId);
  const selectedTeacher = teachers.find(t => t.id === formData.teacherId);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* شريط علوي */}
      <div className="bg-card/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">تسجيل طالب جديد</h1>
              <p className="text-white/80 text-sm">الخطوة {currentStep} من 3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* مؤشر التقدم */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step <= currentStep
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card/20 text-white border-white/20'
                    }`}
                  >
                    {step === 1 && <UserPlus className="h-5 w-5" />}
                    {step === 2 && <GraduationCap className="h-5 w-5" />}
                    {step === 3 && <CreditCard className="h-5 w-5" />}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-20 h-0.5 mx-2 ${
                        step < currentStep ? 'bg-primary' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* الخطوة الأولى: بيانات الطالب */}
          {currentStep === 1 && (
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <UserPlus className="h-6 w-6" />
                  بيانات الطالب الشخصية
                </CardTitle>
                <CardDescription>أدخل البيانات الأساسية للطالب</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    placeholder="الاسم الكامل للطالب"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">رقم الطالب</Label>
                  <div className="flex gap-2">
                    <Input
                      id="studentId"
                      placeholder="رقم الطالب"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      className="text-right"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateStudentId}
                    >
                      إنشاء
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentName">اسم ولي الأمر *</Label>
                  <Input
                    id="parentName"
                    placeholder="الاسم الكامل لولي الأمر"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange('parentName', e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone">هاتف ولي الأمر *</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={formData.parentPhone}
                    onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleNextStep} disabled={!validateStep1()}>
                    التالي
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* الخطوة الثانية: اختيار المعلم والصف */}
          {currentStep === 2 && (
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <GraduationCap className="h-6 w-6" />
                  اختيار المعلم والصف
                </CardTitle>
                <CardDescription>حدد الصف الدراسي والمعلم المناسب</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">الصف الدراسي *</Label>
                  <Select value={formData.gradeId} onValueChange={(value) => handleInputChange('gradeId', value)}>
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
                  <Label htmlFor="teacher">المعلم *</Label>
                  <Select value={formData.teacherId} onValueChange={(value) => handleInputChange('teacherId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المعلم" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.profiles?.full_name || 'غير محدد'} - {teacher.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    السابق
                  </Button>
                  <Button onClick={handleNextStep} disabled={!validateStep2()}>
                    التالي
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* الخطوة الثالثة: مراجعة وتأكيد */}
          {currentStep === 3 && (
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <CreditCard className="h-6 w-6" />
                  مراجعة البيانات والدفع
                </CardTitle>
                <CardDescription>راجع البيانات المدخلة قبل التأكيد</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-card/20 p-4 rounded-lg border border-white/20 space-y-3">
                  <h4 className="font-semibold text-card-foreground">بيانات الطالب:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>الاسم:</strong> {formData.fullName}</p>
                    <p><strong>رقم الطالب:</strong> {formData.studentId}</p>
                    <p><strong>البريد الإلكتروني:</strong> {formData.email}</p>
                    <p><strong>الهاتف:</strong> {formData.phone}</p>
                    <p><strong>ولي الأمر:</strong> {formData.parentName} - {formData.parentPhone}</p>
                  </div>
                </div>

                <div className="bg-card/20 p-4 rounded-lg border border-white/20 space-y-3">
                  <h4 className="font-semibold text-card-foreground">التفاصيل الأكاديمية:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>الصف:</strong> {selectedGrade?.name}</p>
                    <p><strong>المعلم:</strong> {selectedTeacher?.profiles?.full_name || 'غير محدد'}</p>
                    <p><strong>المادة:</strong> {selectedTeacher?.subject}</p>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">الرسوم والدفع:</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    سيتم إعداد خطة الدفع بعد التسجيل مباشرة
                  </p>
                  <div className="space-y-1 text-sm">
                    <p><strong>رسوم التسجيل:</strong> سيتم تحديدها حسب المعلم</p>
                    <p><strong>طريقة الدفع:</strong> ستكون متاحة بعد التسجيل</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    السابق
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary-glow text-primary-foreground"
                  >
                    {isLoading ? 'جارٍ التسجيل...' : 'تأكيد التسجيل'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;