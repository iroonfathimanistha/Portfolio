import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onNavigateHome }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setAuthError(null);

    // Validation
    const cleanUser = username.trim();
    if (!cleanUser) {
      setValidationError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(cleanUser, password);
      if (res.success) {
        onSuccess();
      } else {
        setAuthError(res.error || 'Incorrect email/username or password. Access denied.');
      }
    } catch {
      setAuthError('An unexpected network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col justify-center items-center p-4 antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      <div className="w-full max-w-sm">
        {/* Subtle Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-white font-mono">
            Portfolio CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-6 sm:p-7 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Validation / Auth Errors */}
            {(validationError || authError) && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{validationError || authError}</span>
              </div>
            )}

            {/* Email / Username Field */}
            <div>
              <label
                htmlFor="username-input"
                className="block text-xs font-mono text-slate-300 mb-1.5"
              >
                Email or Username
              </label>
              <div className="relative">
                <input
                  id="username-input"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="admin or email address"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    if (validationError) setValidationError(null);
                    if (authError) setAuthError(null);
                  }}
                  disabled={loading}
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-lg bg-[#0b0f17] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field + Show/Hide Toggle */}
            <div>
              <label
                htmlFor="password-input"
                className="block text-xs font-mono text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError(null);
                    if (authError) setAuthError(null);
                  }}
                  disabled={loading}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-[#0b0f17] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm mt-3 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>

          {/* Return to Portfolio Link */}
          <div className="pt-5 mt-5 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Portfolio</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-600 text-center mt-6 font-mono">
          Authorized personnel only. Sessions expire after 7 days.
        </p>
      </div>
    </div>
  );
};
