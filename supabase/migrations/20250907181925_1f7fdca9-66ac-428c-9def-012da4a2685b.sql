-- Create storage buckets for school media
INSERT INTO storage.buckets (id, name, public) VALUES ('school-images', 'school-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('school-videos', 'school-videos', true);

-- Create policies for school images bucket
CREATE POLICY "الجميع يمكنهم رؤية صور المدرسة" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'school-images');

CREATE POLICY "المستخدمون يمكنهم رفع صور المدرسة" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'school-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "المستخدمون يمكنهم حذف صورهم" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'school-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for school videos bucket
CREATE POLICY "الجميع يمكنهم رؤية فيديوهات المدرسة" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'school-videos');

CREATE POLICY "المستخدمون يمكنهم رفع فيديوهات المدرسة" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'school-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "المستخدمون يمكنهم حذف فيديوهاتهم" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'school-videos' AND auth.uid()::text = (storage.foldername(name))[1]);