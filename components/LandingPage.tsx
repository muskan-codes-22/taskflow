
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowRight, CheckCircle, Circle, Calendar, Tag, Plus, Edit3 } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 w-full">
        <div className="text-5xl font-display text-red-600 italic tracking-tighter">TASKFLOW</div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-white hover:text-red-500 font-semibold transition-colors">
            Login
          </Link>
          <Link 
            to="/login" 
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:scale-105"
          >
            <UserPlus size={18} />
            <span className="font-bold">Sign Up</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 py-12">
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="space-y-4">
            <h1 className="text-7xl lg:text-8xl font-display leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-lg">
              ORGANIZE,<br />
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-orange-600 text-transparent bg-clip-text filter drop-shadow-[0_2px_10px_rgba(220,38,38,0.5)]">TRACK,</span><br />
              ACHIEVE
            </h1>
            <p className="text-xl text-neutral-400 italic max-w-lg leading-relaxed">
              "Become the Batman of your life. Master your day, defeat procrastination, and execute your mission with absolute precision."
            </p>
          </div>
          
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-2xl font-bold text-lg uppercase tracking-widest hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300 group"
          >
            Start Now
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Mockup Preview */}
        <div className="relative group animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-[#050505] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl aspect-video flex flex-col">
            {/* Realistic Dashboard Mockup (Scaled) */}
            <div className="p-8 w-[160%] h-[160%] origin-top-left transform scale-[0.625] pointer-events-none select-none">
              
              {/* Header */}
              <header className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-5xl font-display text-white tracking-tight italic">HEY BATMAN</h2>
                  <p className="text-neutral-400 mt-2 text-xl">You have 4 missions remaining for today.</p>
                </div>
                <div className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-3 shadow-[0_4px_20px_rgba(255,0,0,0.4)]">
                  <Plus size={24} />
                  <span className="text-lg">ADD TASK</span>
                </div>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-8 mb-12">
                {[
                  { label: "Completed", value: "12", icon: CheckCircle },
                  { label: "Total Tasks", value: "16", icon: Calendar },
                  { label: "Categories", value: "4", icon: Tag }
                ].map((stat, i) => (
                  <div key={i} className="bg-black border border-red-900/20 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <stat.icon size={64} className="text-red-600" />
                    </div>
                    <p className="text-neutral-500 font-semibold uppercase text-sm tracking-widest mb-2">{stat.label}</p>
                    <h3 className="text-5xl font-display text-white">{stat.value}</h3>
                  </div>
                ))}
              </div>

              {/* Task List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-10 h-[2px] bg-red-600"></span>
                  Active Missions
                </h4>
                
                {/* Mock Tasks */}
                {[
                  { name: "Review Wayne Ent. Q4 Reports", cat: "Work", date: "Today", completed: false },
                  { name: "Patrol Gotham North Sector", cat: "Vigilante", date: "Tonight", completed: false },
                  { name: "Equipment Maintenance", cat: "Personal", date: "Tomorrow", completed: true }
                ].map((task, i) => (
                  <div key={i} className={`flex items-center justify-between p-6 bg-black border ${task.completed ? 'border-neutral-800 opacity-60' : 'border-red-900/20'} rounded-xl`}>
                    <div className="flex items-center gap-6">
                      <div className={task.completed ? 'text-red-600' : 'text-neutral-600'}>
                        {task.completed ? <CheckCircle size={32} /> : <Circle size={32} />}
                      </div>
                      <div>
                        <h5 className={`font-bold text-2xl ${task.completed ? 'text-neutral-500 line-through' : 'text-white'}`}>
                          {task.name}
                        </h5>
                        <div className="flex items-center gap-4 mt-2 text-base text-neutral-500">
                          <span className="flex items-center gap-2">
                            <Calendar size={16} /> {task.date}
                          </span>
                          <span className="px-3 py-1 rounded bg-red-900/10 text-red-500 font-bold uppercase text-xs tracking-widest border border-red-600/20">
                            {task.cat}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 text-neutral-600">
                      <Edit3 size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-neutral-600 text-sm">
        &copy; {new Date().getFullYear()} TaskFlow. Justice for your schedule.
      </footer>
    </div>
  );
};

export default LandingPage;
