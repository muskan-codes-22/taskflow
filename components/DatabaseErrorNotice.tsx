
import React, { useState } from 'react';
import { AlertTriangle, Copy, Check, Terminal } from 'lucide-react';

const DatabaseErrorNotice: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlCode = `
-- 1. Create the tasks table
CREATE TABLE public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy so users can only manage their own tasks
CREATE POLICY "Users can manage their own tasks" ON public.tasks
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <div className="max-w-2xl w-full bg-neutral-950 border border-red-600 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
        <div className="flex items-center gap-4 text-red-600 mb-6">
          <AlertTriangle size={32} />
          <h2 className="text-3xl font-display italic">MISSION SETUP REQUIRED</h2>
        </div>
        
        <p className="text-neutral-300 mb-6 leading-relaxed">
          The <span className="text-white font-bold">tasks</span> table was not found in your Supabase database. 
          To enable mission tracking, run this SQL script in your <span className="text-red-500 font-bold">Supabase SQL Editor</span>.
        </p>

        <div className="relative group mb-8">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="p-2 bg-neutral-900 border border-white/10 rounded-lg hover:border-red-600 transition-all text-neutral-400 hover:text-white"
              title="Copy SQL"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border-x border-t border-white/10 rounded-t-lg text-xs font-mono text-neutral-500">
            <Terminal size={12} />
            database_setup.sql
          </div>
          <pre className="bg-black p-6 rounded-b-lg border border-white/10 overflow-x-auto text-sm font-mono text-red-500/90 max-h-[300px] custom-scrollbar">
            {sqlCode}
          </pre>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 text-sm text-neutral-400">
            <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 font-bold">1</div>
            <p>Go to your <a href="https://supabase.com/dashboard" target="_blank" className="text-white underline hover:text-red-500">Supabase Dashboard</a></p>
          </div>
          <div className="flex items-start gap-3 text-sm text-neutral-400">
            <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 font-bold">2</div>
            <p>Open the <strong>SQL Editor</strong> and click <strong>New Query</strong></p>
          </div>
          <div className="flex items-start gap-3 text-sm text-neutral-400">
            <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 font-bold">3</div>
            <p>Paste the code and click <strong>Run</strong>. Refresh this page once done.</p>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="mt-8 w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,0,0,0.3)]"
        >
          I've run the SQL - Refresh Mission Control
        </button>
      </div>
    </div>
  );
};

export default DatabaseErrorNotice;
