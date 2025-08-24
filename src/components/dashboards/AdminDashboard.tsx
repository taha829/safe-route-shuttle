import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { 
  Users, 
  Bus, 
  DollarSign, 
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Settings,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import trackingImage from '@/assets/tracking-map.jpg';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.totalStudents'),
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: t('dashboard.activebuses'),
      value: '45',
      change: '+3',
      icon: Bus,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: t('dashboard.totalRevenue'),
      value: '$89,247',
      change: '+8.2%',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Efficiency',
      value: '96.3%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      message: 'Bus #12 reported mechanical issue',
      type: 'warning',
      time: '2 minutes ago',
      priority: 'high'
    },
    {
      id: 2,
      message: 'New student registration: Ahmed Ali',
      type: 'info',
      time: '15 minutes ago',
      priority: 'medium'
    },
    {
      id: 3,
      message: 'Route optimization completed for District 3',
      type: 'success',
      time: '1 hour ago',
      priority: 'low'
    },
    {
      id: 4,
      message: 'Payment overdue: Al-Noor School',
      type: 'warning',
      time: '3 hours ago',
      priority: 'high'
    }
  ];

  const busStatus = [
    { id: 'Bus #01', status: 'active', students: 28, route: 'North District', driver: 'Ahmed Hassan' },
    { id: 'Bus #12', status: 'maintenance', students: 0, route: 'City Center', driver: 'Omar Abdullah' },
    { id: 'Bus #07', status: 'active', students: 32, route: 'South Zone', driver: 'Fatima Al-Zahra' },
    { id: 'Bus #19', status: 'active', students: 24, route: 'East Area', driver: 'Maryam Said' },
    { id: 'Bus #23', status: 'inactive', students: 0, route: 'West District', driver: 'Hassan Ali' }
  ];

  const recentTransactions = [
    { school: 'Al-Noor International School', amount: '$2,450', status: 'paid', date: '2024-01-15' },
    { school: 'Green Valley Academy', amount: '$1,890', status: 'pending', date: '2024-01-14' },
    { school: 'Future Leaders School', amount: '$3,200', status: 'paid', date: '2024-01-13' },
    { school: 'Bright Minds Institute', amount: '$1,650', status: 'overdue', date: '2024-01-10' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-bus">
        <h1 className="text-3xl font-bold mb-2">
          System Overview 📊
        </h1>
        <p className="text-lg opacity-90 mb-6">
          Comprehensive control panel for SafeRoute transportation system
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="glass" size="lg">
            <PlusCircle className="w-5 h-5" />
            Add New School
          </Button>
          <Button variant="glass" size="lg">
            <Bus className="w-5 h-5" />
            Fleet Management
          </Button>
          <Button variant="glass" size="lg">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Button>
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
                    <p className="text-xs text-success font-medium mt-1">
                      {stat.change} from last month
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Overview Map */}
        <Card className="lg:col-span-2 shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Fleet Overview</span>
            </CardTitle>
            <CardDescription>
              Real-time tracking of all active buses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={trackingImage} 
                alt="Fleet tracking overview" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4 space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/90 dark:bg-black/90 px-3 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-success rounded-full animate-tracking" />
                  <span className="text-sm font-medium">42 Active Buses</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/90 dark:bg-black/90 px-3 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-warning rounded-full" />
                  <span className="text-sm font-medium">3 Maintenance</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {busStatus.map((bus, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      bus.status === 'active' 
                        ? 'bg-success text-success-foreground' 
                        : bus.status === 'maintenance'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{bus.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {bus.route} • {bus.driver}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {bus.students} students
                    </p>
                    <p className={`text-xs capitalize ${
                      bus.status === 'active' ? 'text-success' : 
                      bus.status === 'maintenance' ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {bus.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>System Alerts</span>
            </CardTitle>
            <CardDescription>
              Recent notifications and issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' 
                    ? 'border-warning bg-warning/10' 
                    : alert.type === 'success'
                    ? 'border-success bg-success/10'
                    : 'border-secondary bg-secondary/10'
                } ${alert.priority === 'high' ? 'shadow-md' : ''}`}
              >
                <p className="text-sm font-medium text-foreground">
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.time}
                </p>
              </div>
            ))}
            <Button variant="admin" className="w-full">
              <AlertTriangle className="w-4 h-4" />
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card className="shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <DollarSign className="w-5 h-5 text-success" />
            <span>Financial Overview</span>
          </CardTitle>
          <CardDescription>
            Recent transactions and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">School</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium text-foreground">{transaction.school}</td>
                    <td className="p-3 text-foreground">{transaction.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'paid' 
                          ? 'bg-success/10 text-success' 
                          : transaction.status === 'pending'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing 4 of 156 transactions
            </p>
            <Button variant="admin">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;