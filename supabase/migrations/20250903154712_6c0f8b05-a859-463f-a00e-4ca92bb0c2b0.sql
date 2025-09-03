-- إنشاء جدول للحافلات ومسارات النقل
CREATE TABLE public.buses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_number TEXT NOT NULL UNIQUE,
  captain_id UUID REFERENCES public.profiles(user_id) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 30,
  license_plate TEXT,
  current_location JSONB, -- {lat: number, lng: number}
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'maintenance', 'emergency')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول للطلاب المسجلين في النقل المدرسي
CREATE TABLE public.bus_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) NOT NULL,
  bus_id UUID REFERENCES public.buses(id) NOT NULL,
  pickup_location JSONB NOT NULL, -- {lat: number, lng: number, address: string}
  dropoff_location JSONB, -- {lat: number, lng: number, address: string}
  pickup_time TIME,
  current_status TEXT NOT NULL DEFAULT 'waiting' CHECK (current_status IN ('waiting', 'picked_up', 'dropped_off', 'absent')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, bus_id)
);

-- إنشاء جدول لتتبع رحلات الحافلة
CREATE TABLE public.bus_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES public.buses(id) NOT NULL,
  trip_date DATE NOT NULL DEFAULT CURRENT_DATE,
  trip_type TEXT NOT NULL CHECK (trip_type IN ('morning', 'afternoon')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  route_data JSONB, -- مسار الرحلة والمحطات
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول لتتبع حضور الطلاب في كل رحلة
CREATE TABLE public.student_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.bus_trips(id) NOT NULL,
  student_id UUID REFERENCES public.students(id) NOT NULL,
  pickup_time TIMESTAMP WITH TIME ZONE,
  dropoff_time TIMESTAMP WITH TIME ZONE,
  pickup_location JSONB,
  dropoff_location JSONB,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'picked_up', 'dropped_off')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, student_id)
);

-- تفعيل Row Level Security
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للحافلات
CREATE POLICY "الكابتن يمكنه رؤية حافلته" ON public.buses
FOR SELECT USING (captain_id = auth.uid());

CREATE POLICY "الكابتن يمكنه تحديث حافلته" ON public.buses
FOR UPDATE USING (captain_id = auth.uid());

-- سياسات الأمان لطلاب الحافلة
CREATE POLICY "الكابتن يمكنه رؤية طلاب حافلته" ON public.bus_students
FOR SELECT USING (
  bus_id IN (
    SELECT id FROM public.buses WHERE captain_id = auth.uid()
  )
);

CREATE POLICY "الطالب يمكنه رؤية معلومات حافلته" ON public.bus_students
FOR SELECT USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);

-- سياسات الأمان لرحلات الحافلة
CREATE POLICY "الكابتن يمكنه إدارة رحلات حافلته" ON public.bus_trips
FOR ALL USING (
  bus_id IN (
    SELECT id FROM public.buses WHERE captain_id = auth.uid()
  )
);

-- سياسات الأمان لحضور الطلاب
CREATE POLICY "الكابتن يمكنه إدارة حضور طلاب حافلته" ON public.student_attendance
FOR ALL USING (
  trip_id IN (
    SELECT bt.id FROM public.bus_trips bt
    JOIN public.buses b ON bt.bus_id = b.id
    WHERE b.captain_id = auth.uid()
  )
);

CREATE POLICY "الطالب يمكنه رؤية سجل حضوره" ON public.student_attendance
FOR SELECT USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_buses_updated_at
BEFORE UPDATE ON public.buses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bus_students_updated_at
BEFORE UPDATE ON public.bus_students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bus_trips_updated_at
BEFORE UPDATE ON public.bus_trips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_attendance_updated_at
BEFORE UPDATE ON public.student_attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- إدراج بيانات تجريبية للحافلات
INSERT INTO public.buses (bus_number, captain_id, capacity, license_plate, current_location, status) VALUES 
('101', (SELECT user_id FROM public.profiles WHERE role = 'student' LIMIT 1), 30, 'ح أ ب 1234', '{"lat": 24.7136, "lng": 46.6753}', 'active');

-- إدراج بيانات تجريبية لطلاب النقل
INSERT INTO public.bus_students (student_id, bus_id, pickup_location, pickup_time, current_status) 
SELECT 
  s.id,
  (SELECT id FROM public.buses LIMIT 1),
  '{"lat": 24.7136, "lng": 46.6753, "address": "حي النور الشمالي"}',
  '07:00:00',
  'waiting'
FROM public.students s LIMIT 5;