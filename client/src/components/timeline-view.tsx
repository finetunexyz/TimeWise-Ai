import { formatTime, getCategoryColor, getCategoryIcon, formatDuration } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimelineViewProps {
  activities: any[];
  className?: string;
}

export default function TimelineView({ activities, className = "" }: TimelineViewProps) {
  // Sort activities by start time
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  if (activities.length === 0) {
    return (
      <div className={`flex items-center justify-center h-80 ${className}`} data-testid="timeline-empty-state">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-dashed border-gray-300"></div>
          <p>No activities logged today</p>
          <p className="text-sm">Start tracking your time to see your timeline</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className={`h-80 ${className}`} data-testid="timeline-view">
      <div className="space-y-3 pr-4">
        {sortedActivities.map((activity, index) => (
          <Card 
            key={activity.id || index} 
            className="p-3 bg-muted/50 hover:bg-muted/70 transition-colors"
            data-testid={`timeline-item-${index}`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-sm font-mono text-muted-foreground min-w-16" data-testid={`time-${index}`}>
                {formatTime(activity.startTime)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: getCategoryColor(activity.category) }}
                  ></div>
                  <span className="font-medium text-foreground" data-testid={`title-${index}`}>
                    {activity.description}
                  </span>
                  <span className="text-xs text-muted-foreground" data-testid={`duration-${index}`}>
                    {formatDuration(activity.duration)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className={`${getCategoryIcon(activity.category)} text-xs`} style={{ color: getCategoryColor(activity.category) }}></i>
                  <p className="text-sm text-muted-foreground capitalize" data-testid={`category-${index}`}>
                    {activity.category}
                  </p>
                  {activity.aiSuggested && activity.aiSuggested !== activity.category && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      AI suggested: {activity.aiSuggested}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
