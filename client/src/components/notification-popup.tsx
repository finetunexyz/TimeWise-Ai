import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save, X, BarChart3, Settings } from "lucide-react";
import { getCategoryIcon } from "@/lib/utils";

interface NotificationPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenDashboard: () => void;
  onOpenSettings: () => void;
}

// Removed AI interfaces

const CATEGORIES = [
  { id: "work", label: "Work", icon: "fas fa-briefcase", color: "emerald" },
  { id: "learning", label: "Learning", icon: "fas fa-graduation-cap", color: "yellow" },
  { id: "personal", label: "Personal", icon: "fas fa-user", color: "purple" },
  { id: "health", label: "Health", icon: "fas fa-heart", color: "green" },
  { id: "leisure", label: "Leisure", icon: "fas fa-gamepad", color: "blue" },
  { id: "other", label: "Other", icon: "fas fa-plus", color: "gray" },
];

export default function NotificationPopup({ isVisible, onClose, onOpenDashboard, onOpenSettings }: NotificationPopupProps) {
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // Removed AI features
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayString = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        options.push({ value: timeString, label: displayString });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Set default time range (current time - 30 minutes to current time)
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Round to nearest 30-minute interval
    const roundedMinute = currentMinute >= 30 ? 30 : 0;
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${roundedMinute.toString().padStart(2, '0')}`;
    
    // Calculate start time (30 minutes earlier)
    const startDate = new Date(now.getTime() - 30 * 60 * 1000);
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();
    const startRoundedMinute = startMinute >= 30 ? 30 : 0;
    const startTimeString = `${startHour.toString().padStart(2, '0')}:${startRoundedMinute.toString().padStart(2, '0')}`;
    
    setStartTime(startTimeString);
    setEndTime(currentTimeString);
  }, [isVisible]);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Removed AI categorization

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !startTime || !endTime || !selectedCategory) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a category.",
        variant: "destructive",
      });
      return;
    }

    // Validate time range
    if (startTime >= endTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const startDateTime = new Date(`${today}T${startTime}:00`);
      const endDateTime = new Date(`${today}T${endTime}:00`);
      
      // Calculate duration in hours
      const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      
      console.log("Submitting activity:", {
        description: description.trim(),
        category: selectedCategory,
        duration: durationHours,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
      
      const response = await apiRequest("POST", "/api/activities", {
        description: description.trim(),
        category: selectedCategory,
        duration: durationHours,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });

      console.log("Activity created:", response);

      toast({
        title: "Activity saved!",
        description: "Your activity has been logged successfully.",
      });

      // Reset form and refresh the page/dashboard
      setDescription("");
      setStartTime("");
      setEndTime("");
      setSelectedCategory("");
      // Form reset complete
      
      // Trigger a refresh of activities data if on dashboard
      if (typeof window !== 'undefined' && window.location.pathname === '/dashboard') {
        window.location.reload();
      }
      
      onClose();
    } catch (error) {
      console.error("Failed to save activity:", error);
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-top-2 duration-300 bg-gray-900 border-gray-700">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 rounded-t-lg border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white" data-testid="notification-title">Time Check!</h2>
            </div>
            <span className="text-sm opacity-90 text-gray-300" data-testid="current-time">{currentTime}</span>
          </div>
          <p className="text-sm opacity-90 text-gray-300">What have you been working on?</p>
        </CardHeader>

        <CardContent className="p-4 bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activity Input */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-200">
                Activity Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Working on project proposal"
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                data-testid="input-description"
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time" className="text-sm font-medium text-gray-200">
                  Start Time
                </Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger className="mt-2 bg-gray-800 border-gray-600 text-white" data-testid="select-start-time">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="end-time" className="text-sm font-medium text-gray-200">
                  End Time
                </Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger className="mt-2 bg-gray-800 border-gray-600 text-white" data-testid="select-end-time">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-200">
                Category
              </Label>
              
              {/* Category Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? `bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400 shadow-lg`
                        : `bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:border-gray-500`
                    }`}
                    data-testid={`button-category-${category.id}`}
                  >
                    <i className={`${category.icon} mr-2`}></i>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-none"
                disabled={isSubmitting}
                data-testid="button-save"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Activity"}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                data-testid="button-dismiss"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex justify-between text-sm pt-4 border-t border-gray-700 mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenDashboard}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
              data-testid="button-dashboard"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              View Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenSettings}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
