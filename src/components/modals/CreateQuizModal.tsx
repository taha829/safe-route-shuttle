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
import { FileText, Clock, Award, Plus, Minus } from 'lucide-react';

interface CreateQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  onQuizCreated: () => void;
}

interface Grade {
  id: string;
  name: string;
  level: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  marks: number;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ 
  open, 
  onOpenChange, 
  teacherId, 
  onQuizCreated 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade_id: '',
    duration_minutes: 60,
    total_marks: 100,
    is_published: false
  });

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
    marks: 10
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

  const addQuestion = () => {
    if (!newQuestion.question.trim() || !newQuestion.correct_answer.trim()) {
      toast({
        title: 'خطأ في السؤال',
        description: 'يرجى ملء السؤال والإجابة الصحيحة',
        variant: 'destructive',
      });
      return;
    }

    const validOptions = newQuestion.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: 'خطأ في الخيارات',
        description: 'يجب إضافة خيارين على الأقل',
        variant: 'destructive',
      });
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      options: validOptions,
      correct_answer: newQuestion.correct_answer,
      marks: newQuestion.marks
    };

    setQuestions(prev => [...prev, question]);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
      marks: 10
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      toast({
        title: 'لا توجد أسئلة',
        description: 'يرجى إضافة سؤال واحد على الأقل',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // حساب إجمالي الدرجات
      const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
      
      // إنشاء الاختبار
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert([{
          ...formData,
          teacher_id: teacherId,
          grade_id: formData.grade_id || null,
          total_marks: totalMarks
        }])
        .select()
        .single();

      if (quizError) throw quizError;

      // إضافة الأسئلة
      const questionsToInsert = questions.map((q, index) => ({
        quiz_id: quizData.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        marks: q.marks,
        order_number: index + 1
      }));

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast({
        title: 'تم إنشاء الاختبار بنجاح',
        description: `تم إضافة الاختبار مع ${questions.length} سؤال`,
      });

      setFormData({
        title: '',
        description: '',
        grade_id: '',
        duration_minutes: 60,
        total_marks: 100,
        is_published: false
      });
      setQuestions([]);

      onQuizCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: 'خطأ في إنشاء الاختبار',
        description: 'حدث خطأ أثناء إنشاء الاختبار، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-secondary" />
            إنشاء اختبار جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات الاختبار الأساسية */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">معلومات الاختبار</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الاختبار *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان الاختبار"
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
              <Label htmlFor="description">وصف الاختبار</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="أدخل وصف مختصر للاختبار"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  المدة (بالدقائق)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  إجمالي الدرجات
                </Label>
                <Input
                  value={questions.reduce((sum, q) => sum + q.marks, 0)}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="flex items-end">
                <div className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="publish">نشر الاختبار</Label>
                  <Switch
                    id="publish"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* إضافة سؤال جديد */}
          <div className="bg-secondary/10 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة سؤال جديد
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>السؤال *</Label>
                <Textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="اكتب السؤال هنا..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <Label>خيار {index + 1}</Label>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`الخيار ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الإجابة الصحيحة *</Label>
                  <Input
                    value={newQuestion.correct_answer}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, correct_answer: e.target.value }))}
                    placeholder="اكتب الإجابة الصحيحة بالضبط"
                  />
                </div>

                <div className="space-y-2">
                  <Label>درجة السؤال</Label>
                  <Input
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) || 10 }))}
                    min="1"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={addQuestion}
                variant="outline"
                className="w-full border-secondary text-secondary hover:bg-secondary/10"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة السؤال
              </Button>
            </div>
          </div>

          {/* قائمة الأسئلة المضافة */}
          {questions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">الأسئلة المضافة ({questions.length})</h3>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          السؤال {index + 1}: {question.question}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className={`p-2 rounded ${
                              option === question.correct_answer 
                                ? 'bg-success/10 text-success' 
                                : 'bg-muted/50'
                            }`}>
                              {option}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          الدرجة: {question.marks} نقطة
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={isLoading || !formData.title || questions.length === 0}
              className="bg-gradient-secondary text-secondary-foreground hover:opacity-90"
            >
              {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء الاختبار'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuizModal;