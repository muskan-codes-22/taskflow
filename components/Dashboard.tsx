
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, CheckCircle, Circle, Trash2, Calendar as CalIcon, Tag, Edit3, Clock } from 'lucide-react';
import { User, Task, Category } from '../types';
import TaskModal from './TaskModal';

interface DashboardProps {
  user: User;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, tasks, onAddTask, onUpdateTask, onToggleTask, onDeleteTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }
    handleCloseModal();
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-display text-white tracking-tight italic">HEY {user.name.toUpperCase()}</h2>
          <p className="text-neutral-400 mt-2">You have {pendingTasks.length} missions remaining for today.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-[0_4px_20px_rgba(255,0,0,0.4)] transition-all hover:scale-105"
        >
          <Plus size={20} />
          ADD TASK
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-950 border border-red-900/20 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-25 group-hover:scale-110 transition-transform">
            <CheckCircle size={48} className="text-red-600" />
          </div>
          <p className="text-neutral-500 font-semibold uppercase text-xs tracking-widest mb-1">Completed</p>
          <h3 className="text-4xl font-display text-white">{completedTasks.length}</h3>
        </div>
        <div className="bg-neutral-950 border border-red-900/20 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-25 group-hover:scale-110 transition-transform">
            <CalIcon size={48} className="text-red-600" />
          </div>
          <p className="text-neutral-500 font-semibold uppercase text-xs tracking-widest mb-1">Total Tasks</p>
          <h3 className="text-4xl font-display text-white">{tasks.length}</h3>
        </div>
        <div className="bg-neutral-950 border border-red-900/20 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-25 group-hover:scale-110 transition-transform">
            <Tag size={48} className="text-red-600" />
          </div>
          <p className="text-neutral-500 font-semibold uppercase text-xs tracking-widest mb-1">Categories</p>
          <h3 className="text-4xl font-display text-white">{Array.from(new Set(tasks.map(t => t.category))).length}</h3>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-12">
        <section>
          <h4 className="text-xs font-bold text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-red-600"></span>
            Active Missions
          </h4>
          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-red-900/20 rounded-xl">
                <p className="text-neutral-500">The city is safe. All tasks completed.</p>
              </div>
            ) : (
              pendingTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={() => onToggleTask(task.id)} 
                  onDelete={() => onDeleteTask(task.id)}
                  onEdit={() => handleEdit(task)}
                />
              ))
            )}
          </div>
        </section>

        {completedTasks.length > 0 && (
          <section>
            <h4 className="text-xs font-bold text-neutral-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-neutral-800"></span>
              History
            </h4>
            <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
              {completedTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={() => onToggleTask(task.id)} 
                  onDelete={() => onDeleteTask(task.id)}
                  onEdit={() => handleEdit(task)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        initialData={editingTask}
        onClose={handleCloseModal} 
        onSave={handleSave} 
      />
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`group flex items-center justify-between p-5 bg-neutral-950 border ${task.completed ? 'border-neutral-800' : 'border-red-900/20 hover:border-red-600/50'} rounded-xl transition-all duration-300`}>
      <div className="flex items-center gap-5">
        <button 
          onClick={onToggle}
          className={`transition-colors ${task.completed ? 'text-red-600' : 'text-neutral-600 hover:text-red-500'}`}
        >
          {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
        </button>
        <div>
          <h5 className={`font-bold text-lg ${task.completed ? 'text-neutral-500 line-through' : 'text-white'}`}>
            {task.name}
          </h5>
          <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <CalIcon size={14} />
              {task.date ? format(new Date(task.date), 'd MMM') : 'No Date'}
            </span>
            {(task.startTime || task.endTime) && (
              <span className="flex items-center gap-1 text-neutral-400 text-xs">
                <span className="hidden md:inline w-1 h-1 bg-red-600 rounded-full mx-1"></span>
                <Clock size={12} />
                {task.startTime || '??'} - {task.endTime || '??'}
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-red-900/10 text-red-500 font-bold uppercase text-[10px] tracking-widest border border-red-600/20">
              {task.category}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button 
          onClick={onEdit}
          className="p-2 text-neutral-600 hover:text-white transition-all hover:bg-white/5 rounded-lg"
        >
          <Edit3 size={18} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-neutral-600 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
