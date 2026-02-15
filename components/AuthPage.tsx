
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Github, Chrome, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });
        if (error) throw error;
        setError("Success! Please check your email for a confirmation link.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900/50 border border-white/10 p-10 rounded-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display text-white mb-2 italic">TASKFLOW</h2>
          <p className="text-neutral-400">
            {isLogin ? 'Welcome back, detective.' : 'Join the elite force.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 text-neutral-500" size={18} />
              <input 
                type="text" 
                placeholder="Name" 
                required
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-neutral-500" size={18} />
            <input 
              type="email" 
              placeholder="Email" 
              required
              disabled={loading}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-neutral-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              disabled={loading}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-[0_4px_15px_rgba(255,0,0,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full"></div>
            <span className="bg-neutral-900 px-4 text-neutral-500 text-sm absolute">OR</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 bg-black/40 border border-white/10 hover:border-red-600 py-3 rounded-lg text-white transition-all"
            >
              <Chrome size={18} />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-black/40 border border-white/10 hover:border-red-600 py-3 rounded-lg text-white transition-all">
              <Github size={18} />
              Github
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-neutral-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
