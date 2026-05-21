import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="relative flex flex-col items-center">
          {/* Animated Spinner Rings */}
          <div className="w-16 h-16 border-4 border-sky-200 dark:border-slate-800 rounded-full animate-spin border-t-sky-500 dark:border-t-violet-500"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium animate-pulse">
            Analyzing session security...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
