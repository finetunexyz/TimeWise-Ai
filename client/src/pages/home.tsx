import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationPopup from "@/components/notification-popup";

import SettingsModal from "@/components/settings-modal";
import { useNotifications } from "@/hooks/use-notifications";
import { useToast } from "@/hooks/use-toast";
import { Clock, Bell, BellOff, BarChart3, Settings } from "lucide-react";
import logoImage from "@/assets/logo.png";

interface HomeProps {
  onNavigateToDashboard: () => void;
}

export default function Home({ onNavigateToDashboard }: HomeProps) {
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isEnabled, requestPermission, showActivityReminder } = useNotifications();
  const { toast } = useToast();

  const handleEnableNotifications = async () => {
    await requestPermission();
  };

  const handleTestNotification = () => {
    setShowNotificationPopup(true);
    showActivityReminder();
    toast({
      title: "Test notification sent",
      description: "Check your browser notifications and popup!",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logoImage} alt="TimeWise Logo" className="w-10 h-10" />
            <h1 className="text-4xl font-bold text-foreground">TimeWise</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Smart hourly check-ins that visualize your day, track your productivity, and help you make every hour count.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Quick Log</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Log an activity that just happened
              </p>
              <Button 
                onClick={() => setShowNotificationPopup(true)} 
                className="w-full"
                data-testid="button-quick-log"
              >
                Log Activity
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>My Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View your time tracking dashboard
              </p>
              <Button 
                onClick={onNavigateToDashboard} 
                className="w-full"
                data-testid="button-view-dashboard"
              >
                My TimeWise Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {isEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                <span>Hourly Check-ins</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Smart hourly check-ins help you track time effectively
              </p>
              <div className="space-y-2">
                {!isEnabled && (
                  <Button 
                    onClick={handleEnableNotifications} 
                    className="w-full"
                    data-testid="button-enable-notifications"
                  >
                    Enable Hourly Reminders
                  </Button>
                )}
                <Button 
                  onClick={handleTestNotification} 
                  variant="outline" 
                  className="w-full"
                  data-testid="button-test-notification"
                >
                  Test Hourly Reminder
                </Button>
                {isEnabled && (
                  <p className="text-xs text-green-400 text-center">✓ Browser notifications enabled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How TimeWise Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto">
                  1
                </div>
                <div>
                  <p className="font-medium">Enable Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get hourly reminders to log your activities
                  </p>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto">
                  2
                </div>
                <div>
                  <p className="font-medium">Log Activities</p>
                  <p className="text-sm text-muted-foreground">
                    Track what you're working on when prompted
                  </p>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto">
                  3
                </div>
                <div>
                  <p className="font-medium">Analyze & Optimize</p>
                  <p className="text-sm text-muted-foreground">
                    View insights to make every hour count
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <NotificationPopup
          isVisible={showNotificationPopup}
          onClose={() => setShowNotificationPopup(false)}
          onOpenDashboard={onNavigateToDashboard}
          onOpenSettings={() => setShowSettings(true)}
        />
        
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
}
