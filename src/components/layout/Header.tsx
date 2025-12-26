import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                MockMaster
              </span>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-semibold relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/my-attempts" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-semibold relative group">
                My Attempts
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Username - Visible on all screen sizes */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-700 text-xs sm:text-sm">
                <span className="hidden sm:inline text-gray-500">Welcome, </span>
                <span className="font-bold text-gray-900">{user?.fullName || user?.username}</span>
              </span>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:inline-flex">
              Logout
            </Button>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 bg-white/50 backdrop-blur-sm">
            <nav className="flex flex-col gap-2">
              <div className="px-4 py-3 text-gray-700 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-2">
                <span className="text-xs text-gray-500 block mb-1">Welcome,</span>
                <span className="font-bold text-gray-900">{user?.fullName || user?.username}</span>
              </div>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-semibold"
              >
                Home
              </Link>
              <Link
                to="/my-attempts"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-semibold"
              >
                My Attempts
              </Link>
              <div className="px-4 py-2 pt-4">
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
