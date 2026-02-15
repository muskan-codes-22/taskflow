
import React from 'react';
import { Task } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-12">
        <h2 className="text-4xl font-display text-white tracking-tight italic uppercase">{format(today, 'MMMM yyyy')}</h2>
        <p className="text-neutral-400 mt-2">Mission schedule for the current operational cycle.</p>
      </header>

      <div className="bg-neutral-950 border border-red-900/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-red-900/20 bg-black">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-red-600 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 min-h-[600px]">
          {days.map((day, idx) => {
            const dayTasks = tasks.filter(t => isSameDay(new Date(t.date), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            
            return (
              <div 
                key={idx} 
                className={`border-r border-b border-red-900/10 p-2 min-h-[120px] transition-colors ${
                  !isCurrentMonth ? 'bg-black opacity-25' : 'bg-neutral-950 hover:bg-red-900/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${isToday(day) ? 'bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-neutral-500'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className={`text-[10px] px-2 py-1 rounded truncate border ${
                        task.completed 
                          ? 'bg-neutral-900 border-neutral-800 text-neutral-500 line-through' 
                          : 'bg-red-900/20 border-red-600/30 text-red-500 font-bold'
                      }`}
                    >
                      {task.name}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-neutral-600 px-2">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
