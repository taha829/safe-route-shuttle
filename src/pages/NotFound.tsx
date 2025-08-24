import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">الصفحة غير موجودة</h2>
          <p className="text-xl text-muted-foreground mb-8">
            الصفحة المطلوبة غير موجودة أو تم نقلها إلى مكان آخر
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="bus" 
            size="lg"
            onClick={() => window.location.href = "/"}
            className="mr-4"
          >
            العودة للوحة التحكم
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
          >
            الرجوع للخلف
          </Button>
        </div>
        
        <div className="mt-12 p-6 glass-card rounded-2xl max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            تحتاج مساعدة؟
          </h3>
          <p className="text-sm text-muted-foreground">
            إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم الفني
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
