import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse initial time or default to current time
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 12, minutes: 0 };
    const [h, m] = timeStr.split(':').map(Number);
    return { hours: isNaN(h) ? 12 : h, minutes: isNaN(m) ? 0 : m };
  };

  const { hours, minutes } = parseTime(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHourChange = (newHour: number) => {
    const validHour = Math.max(0, Math.min(23, newHour));
    onChange(`${validHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  const handleMinuteChange = (newMinute: number) => {
    const validMinute = Math.max(0, Math.min(59, newMinute));
    onChange(`${hours.toString().padStart(2, '0')}:${validMinute.toString().padStart(2, '0')}`);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white hover:border-red-600/50 focus:border-red-600 transition-colors cursor-pointer flex items-center justify-between group"
      >
        <span className={!value ? 'text-neutral-500' : ''}>
          {value ? value : (label || 'Select Time')}
        </span>
        <Clock size={18} className="text-neutral-500 group-hover:text-red-500 transition-colors" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-neutral-950 border border-red-900/30 rounded-xl shadow-2xl w-[200px] animate-in zoom-in-95 duration-200 left-0">
          <div className="flex items-center justify-center gap-4">
            
            {/* Hours Column */}
            <div className="flex flex-col items-center gap-2">
              <button 
                type="button"
                onClick={() => handleHourChange(hours - 1)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <ChevronUp size={20} />
              </button>
              <div className="w-12 h-12 bg-black border border-red-900/20 rounded-lg flex items-center justify-center text-xl font-display font-bold text-white shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                {hours.toString().padStart(2, '0')}
              </div>
              <button 
                type="button"
                onClick={() => handleHourChange(hours + 1)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <ChevronDown size={20} />
              </button>
              <span className="text-[10px] uppercase font-bold text-neutral-600 tracking-wider">Hrs</span>
            </div>

            <span className="text-2xl font-bold text-neutral-600 pb-6">:</span>

            {/* Minutes Column */}
            <div className="flex flex-col items-center gap-2">
              <button 
                type="button"
                onClick={() => handleMinuteChange(minutes - 5)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <ChevronUp size={20} />
              </button>
              <div className="w-12 h-12 bg-black border border-red-900/20 rounded-lg flex items-center justify-center text-xl font-display font-bold text-white shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                {minutes.toString().padStart(2, '0')}
              </div>
              <button 
                type="button"
                onClick={() => handleMinuteChange(minutes + 5)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <ChevronDown size={20} />
              </button>
              <span className="text-[10px] uppercase font-bold text-neutral-600 tracking-wider">Min</span>
            </div>

          </div>

          <div className="grid grid-cols-4 gap-1 mt-4 border-t border-white/5 pt-4">
            {[9, 12, 15, 18].map(h => (
              <button
                key={h}
                type="button"
                onClick={() => onChange(`${h.toString().padStart(2, '0')}:00`)}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded py-1 transition-colors"
              >
                {h}:00
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
