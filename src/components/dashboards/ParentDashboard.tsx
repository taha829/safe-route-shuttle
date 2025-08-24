import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { 
  Users, 
  Bus, 
  MapPin, 
  Clock, 
  CreditCard, 
  Bell,
  CheckCircle,
  AlertTriangle,
  Navigation
} from 'lucide-react';
import heroImage from '@/assets/hero-bus.jpg';
import trackingImage from '@/assets/tracking-map.jpg';

const ParentDashboard: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.totalStudents'),
      value: '2',
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: t('dashboard.activebuses'),
      value: '1',
      icon: Bus,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: t('dashboard.todayPickups'),
      value: '4',
      icon: Clock,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Payment Status',
      value: 'Paid',
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  const busUpdates = [
    {
      time: '07:45 AM',
      message: 'Bus #12 approaching pickup location',
      type: 'info',
      icon: Navigation
    },
    {
      time: '07:30 AM',
      message: 'Ahmed boarded Bus #12',
      type: 'success',
      icon: CheckCircle
    },
    {
      time: '03:20 PM',
      message: 'Fatima dropped off safely',
      type: 'success',
      icon: CheckCircle
    },
    {
      time: '03:15 PM',
      message: 'Bus #12 delayed by 5 minutes',
      type: 'warning',
      icon: AlertTriangle
    }
  ];

  const children = [
    {
      name: 'Ahmed Ali',
      grade: 'Grade 8',
      bus: 'Bus #12',
      status: 'On Bus',
      statusColor: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      name: 'Fatima Ali',
      grade: 'Grade 5',
      bus: 'Bus #12',
      status: 'At School',
      statusColor: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero/80" />
        <div className="relative p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {t('dashboard.welcome')} 👋
          </h1>
          <p className="text-lg opacity-90">
            Keep track of your children's safe journey to and from school
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="glass" size="lg">
              <MapPin className="w-5 h-5" />
              {t('nav.tracking')}
            </Button>
            <Button variant="glass" size="lg">
              <Bell className="w-5 h-5" />
              Notifications
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card-custom hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Tracking */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{t('tracking.title')}</span>
            </CardTitle>
            <CardDescription>
              {t('tracking.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={trackingImage} 
                alt="Bus tracking map" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/90 dark:bg-black/90 px-3 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-success rounded-full animate-tracking" />
                  <span className="text-sm font-medium">{t('tracking.onRoute')}</span>
                </div>
              </div>
            </div>
            <Button variant="tracking" className="w-full">
              <Navigation className="w-4 h-4" />
              View Full Map
            </Button>
          </CardContent>
        </Card>

        {/* Children Status */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-5 h-5 text-success" />
              <span>My Children</span>
            </CardTitle>
            <CardDescription>
              Current status and location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {children.map((child, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{child.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {child.grade} • {child.bus}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${child.bgColor} ${child.statusColor}`}>
                  {child.status}
                </div>
              </div>
            ))}
            <Button variant="parent" className="w-full mt-4">
              <Users className="w-4 h-4" />
              Manage Children
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card className="shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Bell className="w-5 h-5 text-warning" />
            <span>Recent Updates</span>
          </CardTitle>
          <CardDescription>
            Latest notifications about your children's journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {busUpdates.map((update, index) => {
              const Icon = update.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start space-x-3 rtl:space-x-reverse p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className={`p-2 rounded-lg ${
                    update.type === 'success' 
                      ? 'bg-success/10 text-success' 
                      : update.type === 'warning'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-secondary/10 text-secondary'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {update.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {update.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentDashboard;