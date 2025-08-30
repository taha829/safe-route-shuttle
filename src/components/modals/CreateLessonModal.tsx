import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileVideo, Link as LinkIcon } from 'lucide-react';

interface CreateLessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  onLessonCreated: () => void;
}

interface Grade {
  id: string;
  name: string;
  level: number;
}

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ 
  open, 
  onOpenChange, 
  teacherId, 
  onLessonCreated 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    grade_id: '',
    video_url: '',
    attachment_url: '',
    is_published: false
  });

  React.useEffect(() => {
    const fetchGrades = async () => {
      const { data } = await supabase
        .from('grades')
        .select('*')
        .order('level', { ascending: true });
      
      if (data) setGrades(data);
    };

    if (open) fetchGrades();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('lessons')
        .insert([{
          ...formData,
          teacher_id: teacherId,
          grade_id: formData.grade_id || null
        }]);

      if (error) throw error;

      toast({
        title: 'تم إنشاء الدرس بنجاح',
        description: 'تم إضافة الدرس الجديد إلى قائمة دروسك',
      });

      setFormData({
        title: '',
        description: '',
        content: '',
        grade_id: '',
        video_url: '',
        attachment_url: '',
        is_published: false
      });

      onLessonCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: 'خطأ في إنشاء الدرس',
        description: 'حدث خطأ أثناء إنشاء الدرس، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            إنشاء درس جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الدرس *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الدرس"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">الصف الدراسي</Label>
              <Select 
                value={formData.grade_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, grade_id: value }))}
              >
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الدرس</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="أدخل وصف مختصر للدرس"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">محتوى الدرس</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="أدخل محتوى الدرس التفصيلي"
              rows={8}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video_url" className="flex items-center gap-2">
                <FileVideo className="h-4 w-4" />
                رابط الفيديو
              </Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment_url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                رابط المرفق
              </Label>
              <Input
                id="attachment_url"
                type="url"
                value={formData.attachment_url}
                onChange={(e) => setFormData(prev => ({ ...prev, attachment_url: e.target.value }))}
                placeholder="رابط ملف PDF أو مستند"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="publish">نشر الدرس</Label>
              <p className="text-sm text-muted-foreground">
                هل تريد نشر الدرس ليراه الطلاب فوراً؟
              </p>
            </div>
            <Switch
              id="publish"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء الدرس'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLessonModal;