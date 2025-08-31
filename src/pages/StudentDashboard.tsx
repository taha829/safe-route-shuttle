import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, FileText, Clock, User, GraduationCap, Play } from 'lucide-react';

interface StudentProfile {
  id: string;
  user_id: string;
  grade_id: string;
  teacher_id: string;
  student_id: string;
  grade: {
    name: string;
    level: number;
  };
  teacher: {
    subject: string;
    user_id: string;
    profile: {
      full_name: string;
    };
  };
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  video_url: string;
  attachment_url: string;
  created_at: string;
  teacher: {
    subject: string;
    profile: {
      full_name: string;
    };
  };
  grade: {
    name: string;
  };
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  created_at: string;
  teacher: {
    subject: string;
    profile: {
      full_name: string;
    };
  };
  grade: {
    name: string;
  };
}

const StudentDashboard = () => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      await fetchStudentProfile(session.user.id);
      await fetchLessons();
      await fetchQuizzes();
      await fetchTeachers();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        grade:grades(name, level)
      `)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching student profile:', error);
      return;
    }

    // Fetch teacher profile separately
    const { data: teacherData } = await supabase
      .from('teachers')
      .select('subject, user_id')
      .eq('id', data.teacher_id)
      .single();

    let teacherName = 'غير محدد';
    if (teacherData?.user_id) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', teacherData.user_id)
        .single();
      
      teacherName = profileData?.full_name || 'غير محدد';
    }

    const enrichedData = {
      ...data,
      teacher: {
        subject: teacherData?.subject || '',
        user_id: teacherData?.user_id || '',
        profile: {
          full_name: teacherName
        }
      }
    };

    setStudentProfile(enrichedData);
  };

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        grade:grades(name)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lessons:', error);
      return;
    }

    // Enrich with teacher data
    const enrichedLessons = await Promise.all((data || []).map(async (lesson) => {
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('subject, user_id')
        .eq('id', lesson.teacher_id)
        .single();

      let teacherName = 'غير محدد';
      if (teacherData?.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', teacherData.user_id)
          .single();
        
        teacherName = profileData?.full_name || 'غير محدد';
      }

      return {
        ...lesson,
        teacher: {
          subject: teacherData?.subject || '',
          profile: {
            full_name: teacherName
          }
        }
      };
    }));

    setLessons(enrichedLessons);
  };

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        grade:grades(name)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quizzes:', error);
      return;
    }

    // Enrich with teacher data
    const enrichedQuizzes = await Promise.all((data || []).map(async (quiz) => {
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('subject, user_id')
        .eq('id', quiz.teacher_id)
        .single();

      let teacherName = 'غير محدد';
      if (teacherData?.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', teacherData.user_id)
          .single();
        
        teacherName = profileData?.full_name || 'غير محدد';
      }

      return {
        ...quiz,
        teacher: {
          subject: teacherData?.subject || '',
          profile: {
            full_name: teacherName
          }
        }
      };
    }));

    setQuizzes(enrichedQuizzes);
  };

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        id,
        subject,
        user_id
      `)
      .eq('is_approved', true);

    if (error) {
      console.error('Error fetching teachers:', error);
      return;
    }

    // Enrich with profile data
    const enrichedTeachers = await Promise.all((data || []).map(async (teacher) => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', teacher.user_id)
        .single();

      return {
        ...teacher,
        profile: {
          full_name: profileData?.full_name || 'غير محدد'
        }
      };
    }));

    setTeachers(enrichedTeachers);
  };

  const filteredLessons = lessons.filter(lesson => {
    if (selectedTeacher !== 'all' && lesson.teacher.profile.full_name !== selectedTeacher) {
      return false;
    }
    if (selectedSubject !== 'all' && lesson.teacher.subject !== selectedSubject) {
      return false;
    }
    return true;
  });

  const filteredQuizzes = quizzes.filter(quiz => {
    if (selectedTeacher !== 'all' && quiz.teacher.profile.full_name !== selectedTeacher) {
      return false;
    }
    if (selectedSubject !== 'all' && quiz.teacher.subject !== selectedSubject) {
      return false;
    }
    return true;
  });

  const uniqueSubjects = Array.from(new Set(teachers.map(t => t.subject)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">لوحة تحكم الطالب</h1>
            {studentProfile && (
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{studentProfile.grade.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>الأستاذ: {studentProfile.teacher.profile.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>المادة: {studentProfile.teacher.subject}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر الأستاذ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأساتذة</SelectItem>
              {teachers.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.profile.full_name}>
                  {teacher.profile.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر المادة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المواد</SelectItem>
              {uniqueSubjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            الدروس ({filteredLessons.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            الاختبارات ({filteredQuizzes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {lesson.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary">
                      {lesson.teacher.profile.full_name}
                    </Badge>
                    <Badge variant="outline">
                      {lesson.teacher.subject}
                    </Badge>
                    {lesson.grade?.name && (
                      <Badge variant="outline">
                        {lesson.grade.name}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(lesson.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex gap-2">
                      {lesson.video_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={lesson.video_url} target="_blank" rel="noopener noreferrer">
                            <Play className="h-4 w-4 mr-1" />
                            فيديو
                          </a>
                        </Button>
                      )}
                      <Button size="sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        مشاهدة الدرس
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد دروس متاحة حالياً</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {quiz.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary">
                      {quiz.teacher.profile.full_name}
                    </Badge>
                    <Badge variant="outline">
                      {quiz.teacher.subject}
                    </Badge>
                    {quiz.grade?.name && (
                      <Badge variant="outline">
                        {quiz.grade.name}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.duration_minutes} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{quiz.total_marks} نقطة</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">
                      {new Date(quiz.created_at).toLocaleDateString('ar-SA')}
                    </div>
                    <Button size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      بدء الاختبار
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد اختبارات متاحة حالياً</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;