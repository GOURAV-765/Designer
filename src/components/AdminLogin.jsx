import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isUsingPlaceholder } from '../supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if session already exists
  useEffect(() => {
    if (isUsingPlaceholder) {
      const mockSession = localStorage.getItem('mock-session');
      if (mockSession) {
        navigate('/admin/dashboard', { replace: true });
      }
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin/dashboard', { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    if (isUsingPlaceholder) {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'admin123') {
          localStorage.setItem('mock-session', 'true');
          navigate('/admin/dashboard', { replace: true });
        } else {
          setError('Invalid credentials. Use email: admin@example.com and password: admin123 to log in locally without Supabase.');
        }
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0f19] px-4 py-12 text-white overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[20%] left-[15%] h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]"></div>
      <div className="absolute bottom-[20%] right-[15%] h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]"></div>

      <div className="z-10 w-full max-w-md rounded-2xl border border-white/5 bg-[#121826]/75 p-8 shadow-2xl backdrop-blur-xl md:p-10">
        <div className="mb-8 text-center">
          <a href="/" className="font-heading text-2xl font-bold tracking-widest text-white">
            DEV<span className="text-cyan-500">.</span>DESIGN
          </a>
          <h2 className="mt-4 font-heading text-xl font-semibold text-gray-200">Admin Login Portal</h2>
          <p className="mt-2 text-sm text-gray-400 font-body">Sign in to manage your portfolio projects</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-heading text-sm font-semibold text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1b2336] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19] focus:ring-4 focus:ring-cyan-500/10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-heading text-sm font-semibold text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1b2336] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19] focus:ring-4 focus:ring-cyan-500/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 py-3.5 font-heading text-sm font-bold tracking-wider text-white shadow-lg transition duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <i className="fa-solid fa-right-to-bracket"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition duration-200">
            <i className="fa-solid fa-arrow-left mr-1.5"></i> Back to Live Website
          </a>
        </div>
      </div>
    </div>
  );
}
