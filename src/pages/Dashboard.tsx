import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  UserCheck, 
  Building, 
  Shield,
  LogOut,
  Sun,
  Moon,
  PlusCircle,
  Bus,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  email: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkUserAndProfile = async () => {
      try {
        // التحقق من الجلسة
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }

        // جلب بيانات الملف الشخصي
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: 'خطأ',
            description: 'حدث خطأ أثناء جلب بيانات المستخدم',
            variant: 'destructive',
          });
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndProfile();

    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تسجيل الخروج',
        variant: 'destructive',
      });
    }
  };

  const handleRoleSelection = (role: string) => {
    setSelectedModal(role);
    setFormData({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmitRole = async () => {
    if (!profile) return;
    
    setIsSubmitting(true);
    try {
      switch (selectedModal) {
        case 'teacher':
          const { error: teacherError } = await supabase
            .from('teachers')
            .insert({
              user_id: profile.user_id,
              subject: formData.subject,
              bio: formData.bio,
              experience_years: parseInt(formData.experience_years) || 0,
              hourly_rate: parseFloat(formData.hourly_rate) || 0,
            });
          if (teacherError) throw teacherError;
          navigate('/teacher-dashboard');
          break;
          
        case 'captain':
        case 'parent':
        case 'school_admin':
        case 'admin':
          toast({
            title: 'قريباً',
            description: `لوحة تحكم ${selectedModal} ستكون متاحة قريباً`,
          });
          break;
      }
      
      setSelectedModal(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ البيانات',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentRegistration = () => {
    navigate('/student-registration');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">جارٍ التحميل...</div>
      </div>
    );
  }

  const dashboardCards = [
    {
      id: 'teacher',
      title: 'المعلم',
      description: 'إدارة الدروس والاختبارات ومتابعة الطلاب',
      icon: GraduationCap,
      gradient: 'bg-gradient-primary',
      hoverColor: 'hover:shadow-bus'
    },
    {
      id: 'captain',
      title: 'الكابتن',
      description: 'إدارة النقل المدرسي ومتابعة الطلاب',
      icon: Users,
      gradient: 'bg-gradient-secondary',
      hoverColor: 'hover:shadow-card-custom'
    },
    {
      id: 'parent',
      title: 'ولي الأمر',
      description: 'متابعة الأبناء والتواصل مع المدرسة',
      icon: UserCheck,
      gradient: 'bg-gradient-school',
      hoverColor: 'hover:shadow-bus'
    },
    {
      id: 'school_admin',
      title: 'إدارة المدرسة',
      description: 'إدارة شؤون المدرسة والطلاب والمعلمين',
      icon: Building,
      gradient: 'bg-gradient-secondary',
      hoverColor: 'hover:shadow-card-custom'
    },
    {
      id: 'admin',
      title: 'الإدارة العامة',
      description: 'إدارة النظام والمستخدمين والتقارير',
      icon: Shield,
      gradient: 'bg-gradient-hero',
      hoverColor: 'hover:shadow-glass'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* شريط علوي */}
      <div className="bg-card/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">المنصة التعليمية</h1>
              <p className="text-white/80 text-sm">
                مرحباً، {profile?.full_name || 'المستخدم'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/20 text-white hover:bg-white/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">اختر نوع حسابك</h2>
          <p className="text-white/80 text-lg">اختر الدور المناسب لك للوصول إلى لوحة التحكم المخصصة</p>
        </div>

        {/* الكروت الرئيسية للأدوار */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card 
                key={card.id}
                className="glass-card border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-white/40"
                onClick={() => handleRoleSelection(card.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-4 rounded-full ${card.gradient} ${card.hoverColor} transition-all duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* كارد خاص للمنصة - تسجيل الطلاب */}
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card border-primary/30 bg-primary/5">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary text-primary-foreground">
                <PlusCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl text-card-foreground">تسجيل طالب جديد</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                سجل طالباً جديداً في المنصة واختر المعلم والصف المناسب
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-card/20 p-4 rounded-lg border border-white/20">
                  <h4 className="font-semibold text-card-foreground mb-2">ما يتضمنه التسجيل:</h4>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• إدخال بيانات الطالب الشخصية</li>
                    <li>• اختيار المعلم المناسب</li>
                    <li>• تحديد المرحلة الدراسية</li>
                    <li>• إعداد الاشتراك المدفوع</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleStudentRegistration}
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                  size="lg"
                >
                  ابدأ التسجيل الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Teacher Modal */}
      <Dialog open={selectedModal === 'teacher'} onOpenChange={() => setSelectedModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              بيانات المعلم
            </DialogTitle>
            <DialogDescription>
              أدخل بياناتك كمعلم للوصول إلى لوحة التحكم
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">المادة الدراسية</Label>
              <Input
                id="subject"
                placeholder="مثال: الرياضيات، العلوم، اللغة العربية"
                value={formData.subject || ''}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="experience">سنوات الخبرة</Label>
              <Input
                id="experience"
                type="number"
                placeholder="عدد سنوات الخبرة"
                value={formData.experience_years || ''}
                onChange={(e) => handleInputChange('experience_years', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rate">السعر بالساعة (ريال)</Label>
              <Input
                id="rate"
                type="number"
                placeholder="السعر المطلوب للساعة الواحدة"
                value={formData.hourly_rate || ''}
                onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bio">نبذة تعريفية</Label>
              <Textarea
                id="bio"
                placeholder="اكتب نبذة مختصرة عن خبرتك ومؤهلاتك التعليمية"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
              />
            </div>
            <Button 
              onClick={handleSubmitRole} 
              className="w-full"
              disabled={isSubmitting || !formData.subject}
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'دخول لوحة التحكم'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Captain Modal */}
      <Dialog open={selectedModal === 'captain'} onOpenChange={() => setSelectedModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              بيانات الكابتن
            </DialogTitle>
            <DialogDescription>
              أدخل بياناتك ككابتن حافلة للوصول إلى لوحة التحكم
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bus_number">رقم الحافلة</Label>
              <Input
                id="bus_number"
                placeholder="رقم الحافلة المخصصة لك"
                value={formData.bus_number || ''}
                onChange={(e) => handleInputChange('bus_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="route">المسار</Label>
              <Input
                id="route"
                placeholder="المسار الذي تخدمه"
                value={formData.route || ''}
                onChange={(e) => handleInputChange('route', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="license">رقم الرخصة</Label>
              <Input
                id="license"
                placeholder="رقم رخصة القيادة"
                value={formData.license || ''}
                onChange={(e) => handleInputChange('license', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                placeholder="رقم الهاتف للتواصل"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSubmitRole} 
              className="w-full"
              disabled={isSubmitting || !formData.bus_number}
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'دخول لوحة التحكم'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Parent Modal */}
      <Dialog open={selectedModal === 'parent'} onOpenChange={() => setSelectedModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              بيانات ولي الأمر
            </DialogTitle>
            <DialogDescription>
              أدخل بياناتك كولي أمر للوصول إلى لوحة التحكم
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="national_id">رقم الهوية الوطنية</Label>
              <Input
                id="national_id"
                placeholder="رقم الهوية الوطنية"
                value={formData.national_id || ''}
                onChange={(e) => handleInputChange('national_id', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="relation">صلة القرابة</Label>
              <Select value={formData.relation || ''} onValueChange={(value) => handleInputChange('relation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر صلة القرابة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="father">الأب</SelectItem>
                  <SelectItem value="mother">الأم</SelectItem>
                  <SelectItem value="guardian">الوصي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="work">مكان العمل</Label>
              <Input
                id="work"
                placeholder="مكان العمل"
                value={formData.work || ''}
                onChange={(e) => handleInputChange('work', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">العنوان</Label>
              <Textarea
                id="address"
                placeholder="العنوان الكامل"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
              />
            </div>
            <Button 
              onClick={handleSubmitRole} 
              className="w-full"
              disabled={isSubmitting || !formData.national_id}
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'دخول لوحة التحكم'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* School Admin Modal */}
      <Dialog open={selectedModal === 'school_admin'} onOpenChange={() => setSelectedModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              بيانات إدارة المدرسة
            </DialogTitle>
            <DialogDescription>
              أدخل بياناتك كمدير مدرسة للوصول إلى لوحة التحكم
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="school_name">اسم المدرسة</Label>
              <Input
                id="school_name"
                placeholder="اسم المدرسة"
                value={formData.school_name || ''}
                onChange={(e) => handleInputChange('school_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="position">المنصب</Label>
              <Select value={formData.position || ''} onValueChange={(value) => handleInputChange('position', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنصب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">مدير المدرسة</SelectItem>
                  <SelectItem value="vice_principal">وكيل المدرسة</SelectItem>
                  <SelectItem value="coordinator">منسق</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="education_level">المرحلة التعليمية</Label>
              <Select value={formData.education_level || ''} onValueChange={(value) => handleInputChange('education_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المرحلة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elementary">الابتدائية</SelectItem>
                  <SelectItem value="middle">المتوسطة</SelectItem>
                  <SelectItem value="high">الثانوية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="employee_id">رقم الموظف</Label>
              <Input
                id="employee_id"
                placeholder="رقم الموظف في المدرسة"
                value={formData.employee_id || ''}
                onChange={(e) => handleInputChange('employee_id', e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSubmitRole} 
              className="w-full"
              disabled={isSubmitting || !formData.school_name}
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'دخول لوحة التحكم'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* General Admin Modal */}
      <Dialog open={selectedModal === 'admin'} onOpenChange={() => setSelectedModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              بيانات الإدارة العامة
            </DialogTitle>
            <DialogDescription>
              أدخل بياناتك كمدير عام للوصول إلى لوحة التحكم
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="department">القسم</Label>
              <Select value={formData.department || ''} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">تقنية المعلومات</SelectItem>
                  <SelectItem value="education">الشؤون التعليمية</SelectItem>
                  <SelectItem value="finance">الشؤون المالية</SelectItem>
                  <SelectItem value="hr">الموارد البشرية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="admin_level">مستوى الإدارة</Label>
              <Select value={formData.admin_level || ''} onValueChange={(value) => handleInputChange('admin_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستوى" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">مدير عام</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="supervisor">مشرف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="employee_code">كود الموظف</Label>
              <Input
                id="employee_code"
                placeholder="كود الموظف"
                value={formData.employee_code || ''}
                onChange={(e) => handleInputChange('employee_code', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="access_level">مستوى الصلاحية</Label>
              <Select value={formData.access_level || ''} onValueChange={(value) => handleInputChange('access_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى الصلاحية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">صلاحية كاملة</SelectItem>
                  <SelectItem value="limited">صلاحية محدودة</SelectItem>
                  <SelectItem value="read_only">قراءة فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleSubmitRole} 
              className="w-full"
              disabled={isSubmitting || !formData.department}
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'دخول لوحة التحكم'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;