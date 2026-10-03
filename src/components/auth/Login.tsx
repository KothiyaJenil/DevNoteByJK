import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { GithubIcon } from '../common/GithubIcon';

export const Login: React.FC = () => {
  const { loginUser, navigate, addToast } = useApp();

  const [email, setEmail] = useState('alex.rivera@devnotes.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) errors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email address format';

    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validate()) return;

    setIsLoading(true);

    // Simulate login API latency
    setTimeout(() => {
      setIsLoading(false);
      loginUser(email);
    }, 800);
  };

  const handleGitHubLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser('github.dev@devnotes.io', 'GitHub Developer');
      addToast('GitHub Auth Successful', 'Connected workspace with GitHub', 'success');
    }, 700);
  };

  const handleSimulateNetworkError = () => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      setErrorMessage('Network connection lost. Unable to reach DevNotes API server.');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#090d16] px-4 py-12 text-slate-100 font-sans">
      {/* Brand Header */}
      <button
        onClick={() => navigate('landing')}
        className="flex items-center gap-3 mb-8 group"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <Layers className="h-6 w-6" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold font-mono tracking-tight text-white">DevNotes</h1>
          <p className="text-xs text-slate-400">Developer Knowledge Workspace</p>
        </div>
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1117] p-8 shadow-2xl shadow-emerald-950/20 space-y-6">
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-bold text-white">Welcome back, developer.</h2>
          <p className="text-xs text-slate-400">Log in to access your technical notes & flows</p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                }}
                placeholder="developer@company.com"
                className={`w-full rounded-xl border bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  fieldErrors.email ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-400">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => addToast('Password Reset', 'Reset link sent to registered email address.', 'info')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••••••"
                className={`w-full rounded-xl border bg-slate-900/80 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  fieldErrors.password ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-400">{fieldErrors.password}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
              />
              <span>Remember this browser</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold py-3 text-sm transition-all shadow-lg shadow-emerald-500/15"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Login to Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-[#0d1117] px-3 font-mono text-xs uppercase text-slate-500">
            OR
          </span>
        </div>

        {/* GitHub OAuth */}
        <button
          type="button"
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold py-2.5 text-sm transition-colors"
        >
          <GithubIcon className="h-4 w-4" />
          <span>Continue with GitHub</span>
        </button>

        {/* Demo error trigger */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleSimulateNetworkError}
            className="text-[11px] text-slate-500 hover:text-slate-400 underline font-mono"
          >
            [Demo State: Test Network Error]
          </button>
        </div>
      </div>

      {/* Switch to Signup */}
      <p className="mt-6 text-xs text-slate-400">
        Don't have an account?{' '}
        <button
          onClick={() => navigate('signup')}
          className="font-semibold text-emerald-400 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};
