import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category, Task } from '../types';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

interface TaskModalProps {
  isOpen: boolean;
  initialData?: Task | null;
  initialDate?: string;
  onClose: () => void;
  onSave: (task: { name: string; date: string; start_time?: string; end_time?: string; due_time?: string | null; category: Category; description: string }) => void;
}

const categories: Category[] = ['Work', 'Personal', 'Health', 'Finance', 'Other'];

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, initialData, initialDate, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    dueTime: '',
    category: 'Work' as Category,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        date: initialData.date,
        startTime: initialData.start_time || '',
        endTime: initialData.end_time || '',
        dueTime: initialData.due_time ? new Date(initialData.due_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
        category: initialData.category,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        date: initialDate || new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        dueTime: '',
        category: 'Work',
        description: ''
      });
    }
  }, [initialData, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and startTime for due_time if both exist
    // Combine date and dueTime for due_time if both exist
    let due_time: string | undefined;
    if (formData.date && formData.dueTime) {
      try {
        // Create a date object and get ISO string
        // Assuming local time input, storing as UTC ISO string is standard
        const dateTime = new Date(`${formData.date}T${formData.dueTime}`);
        if (!isNaN(dateTime.getTime())) {
          due_time = dateTime.toISOString();
        }
      } catch (err) {
        console.error("Invalid date/time format", err);
      }
    }

    onSave({
      name: formData.name,
      date: formData.date,
      start_time: formData.startTime,
      end_time: formData.endTime,
      due_time,
      category: formData.category,
      description: formData.description
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-neutral-900 border border-red-900/30 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-display text-white tracking-tight italic">
            {initialData ? 'UPDATE MISSION' : 'NEW MISSION'}
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Mission Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Date</label>
              <DatePicker 
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Category</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Start Time</label>
              <TimePicker 
                value={formData.startTime}
                onChange={(startTime) => setFormData({ ...formData, startTime })}
                label="Start"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">End Time</label>
              <TimePicker 
                value={formData.endTime}
                onChange={(endTime) => setFormData({ ...formData, endTime })}
                label="End"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Due Time</label>
              <TimePicker 
                value={formData.dueTime}
                onChange={(dueTime) => setFormData({ ...formData, dueTime })}
                label="Due"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Description</label>
            <textarea 
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all shadow-[0_4px_15px_rgba(255,0,0,0.3)] uppercase tracking-widest"
          >
            {initialData ? 'Update Record' : 'Deploy Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
