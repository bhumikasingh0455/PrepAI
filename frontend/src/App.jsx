import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import QuestionGenerator from './pages/QuestionGenerator';
import MockInterview from './pages/MockInterview';
import DsaPractice from './pages/DsaPractice';
import Profile from './pages/Profile';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 ${
        isAuthenticated ? 'flex-col md:flex-row' : 'flex-col'
      }`}>
        {/* Global Toast Manager */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: 'glass-card border border-slate-200/50 dark:border-slate-800 text-slate-800 dark:text-slate-100',
            style: {
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
            },
          }}
        />
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Page Content Wrapper */}
        <div className={`flex-grow flex flex-col min-w-0 ${
          isAuthenticated ? 'md:h-screen md:overflow-y-auto' : ''
        }`}>
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected SaaS Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <ProtectedRoute>
                  <ResumeUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/generator"
              element={
                <ProtectedRoute>
                  <QuestionGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <MockInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dsa"
              element={
                <ProtectedRoute>
                  <DsaPractice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        {!isAuthenticated && <Footer />}
      </div>
    </div>
  </Router>
);
}

export default App;
