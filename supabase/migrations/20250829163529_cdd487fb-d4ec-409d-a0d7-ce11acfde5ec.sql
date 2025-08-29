-- إنشاء جدول الأدوار
CREATE TYPE user_role AS ENUM ('teacher', 'student', 'captain', 'parent', 'school_admin', 'admin');

-- إنشاء جدول الملفات الشخصية للمستخدمين
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'student',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء جدول المعلمين
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء جدول الصفوف/المراحل الدراسية
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء جدول الطلاب
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  grade_id UUID REFERENCES public.grades(id),
  teacher_id UUID REFERENCES public.teachers(id),
  parent_phone TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء جدول الدروس
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.teachers(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  attachment_url TEXT,
  grade_id UUID REFERENCES public.grades(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء جدول الاختبارات
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.teachers(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  grade_id UUID REFERENCES public.grades(id),
  duration_minutes INTEGER DEFAULT 60,
  total_marks INTEGER DEFAULT 100,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء جدول أسئلة الاختبارات
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  marks INTEGER DEFAULT 1,
  order_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء جدول الاشتراكات المدفوعة
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  amount DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending',
  stripe_subscription_id TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- تمكين RLS على جميع الجداول
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للملفات الشخصية
CREATE POLICY "المستخدمون يمكنهم رؤية ملفاتهم الشخصية" 
ON public.profiles FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "المستخدمون يمكنهم تحديث ملفاتهم الشخصية" 
ON public.profiles FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "إدراج الملف الشخصي عند التسجيل" 
ON public.profiles FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- سياسات الأمان للمعلمين
CREATE POLICY "الجميع يمكنهم رؤية المعلمين المعتمدين" 
ON public.teachers FOR SELECT 
USING (is_approved = true OR user_id = auth.uid());

CREATE POLICY "المعلمون يمكنهم تحديث بياناتهم" 
ON public.teachers FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "المعلمون يمكنهم إنشاء ملفاتهم التعريفية" 
ON public.teachers FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- سياسات الأمان للصفوف (الجميع يمكنهم رؤيتها)
CREATE POLICY "الجميع يمكنهم رؤية الصفوف" 
ON public.grades FOR SELECT 
USING (true);

-- سياسات الأمان للطلاب
CREATE POLICY "الطلاب يمكنهم رؤية بياناتهم" 
ON public.students FOR SELECT 
USING (user_id = auth.uid() OR teacher_id IN (
  SELECT id FROM teachers WHERE user_id = auth.uid()
));

CREATE POLICY "إدراج بيانات الطلاب" 
ON public.students FOR INSERT 
WITH CHECK (true);

-- سياسات الأمان للدروس
CREATE POLICY "الجميع يمكنهم رؤية الدروس المنشورة" 
ON public.lessons FOR SELECT 
USING (is_published = true OR teacher_id IN (
  SELECT id FROM teachers WHERE user_id = auth.uid()
));

CREATE POLICY "المعلمون يمكنهم إنشاء دروسهم" 
ON public.lessons FOR INSERT 
WITH CHECK (teacher_id IN (
  SELECT id FROM teachers WHERE user_id = auth.uid()
));

CREATE POLICY "المعلمون يمكنهم تحديث دروسهم" 
ON public.lessons FOR UPDATE 
USING (teacher_id IN (
  SELECT id FROM teachers WHERE user_id = auth.uid()
));

-- سياسات الأمان للاختبارات
CREATE POLICY "الجميع يمكنهم رؤية الاختبارات المنشورة" 
ON public.quizzes FOR SELECT 
USING (is_published = true OR teacher_id IN (
  SELECT id FROM teachers WHERE user_id = auth.uid()
));

CREATE POLICY "المعلمون يمكنهم إنشاء اختباراتهم" 
ON public.quizzes FOR INSERT 
WITH CHECK (teacher_id IN (
  SELECT id FROM teachers WHERE user_id = auth.uid()
));

CREATE POLICY "المعلمون يمكنهم تحديث اختباراتهم" 
ON public.quizzes FOR UPDATE 
USING (teacher_id IN (
  SELECT id FROM teachers WHERE user_id = auth.uid()
));

-- سياسات الأمان لأسئلة الاختبارات
CREATE POLICY "رؤية أسئلة الاختبارات" 
ON public.quiz_questions FOR SELECT 
USING (quiz_id IN (
  SELECT id FROM quizzes WHERE is_published = true OR teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
  )
));

CREATE POLICY "المعلمون يمكنهم إدراج الأسئلة" 
ON public.quiz_questions FOR INSERT 
WITH CHECK (quiz_id IN (
  SELECT id FROM quizzes WHERE teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
  )
));

-- سياسات الأمان للاشتراكات
CREATE POLICY "رؤية الاشتراكات الخاصة" 
ON public.subscriptions FOR SELECT 
USING (student_id IN (
  SELECT id FROM students WHERE user_id = auth.uid()
) OR teacher_id IN (
  SELECT id FROM teachers WHERE user_id = auth.uid()
));

-- إدراج بيانات المراحل الدراسية الأساسية
INSERT INTO public.grades (name, level, description) VALUES
('الصف الأول الابتدائي', 1, 'المرحلة الابتدائية - الصف الأول'),
('الصف الثاني الابتدائي', 2, 'المرحلة الابتدائية - الصف الثاني'),
('الصف الثالث الابتدائي', 3, 'المرحلة الابتدائية - الصف الثالث'),
('الصف الرابع الابتدائي', 4, 'المرحلة الابتدائية - الصف الرابع'),
('الصف الخامس الابتدائي', 5, 'المرحلة الابتدائية - الصف الخامس'),
('الصف السادس الابتدائي', 6, 'المرحلة الابتدائية - الصف السادس'),
('الصف الأول المتوسط', 7, 'المرحلة المتوسطة - الصف الأول'),
('الصف الثاني المتوسط', 8, 'المرحلة المتوسطة - الصف الثاني'),
('الصف الثالث المتوسط', 9, 'المرحلة المتوسطة - الصف الثالث'),
('الصف الأول الثانوي', 10, 'المرحلة الثانوية - الصف الأول'),
('الصف الثاني الثانوي', 11, 'المرحلة الثانوية - الصف الثاني'),
('الصف الثالث الثانوي', 12, 'المرحلة الثانوية - الصف الثالث');

-- إنشاء دالة لإنشاء ملف شخصي تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء محفز لتشغيل الدالة عند إنشاء مستخدم جديد
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة محفزات التحديث للجداول
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at 
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at 
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at 
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at 
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();