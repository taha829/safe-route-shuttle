import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import CreateLessonModal from '@/components/modals/CreateLessonModal';
import CreateQuizModal from '@/components/modals/CreateQuizModal';
import { 
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Settings,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  Clock,
  Award
} from 'lucide-react';

interface TeacherProfile {
  id: string;
  user_id: string;
  subject: string;
  experience_years: number;
  bio: string;
  is_approved: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  grade_id: string;
  video_url: string;
  attachment_url: string;
  is_published: boolean;
  created_at: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  grade_id: string;
  duration_minutes: number;
  total_marks: number;
  is_published: boolean;
  created_at: string;
}

interface Student {
  id: string;
  student_id: string;
  profiles?: {
    full_name: string;
  } | null;
  grades?: {
    name: string;
  } | null;
  enrollment_date: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const checkTeacherProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }

        // جلب بيانات المعلم - أحدث ملف معتمد
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (teacherError || !teacherData || teacherData.length === 0) {
          // إذا لم يكن المعلم مسجل، توجيهه لإنشاء ملف تعريفي
          navigate('/teacher-setup');
          return;
        }

        const teacher = teacherData[0];
        setTeacherProfile(teacher);

        // جلب الدروس
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('teacher_id', teacher.id)
          .order('created_at', { ascending: false });

        if (lessonsData) setLessons(lessonsData);

        // جلب الاختبارات
        const { data: quizzesData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('teacher_id', teacher.id)
          .order('created_at', { ascending: false });

        if (quizzesData) setQuizzes(quizzesData);

        // جلب الطلاب
        const { data: studentsData } = await supabase
          .from('students')
          .select(`
            *,
            profiles(full_name),
            grades(name)
          `)
          .eq('teacher_id', teacher.id);

        if (studentsData) setStudents(studentsData as any);

      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء جلب البيانات',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkTeacherProfile();
  }, [navigate, toast]);

  const refreshLessons = async () => {
    if (!teacherProfile) return;
    
    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .eq('teacher_id', teacherProfile.id)
      .order('created_at', { ascending: false });

    if (lessonsData) setLessons(lessonsData);
  };

  const refreshQuizzes = async () => {
    if (!teacherProfile) return;
    
    const { data: quizzesData } = await supabase
      .from('quizzes')
      .select('*')
      .eq('teacher_id', teacherProfile.id)
      .order('created_at', { ascending: false });

    if (quizzesData) setQuizzes(quizzesData);
  };

  const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!confirm(`هل أنت متأكد من حذف الدرس "${lessonTitle}"؟`)) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: 'تم الحذف',
        description: 'تم حذف الدرس بنجاح',
      });
      
      refreshLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الدرس',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    if (!confirm(`هل أنت متأكد من حذف الاختبار "${quizTitle}"؟`)) return;

    try {
      // حذف أسئلة الاختبار أولاً
      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', quizId);

      if (questionsError) throw questionsError;

      // حذف الاختبار
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;

      toast({
        title: 'تم الحذف',
        description: 'تم حذف الاختبار بنجاح',
      });
      
      refreshQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الاختبار',
        variant: 'destructive',
      });
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleLessonModalClose = () => {
    setShowLessonModal(false);
    setEditingLesson(null);
  };

  const handleQuizModalClose = () => {
    setShowQuizModal(false);
    setEditingQuiz(null);
  };

  const statsCards = [
    {
      title: 'إجمالي الدروس',
      value: lessons.length.toString(),
      description: `${lessons.filter(l => l.is_published).length} منشور`,
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'الطلاب المسجلين',
      value: students.length.toString(),
      description: 'طالب نشط',
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'الاختبارات',
      value: quizzes.length.toString(),
      description: `${quizzes.filter(q => q.is_published).length} متاح`,
      icon: FileText,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'معدل النجاح',
      value: '85%',
      description: 'هذا الشهر',
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">جارٍ التحميل...</div>
      </div>
    );
  }

  if (!teacherProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>لم يتم العثور على ملف المعلم</CardTitle>
            <CardDescription>يرجى إنشاء ملف تعريفي كمعلم أولاً</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/teacher-setup')} className="w-full">
              إنشاء ملف المعلم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* شريط علوي */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة
            </Button>
            <div>
              <h1 className="text-xl font-bold">لوحة تحكم المعلم</h1>
              <p className="text-muted-foreground text-sm">
                تخصص: {teacherProfile.subject}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="lessons">الدروس</TabsTrigger>
            <TabsTrigger value="quizzes">الاختبارات</TabsTrigger>
            <TabsTrigger value="students">الطلاب</TabsTrigger>
            <TabsTrigger value="analytics">التقارير</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <IconComponent className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* أحدث الأنشطة */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    أحدث الدروس
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lessons.slice(0, 3).map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(lesson.created_at).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            lesson.is_published 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {lesson.is_published ? 'منشور' : 'مسودة'}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      عرض جميع الدروس
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    الطلاب الجدد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.slice(0, 3).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{student.profiles?.full_name || 'غير محدد'}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.grades?.name || 'غير محدد'} - {student.student_id}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(student.enrollment_date).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      عرض جميع الطلاب
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">إدارة الدروس</h2>
              <Button onClick={() => setShowLessonModal(true)}>
                <Plus className="h-4 w-4 ml-2" />
                درس جديد
              </Button>
            </div>
            
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{lesson.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            lesson.is_published 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {lesson.is_published ? 'منشور' : 'مسودة'}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2">{lesson.description}</p>
                        <p className="text-sm text-muted-foreground">
                          تاريخ الإنشاء: {new Date(lesson.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" title="عرض">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="تعديل"
                          onClick={() => handleEditLesson(lesson)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="حذف"
                          onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">إدارة الاختبارات</h2>
              <Button onClick={() => setShowQuizModal(true)}>
                <Plus className="h-4 w-4 ml-2" />
                اختبار جديد
              </Button>
            </div>
            
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{quiz.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            quiz.is_published 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {quiz.is_published ? 'متاح' : 'مسودة'}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2">{quiz.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {quiz.duration_minutes} دقيقة
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {quiz.total_marks} نقطة
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" title="عرض">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="تعديل"
                          onClick={() => handleEditQuiz(quiz)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="حذف"
                          onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">قائمة الطلاب</h2>
              
              <div className="grid gap-4">
                {students.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{student.profiles?.full_name || 'غير محدد'}</h3>
                          <p className="text-muted-foreground">
                            رقم الطالب: {student.student_id} | الصف: {student.grades?.name || 'غير محدد'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            تاريخ التسجيل: {new Date(student.enrollment_date).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            عرض التقرير
                          </Button>
                          <Button variant="outline" size="sm">
                            إرسال رسالة
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">التقارير والإحصائيات</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>أداء الطلاب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">الرسوم البيانية ستكون متاحة قريباً</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>إحصائيات المحتوى</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">تقارير المحتوى ستكون متاحة قريباً</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* مودالز إنشاء المحتوى */}
      {teacherProfile && (
        <>
          <CreateLessonModal
            open={showLessonModal}
            onOpenChange={handleLessonModalClose}
            teacherId={teacherProfile.id}
            onLessonCreated={refreshLessons}
            editingLesson={editingLesson}
          />
          
          <CreateQuizModal
            open={showQuizModal}
            onOpenChange={handleQuizModalClose}
            teacherId={teacherProfile.id}
            onQuizCreated={refreshQuizzes}
            editingQuiz={editingQuiz}
          />
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;