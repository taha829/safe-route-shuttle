import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, UserCheck } from 'lucide-react';

const TeacherSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    experience_years: '',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      const { error } = await supabase
        .from('teachers')
        .insert([{
          user_id: session.user.id,
          subject: formData.subject,
          experience_years: parseInt(formData.experience_years) || 0,
          bio: formData.bio,
          is_approved: true
        }]);

      if (error) throw error;

      toast({
        title: 'تم إنشاء حسابك كمعلم بنجاح',
        description: 'مرحباً بك! يمكنك الآن إدارة دروسك واختباراتك وطلابك',
      });

      navigate('/teacher-dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'خطأ في إنشاء الملف التعريفي',
        description: 'حدث خطأ أثناء إنشاء ملفك التعريفي، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">إعداد ملف المعلم</CardTitle>
            <CardDescription>
              أكمل بياناتك للحصول على حساب معلم مفعل فوراً ولوحة تحكم كاملة
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">التخصص *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="مثال: الرياضيات، الفيزياء، العربية"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">سنوات الخبرة</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">نبذة تعريفية</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="اكتب نبذة مختصرة عن خبرتك وأسلوبك في التدريس"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  <ArrowRight className="h-4 w-4 ml-2" />
                  العودة
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.subject}
                  className="flex-1"
                >
                  {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء الملف'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherSetup;