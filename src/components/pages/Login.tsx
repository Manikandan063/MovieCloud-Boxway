
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserIcon from '@/components/ui/UserIcon';
import loginBg from '@/assets/login-bg.png';
import logoIcon from '@/assets/logo-icon.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    // Simulate slight delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleQuickLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-5xl h-[640px] flex overflow-hidden shadow-2xl animate-fade-in mx-4 border border-white/10">

        {/* Left Panel - Glass Effect */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 bg-[#3E2C24]/40 backdrop-blur-md border-r border-white/10 text-white relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <img src={logoIcon} alt="Boxway Logo" className="w-10 h-10 opacity-90 invert brightness-0 filter" />
              <span className="font-display font-bold text-3xl tracking-wide">Boxway</span>
            </div>

            <h1 className="text-4xl font-light leading-tight mb-6 mt-12">
              Design the Future <br />
              <span className="font-bold">Build the Present</span>
            </h1>

            <p className="text-lg text-gray-300 font-light max-w-sm">
              Precision project management for elite architectural firms.
            </p>
          </div>

          <div className="relative z-10 text-xs text-gray-400 font-mono">
            Running in Production Mode v2.4.0
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 bg-white/95 backdrop-blur-xl p-8 lg:p-12 flex flex-col justify-center relative">

          <div className="max-w-xs mx-auto w-full">
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <img src={logoIcon} alt="Logo" className="w-8 h-8" />
              <span className="font-display font-bold text-2xl text-gray-900">Boxway</span>
            </div>

            <div className="mb-10 flex flex-col items-center">
              <div className="w-16 h-16 border border-[#1F1F1F]/10 flex items-center justify-center mb-8">
                <UserIcon size={32} />
              </div>
              <h2 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-[0.4em]">Boxway Portal</h2>
            </div>

            <p className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest text-center mb-10 border-b border-[#C7BFB4]/30 pb-4">Secure Architectural Workspace</p>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-2 border-red-500 flex items-start gap-4">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent transition-colors placeholder:text-gray-300"
                  placeholder="name@boxway.in"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent transition-colors placeholder:text-gray-300 pr-8"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1F1F1F] text-white h-14 mt-10 hover:bg-[#CFAE70] transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed uppercase text-[10px] font-bold tracking-[0.2em]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Login Section */}
            <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center mb-4">Quick Developer Access</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleQuickLogin('admin@boxway.in', 'admin123')} className="py-1 px-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors">Admin</button>
                <button onClick={() => handleQuickLogin('architect@boxway.in', 'arch123')} className="py-1 px-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors">Architect</button>
                <button onClick={() => handleQuickLogin('hr@boxway.in', 'hr123')} className="py-1 px-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors">HR Manager</button>
                <button onClick={() => handleQuickLogin('intern@boxway.in', 'intern123')} className="py-1 px-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors">Intern</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
