import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeChart from "@/components/time-chart";
import TimelineView from "@/components/timeline-view";
import SettingsModal from "@/components/settings-modal";
import { formatDuration, getCategoryColor, getCategoryIcon } from "@/lib/utils";
import { 
  Clock, 
  Briefcase, 
  User, 
  Heart, 
  GraduationCap, 
  Gamepad2, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Home,
  Brain,
  Target,
  Scale,
  Lightbulb,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface DashboardProps {
  onNavigateToHome: () => void;
}

export default function Dashboard({ onNavigateToHome }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'timeline'>('chart');

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities", selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/activities?date=${selectedDate}`);
      return response.json();
    },
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats", selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/stats?date=${selectedDate}`);
      return response.json();
    },
  });

  const { data: insights } = useQuery({
    queryKey: ["/api/analytics/insights"],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/insights`);
      return response.json();
    },
  });

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    const today = new Date().toISOString().split('T')[0];
    
    if (selectedDate === today) {
      return "Today";
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate === yesterday.toISOString().split('T')[0]) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  if (activitiesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateToHome}
                    data-testid="button-back-home"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </div>
                <h1 className="text-3xl font-bold text-foreground">TimeTracker Pro Dashboard</h1>
                <p className="text-muted-foreground">Track, analyze, and optimize your daily productivity</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Productivity Score */}
                {stats && (
                  <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                    <CardContent className="p-4">
                      <div className="text-sm opacity-90">Productivity Score</div>
                      <div className="text-2xl font-bold" data-testid="productivity-score">
                        {stats.productivityScore}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Date Selector */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateChange('prev')}
                    data-testid="button-prev-date"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-foreground min-w-32 text-center" data-testid="selected-date">
                    {formatSelectedDate()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateChange('next')}
                    disabled={selectedDate >= new Date().toISOString().split('T')[0]}
                    data-testid="button-next-date"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  data-testid="button-settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Time</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-total-time">
                      {formatDuration(stats.totalTime)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Work Time</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-work-time">
                      {formatDuration(stats.workTime)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Gamepad2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Leisure Time</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-leisure-time">
                      {formatDuration(stats.leisureTime)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Learning</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-learning-time">
                      {formatDuration(stats.learningTime)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 24-Hour Chart/Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>24-Hour Overview</CardTitle>
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'chart' | 'timeline')}>
                  <TabsList>
                    <TabsTrigger value="chart" data-testid="tab-chart">Chart</TabsTrigger>
                    <TabsTrigger value="timeline" data-testid="tab-timeline">Timeline</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'chart' ? (
                <TimeChart activities={activities} />
              ) : (
                <TimelineView activities={activities} />
              )}
              
              {/* Legend */}
              {activities.length > 0 && viewMode === 'chart' && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {Array.from(new Set(activities.map(a => a.category))).map(category => {
                    const totalTime = activities
                      .filter(a => a.category === category)
                      .reduce((sum, a) => sum + a.duration, 0);
                    
                    return (
                      <div key={category} className="flex items-center" data-testid={`legend-${category}`}>
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: getCategoryColor(category) }}
                        ></div>
                        <span className="text-sm text-muted-foreground capitalize">
                          {category} ({formatDuration(totalTime)})
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center text-muted-foreground py-8" data-testid="no-activities">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activities logged for this date</p>
                  <p className="text-sm">Start tracking your time to see insights</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(new Set(activities.map(a => a.category))).map(category => {
                    const categoryActivities = activities.filter(a => a.category === category);
                    const totalTime = categoryActivities.reduce((sum, a) => sum + a.duration, 0);
                    const percentage = stats ? (totalTime / stats.totalTime) * 100 : 0;
                    
                    return (
                      <div key={category} className="space-y-2" data-testid={`category-${category}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <i 
                              className={`${getCategoryIcon(category)} text-sm`}
                              style={{ color: getCategoryColor(category) }}
                            ></i>
                            <span className="font-medium capitalize">{category}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(totalTime)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              backgroundColor: getCategoryColor(category),
                              width: `${percentage}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {categoryActivities.length} {categoryActivities.length === 1 ? 'activity' : 'activities'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights && insights.insights ? (
                <div className="space-y-4">
                  {insights.insights.slice(0, 3).map((insight: string, index: number) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200" data-testid={`insight-${index}`}>
                      <div className="flex items-start">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-sm text-blue-900">{insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8" data-testid="no-insights">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No insights available</p>
                  <p className="text-sm">Log more activities to get AI-powered insights</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`/api/export?format=csv`, '_blank')}
                data-testid="button-export-csv"
              >
                <i className="fas fa-file-csv mr-2"></i>
                Export as CSV
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`/api/export?format=json`, '_blank')}
                data-testid="button-export-json"
              >
                <i className="fas fa-file-code mr-2"></i>
                Export as JSON
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowSettings(true)}
                data-testid="button-settings-2"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
}
