import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { GithubIcon } from '../common/GithubIcon';

export const SignUp: React.FC = () => {
  const { loginUser, navigate, addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string }>({});

  // Password strength calculation (0 to 4)
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = calculateStrength(password);

  const getStrengthLabel = (score: number) => {
    if (score === 0) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 2) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { label: 'Strong Developer Password', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strengthInfo = getStrengthLabel(strengthScore);

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim()) errors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email format';

    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters long';

    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errors.terms = 'You must agree to the Terms of Service';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser(email, name);
      addToast('Workspace Created', `Welcome to DevNotes, ${name}!`, 'success');
    }, 800);
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
          <h2 className="text-xl font-bold text-white">Create your developer workspace</h2>
          <p className="text-xs text-slate-400">Start organizing code notes & flows</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Rivera"
                className={`w-full rounded-xl border bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  fieldErrors.name ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                }`}
              />
            </div>
            {fieldErrors.name && <p className="text-[11px] text-rose-400">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex.rivera@company.com"
                className={`w-full rounded-xl border bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  fieldErrors.email ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                }`}
              />
            </div>
            {fieldErrors.email && <p className="text-[11px] text-rose-400">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
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
            {fieldErrors.password && <p className="text-[11px] text-rose-400">{fieldErrors.password}</p>}

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Password strength:</span>
                  <span className={`font-mono font-semibold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strengthScore >= 1 ? strengthInfo.color : 'bg-transparent'}`} style={{ width: '25%' }} />
                  <div className={`h-full transition-all duration-300 ${strengthScore >= 2 ? strengthInfo.color : 'bg-transparent'}`} style={{ width: '25%' }} />
                  <div className={`h-full transition-all duration-300 ${strengthScore >= 3 ? strengthInfo.color : 'bg-transparent'}`} style={{ width: '25%' }} />
                  <div className={`h-full transition-all duration-300 ${strengthScore >= 4 ? strengthInfo.color : 'bg-transparent'}`} style={{ width: '25%' }} />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full rounded-xl border bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  fieldErrors.confirmPassword ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                }`}
              />
            </div>
            {fieldErrors.confirmPassword && <p className="text-[11px] text-rose-400">{fieldErrors.confirmPassword}</p>}
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1 space-y-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500 h-4 w-4 shrink-0"
              />
              <span>I agree to the DevNotes Terms of Service and Privacy Policy</span>
            </label>
            {fieldErrors.terms && <p className="text-[11px] text-rose-400">{fieldErrors.terms}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold py-3 text-sm transition-all shadow-lg shadow-emerald-500/15"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
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

        {/* GitHub Option */}
        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              loginUser('github.dev@devnotes.io', 'GitHub Developer');
            }, 600);
          }}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold py-2.5 text-sm transition-colors"
        >
          <GithubIcon className="h-4 w-4" />
          <span>Sign up with GitHub</span>
        </button>
      </div>

      {/* Switch to Login */}
      <p className="mt-6 text-xs text-slate-400">
        Already have an account?{' '}
        <button
          onClick={() => navigate('login')}
          className="font-semibold text-emerald-400 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};
