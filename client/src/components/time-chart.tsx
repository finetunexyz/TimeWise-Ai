import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { getCategoryColor } from "@/lib/utils";

Chart.register(...registerables);

interface TimeChartProps {
  activities: any[];
  className?: string;
}

export default function TimeChart({ activities, className = "" }: TimeChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || activities.length === 0) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Process activities by category
    const categoryData = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.keys(categoryData);
    const durations = Object.values(categoryData);
    const colors = categories.map(category => getCategoryColor(category));

    const totalTime = durations.reduce((sum, duration) => sum + duration, 0);

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
        datasets: [{
          data: durations,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const percentage = ((value / totalTime) * 100).toFixed(1);
                return `${label}: ${value.toFixed(1)}h (${percentage}%)`;
              }
            }
          }
        },
        cutout: '70%',
        layout: {
          padding: 20
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const { width, height, ctx } = chart;
          ctx.restore();
          
          const fontSize = Math.min(width, height) / 8;
          ctx.font = `bold ${fontSize}px Inter, sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#1f2937';
          
          const centerX = width / 2;
          const centerY = height / 2;
          
          ctx.fillText(`${totalTime.toFixed(1)}h`, centerX, centerY - 10);
          
          ctx.font = `${fontSize * 0.4}px Inter, sans-serif`;
          ctx.fillStyle = '#6b7280';
          ctx.fillText('Total', centerX, centerY + 15);
          
          ctx.save();
        }
      }]
    };

    chartInstance.current = new Chart(chartRef.current, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [activities]);

  if (activities.length === 0) {
    return (
      <div className={`flex items-center justify-center h-80 ${className}`} data-testid="chart-empty-state">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-dashed border-gray-300"></div>
          <p>No activities logged today</p>
          <p className="text-sm">Start tracking your time to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-80 ${className}`} data-testid="time-chart">
      <canvas ref={chartRef} />
    </div>
  );
}
