import React, { useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Heart,
  MessageCircle,
  Share2,
  Hash,
  Play,
  BookOpen,
  Calendar,
  Users,
  Pin,
  MoreHorizontal,
  Camera,
  Video,
  FileText,
  Send,
  Upload,
  X,
  Loader2
} from 'lucide-react';

interface Post {
  id: string;
  type: 'text' | 'image' | 'video' | 'lesson';
  title?: string;
  content: string;
  author: string;
  authorRole: string;
  avatar: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  hashtags: string[];
  media?: string;
  isPinned?: boolean;
  lessonDetails?: {
    subject: string;
    grade: string;
    duration: string;
  };
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

const SchoolNewsFeed = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      type: 'lesson',
      title: 'درس الرياضيات - الجبر المتقدم',
      content: 'شرح مفصل لموضوع الجبر المتقدم للصف الثالث الثانوي مع أمثلة تطبيقية وتمارين متنوعة',
      author: 'أ. محمد أحمد',
      authorRole: 'مدرس الرياضيات',
      avatar: '/api/placeholder/40/40',
      timestamp: 'منذ ساعتين',
      likes: 24,
      comments: 8,
      shares: 5,
      hashtags: ['رياضيات', 'جبر', 'ثالث_ثانوي', 'تعليم'],
      isPinned: true,
      lessonDetails: {
        subject: 'الرياضيات',
        grade: 'الثالث الثانوي',
        duration: '45 دقيقة'
      }
    },
    {
      id: '2',
      type: 'image',
      title: 'احتفالية اليوم الوطني',
      content: 'مشاركة طلابنا في احتفالية اليوم الوطني السعودي 94 مع أجمل العروض والفعاليات التراثية',
      author: 'إدارة المدرسة',
      authorRole: 'الإدارة',
      avatar: '/api/placeholder/40/40',
      timestamp: 'منذ 3 ساعات',
      likes: 45,
      comments: 12,
      shares: 8,
      hashtags: ['اليوم_الوطني', 'السعودية', 'احتفال', 'طلاب'],
      media: '/api/placeholder/600/400'
    },
    {
      id: '3',
      type: 'video',
      content: 'شرح تجربة علمية شيقة في مختبر الكيمياء - تفاعل الأحماض والقواعد مع المؤشرات الطبيعية',
      author: 'أ. فاطمة سالم',
      authorRole: 'مدرسة الكيمياء',
      avatar: '/api/placeholder/40/40',
      timestamp: 'منذ 5 ساعات',
      likes: 18,
      comments: 6,
      shares: 3,
      hashtags: ['كيمياء', 'تجربة', 'علوم', 'مختبر'],
      media: '/api/placeholder/600/300'
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      postId: '1',
      author: 'أحمد محمد',
      content: 'شرح ممتاز ومفيد جداً، شكراً لك أستاذ',
      timestamp: 'منذ ساعة',
      likes: 3
    }
  ]);

  const [newPost, setNewPost] = useState({
    type: 'text' as 'text' | 'image' | 'video' | 'lesson',
    title: '',
    content: '',
    hashtags: '',
    mediaFile: null as File | null,
    mediaPreview: ''
  });

  const [showNewPost, setShowNewPost] = useState(false);
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const bucketName = file.type.startsWith('video/') ? 'school-videos' : 'school-images';
      const filePath = `${bucketName}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error('فشل في رفع الملف');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('فشل في رفع الملف');
      return null;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
      return;
    }

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast.error('يُسمح فقط برفع الصور والفيديوهات');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewPost(prev => ({
        ...prev,
        mediaFile: file,
        mediaPreview: e.target?.result as string,
        type: isImage ? 'image' : 'video'
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedFile = () => {
    setNewPost(prev => ({
      ...prev,
      mediaFile: null,
      mediaPreview: '',
      type: 'text'
    }));
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;

    setIsUploading(true);

    try {
      let mediaUrl = '';
      
      // Upload file if exists
      if (newPost.mediaFile) {
        const uploadedUrl = await uploadFile(newPost.mediaFile);
        if (!uploadedUrl) {
          setIsUploading(false);
          return;
        }
        mediaUrl = uploadedUrl;
      }

      const hashtags = newPost.hashtags
        .split(' ')
        .filter(tag => tag.startsWith('#'))
        .map(tag => tag.substring(1));

      const post: Post = {
        id: Date.now().toString(),
        type: newPost.type,
        title: newPost.title || undefined,
        content: newPost.content,
        author: 'أ. سارة الأحمد',
        authorRole: 'مدير المدرسة',
        avatar: '/api/placeholder/40/40',
        timestamp: 'الآن',
        likes: 0,
        comments: 0,
        shares: 0,
        hashtags: hashtags.length > 0 ? hashtags : [],
        media: mediaUrl || undefined,
        lessonDetails: newPost.type === 'lesson' ? {
          subject: 'عام',
          grade: 'جميع الصفوف',
          duration: '30 دقيقة'
        } : undefined
      };

      setPosts([post, ...posts]);
      setNewPost({ type: 'text', title: '', content: '', hashtags: '', mediaFile: null, mediaPreview: '' });
      setShowNewPost(false);
      toast.success('تم نشر المنشور بنجاح');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('فشل في إنشاء المنشور');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      author: 'ولي أمر',
      content: newComment,
      timestamp: 'الآن',
      likes: 0
    };

    setComments([...comments, comment]);
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
    setNewComment('');
  };

  const renderPost = (post: Post) => (
    <Card key={post.id} className="mb-6 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.avatar} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h4 className="font-semibold text-foreground">{post.author}</h4>
                {post.isPinned && <Pin className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{post.authorRole}</p>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {post.title && (
          <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
        )}
        
        <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

        {post.type === 'lesson' && post.lessonDetails && (
          <div className="bg-gradient-primary/10 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">تفاصيل الدرس</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">المادة: </span>
                <span className="font-medium">{post.lessonDetails.subject}</span>
              </div>
              <div>
                <span className="text-muted-foreground">الصف: </span>
                <span className="font-medium">{post.lessonDetails.grade}</span>
              </div>
              <div>
                <span className="text-muted-foreground">المدة: </span>
                <span className="font-medium">{post.lessonDetails.duration}</span>
              </div>
            </div>
          </div>
        )}

        {post.media && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {post.type === 'image' ? (
              <img src={post.media} alt="صورة المنشور" className="w-full h-auto" />
            ) : post.type === 'video' ? (
              <div className="relative bg-muted rounded-lg aspect-video flex items-center justify-center">
                <Play className="w-16 h-16 text-primary" />
                <span className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  فيديو تعليمي
                </span>
              </div>
            ) : null}
          </div>
        )}

        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.hashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                <Hash className="w-3 h-3 ml-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(post.id)}
              className="text-muted-foreground hover:text-red-500"
            >
              <Heart className="w-4 h-4 ml-1" />
              {post.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveComments(activeComments === post.id ? null : post.id)}
              className="text-muted-foreground hover:text-blue-500"
            >
              <MessageCircle className="w-4 h-4 ml-1" />
              {post.comments}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-green-500"
            >
              <Share2 className="w-4 h-4 ml-1" />
              {post.shares}
            </Button>
          </div>
        </div>

        {activeComments === post.id && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="space-y-3 mb-4">
              {comments
                .filter(comment => comment.postId === post.id)
                .map(comment => (
                  <div key={comment.id} className="flex space-x-3 rtl:space-x-reverse">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Input
                placeholder="اكتب تعليقك..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
              />
              <Button onClick={() => handleComment(post.id)} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">آخر أخبار المدرسة</h1>
        <p className="text-muted-foreground">
          تابع أحدث الأخبار والدروس والفعاليات من مدرستك
        </p>
      </div>

      {/* Create Post Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {!showNewPost ? (
            <Button
              onClick={() => setShowNewPost(true)}
              variant="outline"
              className="w-full justify-start text-muted-foreground"
            >
              ما الجديد الذي تريد مشاركته؟
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex space-x-2 rtl:space-x-reverse mb-4">
                <Button
                  variant={newPost.type === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewPost({ ...newPost, type: 'text' })}
                >
                  <FileText className="w-4 h-4 ml-1" />
                  نص
                </Button>
                <input
                  type="file"
                  id="media-upload"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('media-upload')?.click()}
                >
                  <Upload className="w-4 h-4 ml-1" />
                  رفع ملف
                </Button>
                <Button
                  variant={newPost.type === 'lesson' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewPost({ ...newPost, type: 'lesson' })}
                >
                  <BookOpen className="w-4 h-4 ml-1" />
                  درس
                </Button>
              </div>

              {/* Media Preview */}
              {newPost.mediaPreview && (
                <div className="relative mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeSelectedFile}
                    className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  {newPost.type === 'image' ? (
                    <img 
                      src={newPost.mediaPreview} 
                      alt="معاينة الصورة" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <video 
                      src={newPost.mediaPreview} 
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                    />
                  )}
                </div>
              )}

              {newPost.type === 'lesson' && (
                <Input
                  placeholder="عنوان الدرس..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              )}

              <Textarea
                placeholder="اكتب محتوى المنشور..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={4}
              />

              <Input
                placeholder="أضف هاشتاج (#رياضيات #علوم)..."
                value={newPost.hashtags}
                onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
              />

              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => setShowNewPost(false)}
                  disabled={isUploading}
                >
                  إلغاء
                </Button>
                <Button onClick={handleCreatePost} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                      جاري النشر...
                    </>
                  ) : (
                    'نشر'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div>
        {posts.map(renderPost)}
      </div>
    </div>
  );
};

export default SchoolNewsFeed;