
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-3xl font-display text-red-600 italic tracking-tighter">TASKFLOW</div>
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
            <h1 className="text-7xl lg:text-8xl font-display leading-[0.9] text-white">
              ORGANIZE,<br />
              <span className="text-red-600">TRACK,</span><br />
              ACHIEVE
            </h1>
            <p className="text-xl text-neutral-400 italic">
              "Become the Batman of your life"
            </p>
          </div>
          
          <Link 
            to="/login" 
            className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-sm font-bold text-xl uppercase tracking-widest hover:bg-red-700 transition-all group"
          >
            Start Now
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Mockup Preview */}
        <div className="relative group animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl aspect-video">
            {/* Minimal Mockup UI */}
            <div className="flex h-full">
              <div className="w-16 border-r border-white/5 bg-black/40 p-4 space-y-4">
                <div className="w-8 h-8 rounded bg-red-600/20" />
                <div className="w-8 h-8 rounded bg-white/5" />
                <div className="w-8 h-8 rounded bg-white/5" />
              </div>
              <div className="flex-1 p-6 space-y-6">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center">
                    <div className="w-3/4 h-2 bg-red-600/40 rounded" />
                  </div>
                  <div className="h-24 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                    <div className="w-3/4 h-2 bg-white/20 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-white/5 border border-white/10 rounded flex items-center px-3">
                    <div className="w-4 h-4 rounded-full border border-red-600 mr-3" />
                    <div className="w-1/2 h-2 bg-white/20 rounded" />
                  </div>
                  <div className="h-8 bg-white/5 border border-white/10 rounded flex items-center px-3">
                    <div className="w-4 h-4 rounded-full border border-red-600 mr-3" />
                    <div className="w-2/3 h-2 bg-white/20 rounded" />
                  </div>
                </div>
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
