import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { GraduationCap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // التحقق من وجود جلسة مستخدم نشطة
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };

    checkUser();

    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === 'SIGNED_IN') {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: error.message === 'Invalid login credentials' 
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            : error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تسجيل الدخول',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور وتأكيد كلمة المرور غير متطابقتان',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) {
        toast({
          title: 'خطأ في إنشاء الحساب',
          description: error.message === 'User already registered' 
            ? 'المستخدم مسجل مسبقاً' 
            : error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'تم إنشاء الحساب بنجاح',
          description: 'مرحباً بك في المنصة التعليمية',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إنشاء الحساب',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* شعار المنصة */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-card/20 backdrop-blur-sm border border-white/20">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">المنصة التعليمية</h1>
          <p className="text-white/80">نحو مستقبل تعليمي أفضل</p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <Card className="glass-card border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-card-foreground">
              {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp 
                ? 'أنشئ حساباً جديداً للوصول إلى المنصة' 
                : 'سجل دخولك للوصول إلى المنصة'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSignUp ? (
              // نموذج تسجيل الدخول
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? 'جارٍ تسجيل الدخول...' : 'دخول'}
                </Button>
                
                <div className="text-center pt-4">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsSignUp(true)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    ليس لديك حساب؟ أنشئ حساباً جديداً
                  </Button>
                </div>
              </form>
            ) : (
              // نموذج إنشاء حساب جديد
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="الاسم الكامل"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
                </Button>
                
                <div className="text-center pt-4">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsSignUp(false)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    لديك حساب؟ سجل دخولك
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-white/80 text-sm">
          <p>© 2024 المنصة التعليمية - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
};

export default Login;