
import React, { useMemo } from 'react';
import { Task } from '../types';
import { format, subDays, eachDayOfInterval, isSameDay, startOfYear, endOfYear, startOfMonth } from 'date-fns';
import { PieChart, Activity } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface MissionStatusProps {
  tasks: Task[];
}

const MissionStatus: React.FC<MissionStatusProps> = ({ tasks }) => {
  // --- Metrics Calculation ---
  const metrics = useMemo(() => {
    const today = new Date();
    
    // 1. Mission Completion (Today)
    const todayTasks = tasks.filter(t => t.date && isSameDay(new Date(t.date), today));
    const todayCompleted = todayTasks.filter(t => t.completed).length;
    const todayTotal = todayTasks.length;
    const completionRate = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

    // 2. Consistency (Streak)
    // Simple streak: consecutive days going back from today (or yesterday) with at least 1 completed task
    let streak = 0;
    let checkDate = today;
    // If no tasks today yet, maybe check yesterday first? 
    // Logic: If today has completed tasks, start check from today. 
    // If today represents a "miss" so far (0 completed), check if yesterday was a hit to continue streak.
    const todayHasCompletion = tasks.some(t => t.date && isSameDay(new Date(t.date), today) && t.completed);
    if (!todayHasCompletion) {
        checkDate = subDays(today, 1);
    }
    
    while (true) {
        const hasCompletion = tasks.some(t => t.date && isSameDay(new Date(t.date), checkDate) && t.completed);
        if (hasCompletion) {
            streak++;
            checkDate = subDays(checkDate, 1);
        } else {
            break;
        }
    }

    // Consistency % (Last 7 Days)
    const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const activeDays = last7Days.filter(day => 
        tasks.some(t => t.date && isSameDay(new Date(t.date), day) && t.completed)
    ).length;
    const consistencyScore = Math.round((activeDays / 7) * 100);


    // 3. Focus / Deep Work (Estimated)
    // Assume 45 mins per completed task
    const totalCompletedTasks = tasks.filter(t => t.completed).length; // All time or today? Prompt implies "Working" metrics.
    // Let's do Today's focus for the ring
    const todayFocusMinutes = todayCompleted * 45;
    const focusGoalMinutes = 4 * 60; // Goal: 4 hours
    const focusProgress = Math.min(Math.round((todayFocusMinutes / focusGoalMinutes) * 100), 100);


    // 4. Performance Score (Gamified)
    // Weighted average: 40% Completion, 40% Consistency, 20% Volume
    const score = Math.round((completionRate * 0.4) + (consistencyScore * 0.4) + (Math.min(todayCompleted * 10, 20))); // Just a heuristic

    return {
        todayCompleted,
        todayTotal,
        completionRate,
        streak,
        consistencyScore,
        todayFocusMinutes,
        focusProgress,
        score
    };
  }, [tasks]);


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

      {/* Progress Rings Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Ring: Mission Completion */}
        <div className="lg:col-span-1 bg-neutral-950 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(220,38,38,0.1)]">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-8 absolute top-8">Mission Status</h3>
            <ProgressRing 
                radius={120} 
                stroke={12} 
                progress={metrics.completionRate} 
                color="#dc2626"
                trackColor="#171717"
            >
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-display text-white font-bold tracking-tighter">
                        {metrics.completionRate}%
                    </span>
                    <span className="text-neutral-400 mt-2 font-medium">
                        {metrics.todayCompleted} / {metrics.todayTotal} Tasks
                    </span>
                    <div className="mt-4 px-3 py-1 bg-red-900/20 border border-red-900/50 rounded-full text-xs text-red-500 font-bold uppercase tracking-wider">
                        {metrics.completionRate === 100 ? 'Mission Complete' : 'In Progress'}
                    </div>
                </div>
            </ProgressRing>
        </div>

        {/* Secondary Rings Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Consistency Ring */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                 <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Consistency</h4>
                 <ProgressRing 
                    radius={80} 
                    stroke={8} 
                    progress={metrics.consistencyScore} 
                    color="#ea580c" // Orange for streak
                    trackColor="#171717" // match bg-neutral-900
                >
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-display text-white font-bold">{metrics.streak} Day</span>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Streak</span>
                    </div>
                </ProgressRing>
                <p className="mt-6 text-sm text-neutral-400 text-center">
                    {metrics.consistencyScore}% active in last 7 days
                </p>
            </div>

            {/* Focus Ring */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                 <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Deep Work (Est.)</h4>
                 <ProgressRing 
                    radius={80} 
                    stroke={8} 
                    progress={metrics.focusProgress} 
                    color="#2563eb" // Blue for focus
                    trackColor="#171717"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-display text-white font-bold">
                            {Math.floor(metrics.todayFocusMinutes / 60)}h {metrics.todayFocusMinutes % 60}m
                        </span>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Focused</span>
                    </div>
                </ProgressRing>
                <p className="mt-6 text-sm text-neutral-400 text-center">
                    Estimated time based on tasks
                </p>
            </div>

            {/* Performance Score Ring */}
            <div className="md:col-span-2 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex items-center justify-between px-12">
                <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">System Score</h4>
                    <div className="text-5xl font-display text-white italic tracking-tighter">
                        LEVEL {Math.max(1, Math.floor(metrics.score / 10))}
                    </div>
                    <p className="text-neutral-400 mt-2 text-sm">Based on overall performance metrics.</p>
                </div>
                <ProgressRing 
                    radius={60} 
                    stroke={6} 
                    progress={metrics.score} 
                    color="#16a34a" // Green for score
                    trackColor="#171717"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-display text-white font-bold">{metrics.score}</span>
                    </div>
                </ProgressRing>
            </div>

        </div>
      </section>

      {/* Heatmap Section */}
      <section className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 overflow-x-auto">
        <h3 className="text-xl font-bold text-white mb-6">Mission Density</h3>
        
        <div className="min-w-max">
          {/* Month Labels */}
          <div className="flex text-xs text-neutral-500 mb-2">
            {eachDayOfInterval({ start: startOfYear(new Date()), end: endOfYear(new Date()) })
              .filter((date, i) => i % 7 === 0) // Get start of each week
              .map((date, i) => {
                const isStartOfMonth = i === 0 || isSameDay(date, startOfMonth(date)) || date.getDate() <= 7;
                // Simple heuristic to show month label roughly where the month starts
                // We show a label if it's the first week of the month
                const showLabel = date.getDate() <= 7;
                return (
                  <div key={i} className="w-3 mx-[1px]" style={{ width: '12px' }}>
                    {showLabel ? format(date, 'MMM') : ''}
                  </div>
                );
              })}
          </div>

          <div className="grid grid-rows-7 grid-flow-col gap-[2px]">
            {/* Days of week labels (hidden or minimal) */}
            {/* We can just render the boxes directly. The grid-rows-7 will force them into S M T W T F S order naturally if start date is aligned to Sunday */}
            {(() => {
                // Align start date to Sunday to ensure grid flows correctly top-to-bottom (Sun-Sat)
                const today = new Date();
                const yearStart = startOfYear(today);
                const yearEnd = endOfYear(today);
                // Adjust start to previous Sunday
                const calendarStart = subDays(yearStart, yearStart.getDay());
                
                const days = eachDayOfInterval({ 
                    start: calendarStart, 
                    end: yearEnd 
                });

                return days.map((day, index) => {
                    // Check if day is actually in the current year for data purposes (optional, but cleaner)
                    const isCurrentYear = day.getFullYear() === today.getFullYear();
                    const count = isCurrentYear 
                        ? tasks.filter(t => t.date && isSameDay(new Date(t.date), day)).length
                        : 0;

                    const dayDetails = isCurrentYear 
                        ? `${format(day, 'MMM dd, yyyy')}: ${count} missions`
                        : '';

                    return (
                        <div 
                            key={index}
                            title={dayDetails}
                            className={`w-3 h-3 rounded-[2px] ${isCurrentYear ? getIntensityClass(count) : 'bg-transparent'} transition-colors hover:ring-1 hover:ring-white cursor-pointer`}
                        />
                    );
                });
            })()}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500 justify-end">
            <span>Less</span>
            <div className="w-3 h-3 bg-neutral-900 rounded-[2px]"></div>
            <div className="w-3 h-3 bg-red-900/40 rounded-[2px]"></div>
            <div className="w-3 h-3 bg-red-800/60 rounded-[2px]"></div>
            <div className="w-3 h-3 bg-red-700/80 rounded-[2px]"></div>
            <div className="w-3 h-3 bg-red-600 rounded-[2px]"></div>
            <span>More</span>
        </div>
      </section>
    </div>
  );
};

export default MissionStatus;
