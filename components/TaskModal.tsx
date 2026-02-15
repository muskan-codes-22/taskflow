
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category, Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  initialData?: Task | null;
  onClose: () => void;
  onSave: (task: { name: string; date: string; category: Category; description: string }) => void;
}

const categories: Category[] = ['Work', 'Personal', 'Health', 'Finance', 'Other'];

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Work' as Category,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        date: initialData.date,
        category: initialData.category,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Work',
        description: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
              <input 
                type="date" 
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
