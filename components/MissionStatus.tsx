
import React, { useMemo } from 'react';
import { Task } from '../types';
import { format, subDays, eachDayOfInterval, isSameDay, startOfYear, endOfYear } from 'date-fns';
import { PieChart, Activity } from 'lucide-react';

interface MissionStatusProps {
  tasks: Task[];
}

const MissionStatus: React.FC<MissionStatusProps> = ({ tasks }) => {
  // --- Area Chart Data Prep ---
  const areaChartData = useMemo(() => {
    const today = new Date();
    const last30Days = eachDayOfInterval({
      start: subDays(today, 29),
      end: today
    });

    return last30Days.map(day => {
      const dayTasks = tasks.filter(t => t.date && isSameDay(new Date(t.date), day));
      const completed = dayTasks.filter(t => t.completed).length;
      const pending = dayTasks.filter(t => !t.completed).length;
      return {  
        date: format(day, 'MMM dd'),
        completed,
        pending,
        total: completed + pending
      };
    });
  }, [tasks]);

  // Max value for scaling
  const maxTasks = Math.max(...areaChartData.map(d => d.total), 5); // Minimum scale of 5 for aesthetics

  // SVG Points for Area Chart
  const chartHeight = 250;
  const chartWidth = 800;
  const pointGap = chartWidth / (areaChartData.length - 1);

  const completedPath = areaChartData.map((d, i) => {
    const x = i * pointGap;
    const y = chartHeight - (d.completed / maxTasks) * chartHeight;
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  const pendingPath = areaChartData.map((d, i) => {
    const x = i * pointGap;
    const y = chartHeight - ((d.completed + d.pending) / maxTasks) * chartHeight; // Stacked (Total)
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  // Base line for area closing
  const areaClose = `L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  // --- Heatmap Data Prep ---
  const heatmapData = useMemo(() => {
    const today = new Date();
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

    return days.map(day => {
      const count = tasks.filter(t => t.date && isSameDay(new Date(t.date), day)).length;
      return { date: day, count };
    });
  }, [tasks]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-neutral-900';
    if (count <= 2) return 'bg-red-900/40';
    if (count <= 4) return 'bg-red-800/60';
    if (count <= 6) return 'bg-red-700/80';
    return 'bg-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
      <header>
        <h2 className="text-4xl font-display text-white tracking-tight italic flex items-center gap-4">
          <Activity size={40} className="text-red-600" />
          MISSION STATUS
        </h2>
        <p className="text-neutral-400 mt-2">Tactical analysis of mission performance and completion rates.</p>
      </header>

      {/* Area Chart Section */}
      <section className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 relative overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <PieChart size={20} className="text-red-600" />
          Mission Velocity (Last 30 Days)
        </h3>
        
        <div className="h-[250px] w-full relative">
          {/* Y-Axis Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between text-xs text-neutral-600 pointer-events-none">
            {[100, 75, 50, 25, 0].map((p, i) => (
              <div key={i} className="flex items-center w-full border-b border-white/5 h-full last:border-0">
                <span className="w-8">{Math.round(maxTasks * (p / 100))}</span>
              </div>
            ))}
          </div>

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible preserve-3d">
            <defs>
              <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gradientGray" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#404040" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#404040" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Total Load Area (Pending + Completed) - Shown in Gray */}
            <path 
              d={`${pendingPath} ${areaClose}`} 
              fill="url(#gradientGray)" 
              className="transition-all duration-1000 ease-out"
            />
            <path 
              d={pendingPath} 
              fill="none" 
              stroke="#525252" 
              strokeWidth="2"
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_rgba(82,82,82,0.5)]"
            />

            {/* Completed Area (Red) - Drawn on top */}
            <path 
              d={`${completedPath} ${areaClose}`} 
              fill="url(#gradientRed)" 
              className="transition-all duration-1000 ease-out delay-100"
            />
            <path 
              d={completedPath} 
              fill="none" 
              stroke="#dc2626" 
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            />
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
            <span className="text-sm text-neutral-400">Completed Missions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-neutral-600 rounded-full"></div>
            <span className="text-sm text-neutral-400">Total Workload</span>
          </div>
        </div>
      </section>

      {/* Heatmap Section */}
      <section className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Mission Density (Year View)</h3>
        <div className="flex flex-wrap gap-1">
            {heatmapData.map((data, index) => (
              <div 
                key={index}
                title={`${format(data.date, 'MMM dd, yyyy')}: ${data.count} tasks`}
                className={`w-3 h-3 rounded-sm ${getIntensityClass(data.count)} transition-colors hover:ring-1 hover:ring-white cursor-pointer`}
              />
            ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500 justify-end">
            <span>Less</span>
            <div className="w-3 h-3 bg-neutral-900 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-900/40 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-800/60 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-700/80 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
            <span>More</span>
        </div>
      </section>
    </div>
  );
};

export default MissionStatus;
