'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Activity,
  LockKeyhole,
  User,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  React.useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/waiting');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Auth Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  // Shared state
  const [role, setRole] = React.useState<'Clinical Administrator' | 'Consultant Doctor'>('Clinical Administrator');
  const [email, setEmail] = React.useState('admin@medikiosk.in');
  const [password, setPassword] = React.useState('admin123');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sign up specific state
  const [fullName, setFullName] = React.useState('');
  const [clinicName, setClinicName] = React.useState('MediKiosk Health Pod 1');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [agreedToTerms, setAgreedToTerms] = React.useState(true);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both your staff email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast.success(`Welcome back, ${role === 'Clinical Administrator' ? 'Administrator' : 'Doctor'}!`, {
          description: 'Session verified. Opening live waiting room...',
        });
        router.push('/waiting');
      } else {
        toast.error('Authentication failed. Please check your credentials.');
      }
    } catch {
      toast.error('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!email || !password) {
      toast.error('Please provide an email and password.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      toast.error('Please accept the clinical data compliance terms.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(fullName, email, password, clinicName, role);
      if (success) {
        toast.success(`Account created successfully! Welcome, ${fullName}.`, {
          description: 'Authorized clinical profile initialized. Opening live waiting room...',
        });
        router.push('/waiting');
      } else {
        toast.error('Registration failed. An account with this email may already exist.');
      }
    } catch {
      toast.error('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F1F5F9] selection:bg-[#1E3A8A] selection:text-white">
      {/* Left Brand Showcase Section (Desktop) */}
      <div className="relative hidden lg:flex flex-col justify-between lg:w-1/2 p-12 bg-gradient-to-br from-[#0A192F] via-[#0F172A] to-[#0A1120] text-white overflow-hidden">
        {/* Ambient background glow effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white shadow-xl shadow-blue-900/30">
              <Plus className="h-6 w-6 stroke-[3]" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0A192F]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                MediKiosk
              </span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-sky-400 block leading-none mt-1">
                Clinical Enterprise Portal
              </span>
            </div>
          </div>
        </div>

        {/* Center Clinical Highlights */}
        <div className="relative z-10 my-auto py-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Doctor Consultation Suite</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-white">
            Smart OPD Queuing, Structured EHR, &amp; Seamless Clinical Care.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Authorized portal for clinic directors, administrators, and attending physicians. Access real-time patient queue telemetry, triage summaries, and ABHA longitudinal health records.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300 shrink-0 mt-0.5">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Live OPD Queue</p>
                <p className="text-[11px] text-slate-300 mt-0.5">Sub-second patient sync &amp; calling</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">ABDM Certified</p>
                <p className="text-[11px] text-slate-300 mt-0.5">ABHA verified clinical records</p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-xs italic text-slate-200 leading-relaxed">
              &ldquo;MediKiosk streamlines our OPD patient flow with structured clinical summaries and instant triage vitals. It cuts physician documentation time in half.&rdquo;
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                DS
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Dr. Sharma, MD</p>
                <p className="text-[10px] text-slate-400 leading-none mt-1">Chief Medical Officer &bull; Room 204</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <LockKeyhole className="h-3.5 w-3.5 text-emerald-400" />
            <span>256-Bit TLS Healthcare Encryption</span>
          </div>
          <div className="flex items-center gap-3">
            <span>HIPAA Compliant</span>
            <span>&bull;</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </div>

      {/* Right Login / Sign Up Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
        {/* Mobile Header Branding (visible on small screens) */}
        <div className="lg:hidden flex items-center gap-2.5 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white shadow-md">
            <Plus className="h-5 w-5 stroke-[3]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#0F172A] dark:text-white block leading-none">
              MediKiosk
            </span>
            <span className="text-[10px] font-bold text-[#1E3A8A] dark:text-sky-400 uppercase tracking-wider block leading-none mt-0.5">
              Doctor Consultation Suite
            </span>
          </div>
        </div>

        {/* Form Card Container */}
        <div className="w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/40 transition-all">
          {/* Sign In vs Sign Up Segmented Control */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-[#E2E8F0] dark:border-[#1E293B] mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={cn(
                'py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5',
                authMode === 'signin'
                  ? 'bg-white dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-400 shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
              )}
            >
              <LockKeyhole className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={cn(
                'py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5',
                authMode === 'signup'
                  ? 'bg-white dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-400 shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
              )}
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Card Header */}
          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-400 text-[11px] font-bold border border-[#DBEAFE] dark:border-[#3B82F6]/30 mb-2">
              <ShieldCheck className="h-3 w-3" />
              <span>{authMode === 'signin' ? 'Authorized Terminal Sign In' : 'New Staff Registration'}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
              {authMode === 'signin' ? 'Admin • Doctor Sign In' : 'Create Admin Account'}
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
              {authMode === 'signin'
                ? 'Sign in with your clinical credentials to access your consultation workstation.'
                : 'Register an authorized clinical administrator profile for your healthcare facility.'}
            </p>
          </div>

          {/* SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                  Staff Email / ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@medikiosk.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info('For this demo, any password or "admin123" is accepted.')}
                    className="text-[11px] font-semibold text-[#1E3A8A] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E2E8F0] text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <span>Remember this terminal session</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-bold shadow-md shadow-blue-900/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              {/* Switch to Sign Up Footnote */}
              <p className="text-center text-xs text-[#64748B] dark:text-[#94A3B8] pt-2">
                Don&apos;t have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            </form>
          )}

          {/* SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                  Full Name &bull; Clinical Title
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Ayesha Khan"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
                  />
                </div>
              </div>

              {/* Clinic Name */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                  Clinic / Hospital Facility
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="e.g. MediKiosk City Clinic"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
                  />
                </div>
              </div>

              {/* Staff Email */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
                  />
                </div>
              </div>

              {/* Password & Confirm Password in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50/80 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50/80 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                  </div>
                </div>
              </div>

              {/* Compliance Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E2E8F0] text-[#1E3A8A] focus:ring-[#1E3A8A] mt-0.5"
                  />
                  <span>
                    I confirm authorized administrative registration in accordance with clinical EHR &amp; ABDM guidelines.
                  </span>
                </label>
              </div>

              {/* Sign Up Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-bold shadow-md shadow-blue-900/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Registering Clinical Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account &amp; Access Dashboard</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              {/* Switch to Sign In Footnote */}
              <p className="text-center text-xs text-[#64748B] dark:text-[#94A3B8] pt-2">
                Already have an authorized account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* Security footnote */}
          <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] text-center">
            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
              Protected by MediKiosk Identity Shield &bull; Session IP Logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
