import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setViewDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const handleDayClick = (day: Date) => {
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white hover:border-red-600/50 focus:border-red-600 transition-colors cursor-pointer flex items-center justify-between group"
      >
        <span>{value ? format(new Date(value), 'PPP') : 'Select date'}</span>
        <CalendarIcon size={18} className="text-neutral-500 group-hover:text-red-500 transition-colors" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-neutral-950 border border-red-900/30 rounded-xl shadow-2xl w-[320px] animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-display tracking-wide text-lg">
              {format(viewDate, 'MMMM yyyy')}
            </h4>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth}
                type="button"
                className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNextMonth}
                type="button"
                className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-bold text-red-600/70 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = value ? isSameDay(day, new Date(value)) : false;
              const isCurrentDay = isToday(day);

              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  type="button"
                  className={`
                    h-9 w-9 rounded-lg flex items-center justify-center text-sm transition-all relative
                    ${!isCurrentMonth ? 'text-neutral-700' : 'text-neutral-300'}
                    ${isSelected ? 'bg-red-600 text-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'hover:bg-red-900/20 hover:text-red-400'}
                    ${isCurrentDay && !isSelected ? 'border border-red-900/50 text-red-500' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
