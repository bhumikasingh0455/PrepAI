import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, BrainCircuit, User as UserIcon, LogOut, LayoutDashboard, FileText, CheckSquare, Award, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Resume Analyzer', path: '/resume', icon: FileText },
        { label: 'AI Generator', path: '/generator', icon: BrainCircuit },
        { label: 'Mock Interview', path: '/interview', icon: MessageSquare },
        { label: 'DSA Sheet', path: '/dsa', icon: CheckSquare },
        { label: 'Leaderboard', path: '/profile#leaderboard', icon: Award },
        { label: 'Profile', path: '/profile', icon: UserIcon },
      ]
    : [
        { label: 'Features', path: '/#features' },
        { label: 'How It Works', path: '/#how-it-works' },
        { label: 'Testimonials', path: '/#testimonials' },
        { label: 'Pricing', path: '/#pricing' },
      ];

  const isActive = (path) => {
    if (path.includes('#')) {
      return location.pathname + location.hash === path;
    }
    return location.pathname === path;
  };

  // If user is NOT authenticated, render standard top navbar
  if (!isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 glass-panel transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-400 to-violet-600 text-white shadow-md">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="font-outfit font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                PrepAI
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-sky-50 dark:bg-slate-800/80 text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-slate-700/50'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-medium gradient-btn"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none transition-all"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-lg"
            >
              <div className="px-4 pt-2 pb-6 space-y-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2 px-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 rounded-xl text-base font-medium gradient-btn"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  }

  // If user IS authenticated, render vertical sidebar for desktop and sliding drawer for mobile
  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md z-40 py-6 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 px-2 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-400 to-violet-600 text-white shadow-md">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="font-outfit font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            PrepAI
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow flex flex-col space-y-1 overflow-y-auto pr-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative border ${
                  active
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50/70 dark:bg-sky-500/10 border-sky-100/50 dark:border-sky-950/50 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 border-transparent'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebarActiveAccent"
                    className="absolute left-0 w-1 h-5 rounded-r-full bg-gradient-to-b from-sky-400 to-violet-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {Icon && (
                  <Icon className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-105 ${
                    active ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`} />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Profile / Logout) */}
        <div className="mt-auto border-t border-slate-200/50 dark:border-slate-800/50 pt-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-violet-500 flex items-center justify-center text-white font-bold font-outfit text-sm shadow-md">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user?.name}
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/20 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Top Header (Authenticated) */}
      <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md w-full sticky top-0 z-40">
        <Link to="/" className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-sky-400 to-violet-600 text-white shadow-md">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="font-outfit font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            PrepAI
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Drawer (Authenticated) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />

            {/* Slide-out Sidebar Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/50 shadow-2xl z-50 p-6 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <div className="p-1.5 rounded-lg bg-gradient-to-tr from-sky-400 to-violet-600 text-white">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <span className="font-outfit font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    PrepAI
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-grow flex flex-col space-y-1 overflow-y-auto pr-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                        active
                          ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-100/50 dark:border-sky-950/50 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 border-transparent'
                      }`}
                    >
                      {Icon && <Icon className="w-4.5 h-4.5 text-slate-400" />}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col space-y-4">
                <div className="flex items-center space-x-3 px-2 py-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-violet-500 flex items-center justify-center text-white font-bold font-outfit text-sm">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {user?.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <ThemeToggle />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/20 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
