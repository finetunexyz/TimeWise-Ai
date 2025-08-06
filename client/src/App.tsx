import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useHourlyNotifications } from "@/hooks/use-hourly-notifications";
import NotificationPopup from "@/components/notification-popup";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const { isNotificationVisible, setIsNotificationVisible } = useHourlyNotifications();

  return (
    <>
      <Switch>
        <Route path="/" component={() => 
          currentView === 'home' ? (
            <Home onNavigateToDashboard={() => setCurrentView('dashboard')} />
          ) : (
            <Dashboard onNavigateToHome={() => setCurrentView('home')} />
          )
        } />
        <Route path="/dashboard" component={() => 
          <Dashboard onNavigateToHome={() => setCurrentView('home')} />
        } />
        <Route component={NotFound} />
      </Switch>
      
      <NotificationPopup
        isVisible={isNotificationVisible}
        onClose={() => setIsNotificationVisible(false)}
        onOpenDashboard={() => {
          setIsNotificationVisible(false);
          setCurrentView('dashboard');
        }}
        onOpenSettings={() => {
          setIsNotificationVisible(false);
          // Settings functionality can be added later
        }}
      />
    </>
  );
}

function App() {
  // Apply dark mode globally
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
