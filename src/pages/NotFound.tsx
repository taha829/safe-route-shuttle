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
          <h2 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h2>
          <p className="text-xl text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="bus" 
            size="lg"
            onClick={() => window.location.href = "/"}
            className="mr-4"
          >
            Return to Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
        
        <div className="mt-12 p-6 glass-card rounded-2xl max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
