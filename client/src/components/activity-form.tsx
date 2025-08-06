import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { CATEGORIES } from "@shared/schema";

interface ActivityFormProps {
  onActivityAdded?: () => void;
}

export default function ActivityForm({ onActivityAdded }: ActivityFormProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !category || !duration) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const now = new Date();
      const durationHours = parseFloat(duration);
      const startTime = new Date(now.getTime() - (durationHours * 60 * 60 * 1000));
      
      await apiRequest("POST", "/api/activities", {
        description: description.trim(),
        category,
        duration: durationHours,
        startTime: startTime.toISOString(),
        endTime: now.toISOString(),
      });

      toast({
        title: "Activity added!",
        description: "Your activity has been logged successfully.",
      });

      // Reset form
      setDescription("");
      setCategory("");
      setDuration("");
      
      onActivityAdded?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card data-testid="activity-form">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="activity-description">Activity Description</Label>
            <Input
              id="activity-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What were you working on?"
              data-testid="input-activity-description"
            />
          </div>

          <div>
            <Label htmlFor="activity-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} data-testid={`option-${cat}`}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="activity-duration">Duration (hours)</Label>
            <Input
              id="activity-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="1.5"
              step="0.25"
              min="0.25"
              max="12"
              data-testid="input-activity-duration"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            data-testid="button-add-activity"
          >
            {isSubmitting ? "Adding..." : "Add Activity"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
