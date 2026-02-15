
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import CalendarView from './components/CalendarView';
import DatabaseErrorNotice from './components/DatabaseErrorNotice';
import { User, Task } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTableMissing, setIsTableMissing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || ''
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || ''
        });
      } else {
        setUser(null);
        setTasks([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      if (error.message.includes('public.tasks') || error.code === '42P01') {
        setIsTableMissing(true);
      }
    } else if (data) {
      setIsTableMissing(false);
      setTasks(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          ...taskData, 
          completed: false,
          user_id: session.user.id
        }
      ])
      .select();

    if (error) {
      console.error('Error adding task:', error.message);
      if (error.message.includes('public.tasks') || error.code === '42P01') {
        setIsTableMissing(true);
      } else {
        alert(`Failed to save mission: ${error.message}`);
      }
    } else if (data) {
      setTasks(prev => [data[0], ...prev]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error.message);
      alert(`Failed to update mission: ${error.message}`);
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed });
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error.message);
      alert(`Failed to abort mission: ${error.message}`);
    } else {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,0,0,0.5)]"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      {isTableMissing && user && <DatabaseErrorNotice />}
      <Routes>
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
        
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={
            user ? (
              <Dashboard 
                user={user} 
                tasks={tasks} 
                onAddTask={addTask} 
                onUpdateTask={updateTask}
                onToggleTask={toggleTask} 
                onDeleteTask={deleteTask} 
              />
            ) : <Navigate to="/login" />
          } />
          <Route path="/calendar" element={
            user ? <CalendarView tasks={tasks} /> : <Navigate to="/login" />
          } />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
