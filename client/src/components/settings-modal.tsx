import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Settings, Download, Upload, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [formData, setFormData] = useState({
    hourlyReminders: true,
    weekendNotifications: false,
    soundNotifications: true,
    workStart: "09:00",
    workEnd: "17:00",
    aiCategorization: true,
    aiInsights: true,
    aiSuggestions: true,
  });
  
  const { toast } = useToast();

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    enabled: isOpen,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", "/api/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        hourlyReminders: (settings as any).hourlyReminders === "true",
        weekendNotifications: (settings as any).weekendNotifications === "true",
        soundNotifications: (settings as any).soundNotifications === "true",
        workStart: (settings as any).workStart || "09:00",
        workEnd: (settings as any).workEnd || "17:00",
        aiCategorization: (settings as any).aiCategorization === "true",
        aiInsights: (settings as any).aiInsights === "true",
        aiSuggestions: (settings as any).aiSuggestions === "true",
      });
    }
  }, [settings]);

  const handleSave = () => {
    const settingsData = {
      hourlyReminders: formData.hourlyReminders ? "true" : "false",
      weekendNotifications: formData.weekendNotifications ? "true" : "false",
      soundNotifications: formData.soundNotifications ? "true" : "false",
      workStart: formData.workStart,
      workEnd: formData.workEnd,
      aiCategorization: formData.aiCategorization ? "true" : "false",
      aiInsights: formData.aiInsights ? "true" : "false",
      aiSuggestions: formData.aiSuggestions ? "true" : "false",
    };
    
    saveSettingsMutation.mutate(settingsData);
  };

  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/export?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetracker-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export complete",
        description: `Data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      toast({
        title: "Data cleared",
        description: "All activity data has been cleared.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto" data-testid="settings-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notification Settings */}
          <div>
            <h3 className="font-medium mb-4">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="hourly-reminders" className="text-sm">
                  Enable hourly reminders
                </Label>
                <Switch
                  id="hourly-reminders"
                  checked={formData.hourlyReminders}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hourlyReminders: checked }))
                  }
                  data-testid="switch-hourly-reminders"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="weekend-notifications" className="text-sm">
                  Weekend notifications
                </Label>
                <Switch
                  id="weekend-notifications"
                  checked={formData.weekendNotifications}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, weekendNotifications: checked }))
                  }
                  data-testid="switch-weekend-notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-notifications" className="text-sm">
                  Sound notifications
                </Label>
                <Switch
                  id="sound-notifications"
                  checked={formData.soundNotifications}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, soundNotifications: checked }))
                  }
                  data-testid="switch-sound-notifications"
                />
              </div>
            </div>
          </div>

          {/* Work Hours */}
          <div>
            <h3 className="font-medium mb-4">Work Hours</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="work-start" className="text-sm">Start Time</Label>
                <Input
                  id="work-start"
                  type="time"
                  value={formData.workStart}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, workStart: e.target.value }))
                  }
                  data-testid="input-work-start"
                />
              </div>
              <div>
                <Label htmlFor="work-end" className="text-sm">End Time</Label>
                <Input
                  id="work-end"
                  type="time"
                  value={formData.workEnd}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, workEnd: e.target.value }))
                  }
                  data-testid="input-work-end"
                />
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div>
            <h3 className="font-medium mb-4">AI Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-categorization" className="text-sm">
                  Auto-categorization
                </Label>
                <Switch
                  id="ai-categorization"
                  checked={formData.aiCategorization}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, aiCategorization: checked }))
                  }
                  data-testid="switch-ai-categorization"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-insights" className="text-sm">
                  Productivity insights
                </Label>
                <Switch
                  id="ai-insights"
                  checked={formData.aiInsights}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, aiInsights: checked }))
                  }
                  data-testid="switch-ai-insights"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-suggestions" className="text-sm">
                  Smart suggestions
                </Label>
                <Switch
                  id="ai-suggestions"
                  checked={formData.aiSuggestions}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, aiSuggestions: checked }))
                  }
                  data-testid="switch-ai-suggestions"
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="font-medium mb-4">Data Management</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExport("json")}
                data-testid="button-export-json"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as JSON
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExport("csv")}
                data-testid="button-export-csv"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleClearData}
                data-testid="button-clear-data"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={handleSave}
            disabled={saveSettingsMutation.isPending}
            className="flex-1"
            data-testid="button-save-settings"
          >
            {saveSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            data-testid="button-cancel-settings"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
