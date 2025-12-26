import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { LoginForm } from '../components/auth/LoginForm';
import type { LoginDto } from '../utils/types';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      dispatch(login({ user: response.user, token: response.accessToken }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            MockMaster
          </h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Welcome Back!
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline decoration-2 underline-offset-2">
              Sign up here
            </Link>
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl py-10 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
};
