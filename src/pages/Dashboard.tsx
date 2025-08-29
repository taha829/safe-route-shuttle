import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  PlusCircle
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
    if (role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      toast({
        title: 'قريباً',
        description: `لوحة تحكم ${role} ستكون متاحة قريباً`,
      });
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
    </div>
  );
};

export default Dashboard;