-- التحقق من السياسات الحالية وإضافة ما ينقص فقط
-- إضافة سياسة حذف الاختبارات إذا لم تكن موجودة
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quizzes' 
    AND policyname = 'المعلمون يمكنهم حذف اختباراتهم'
  ) THEN
    CREATE POLICY "المعلمون يمكنهم حذف اختباراتهم" 
    ON public.quizzes 
    FOR DELETE 
    USING (teacher_id IN ( 
      SELECT teachers.id
      FROM teachers
      WHERE (teachers.user_id = auth.uid())
    ));
  END IF;
END
$$;

-- إضافة سياسة تحديث أسئلة الاختبارات إذا لم تكن موجودة
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_questions' 
    AND policyname = 'المعلمون يمكنهم تحديث أسئلة اختباراتهم'
  ) THEN
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
  END IF;
END
$$;

-- إضافة سياسة حذف أسئلة الاختبارات إذا لم تكن موجودة
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_questions' 
    AND policyname = 'المعلمون يمكنهم حذف أسئلة اختباراتهم'
  ) THEN
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
  END IF;
END
$$;