-- تحديث القيمة الافتراضية لـ is_approved في جدول teachers
ALTER TABLE public.teachers 
ALTER COLUMN is_approved SET DEFAULT true;

-- إضافة سياسة RLS للسماح بحذف الدروس للمعلمين
CREATE POLICY "المعلمون يمكنهم حذف دروسهم" 
ON public.lessons 
FOR DELETE 
USING (teacher_id IN ( 
  SELECT teachers.id
  FROM teachers
  WHERE (teachers.user_id = auth.uid())
));

-- إضافة سياسة RLS للسماح بحذف الاختبارات للمعلمين
CREATE POLICY "المعلمون يمكنهم حذف اختباراتهم" 
ON public.quizzes 
FOR DELETE 
USING (teacher_id IN ( 
  SELECT teachers.id
  FROM teachers
  WHERE (teachers.user_id = auth.uid())
));

-- إضافة سياسة RLS للسماح بتحديث وحذف أسئلة الاختبارات للمعلمين
CREATE POLICY "المعلمون يمكنهم تحديث أسئلة اختباراتهم" 
ON public.quiz_questions 
FOR UPDATE 
USING (quiz_id IN ( 
  SELECT quizzes.id
  FROM quizzes
  WHERE (quizzes.teacher_id IN ( 
    SELECT teachers.id
    FROM teachers
    WHERE (teachers.user_id = auth.uid())
  ))
));

CREATE POLICY "المعلمون يمكنهم حذف أسئلة اختباراتهم" 
ON public.quiz_questions 
FOR DELETE 
USING (quiz_id IN ( 
  SELECT quizzes.id
  FROM quizzes
  WHERE (quizzes.teacher_id IN ( 
    SELECT teachers.id
    FROM teachers
    WHERE (teachers.user_id = auth.uid())
  ))
));