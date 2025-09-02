import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Download, Play, User, Calendar, GraduationCap } from 'lucide-react';

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

interface LessonViewModalProps {
  lesson: Lesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LessonViewModal: React.FC<LessonViewModalProps> = ({
  lesson,
  open,
  onOpenChange
}) => {
  if (!lesson) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {lesson.title}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {lesson.description}
          </DialogDescription>
          
          {/* Lesson Meta Info */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {lesson.teacher.profile.full_name}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {lesson.teacher.subject}
            </Badge>
            {lesson.grade?.name && (
              <Badge variant="outline" className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {lesson.grade.name}
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(lesson.created_at).toLocaleDateString('ar-SA')}
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Video Section */}
            {lesson.video_url && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  فيديو الدرس
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="aspect-video bg-background rounded-md flex items-center justify-center">
                    <Button asChild size="lg">
                      <a 
                        href={lesson.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Play className="h-5 w-5" />
                        مشاهدة الفيديو
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            {lesson.content && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  محتوى الدرس
                </h3>
                <div className="bg-muted rounded-lg p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {lesson.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Attachment Section */}
            {lesson.attachment_url && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  المرفقات
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <Button asChild variant="outline" size="sm">
                    <a 
                      href={lesson.attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      تحميل المرفق
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!lesson.content && !lesson.video_url && !lesson.attachment_url && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لم يتم إضافة محتوى لهذا الدرس بعد</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LessonViewModal;