
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, LogOut, ChevronRight, Activity } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-red-900/30 flex flex-col bg-neutral-950">
        <div className="p-8">
          <h1 className="text-5xl font-display text-red-600 tracking-tighter italic drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)]">TASKFLOW</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'hover:bg-red-900/20 text-neutral-400 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </NavLink>
          <NavLink 
            to="/calendar" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'hover:bg-red-900/20 text-neutral-400 hover:text-white'
              }`
            }
          >
            <Calendar size={20} />
            <span className="font-semibold">Calendar</span>
          </NavLink>
          <NavLink 
            to="/mission-status" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'hover:bg-red-900/20 text-neutral-400 hover:text-white'
              }`
            }
          >
            <Activity size={20} />
            <span className="font-semibold">Mission Status</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-red-900/30">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 text-neutral-400 hover:text-red-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span className="font-semibold">Logout</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
