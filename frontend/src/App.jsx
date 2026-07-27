import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskFormPage from './pages/TaskFormPage';
import NotFound from './pages/NotFound';

export default function App() {
  // Simple presentation-only login state for demonstrating navigation
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('demo_auth') === 'true';
  });

  const handleLogin = () => {
    sessionStorage.setItem('demo_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('demo_auth');
    setIsAuthenticated(false);
  };

  // Basic presentation redirect wrappers (strictly for route demonstration)
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <ThemeProvider>
      <TaskProvider>
        <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased transition-colors">
          {/* Main header always active at top */}
          <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

          {/* Core Page Router */}
          <main className="flex-1">
            <Routes>
              {/* Login route (Public only) */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login onLogin={handleLogin} />
                  </PublicRoute>
                }
              />

              {/* Dashboard route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Create new task route */}
              <Route
                path="/tasks/new"
                element={
                  <ProtectedRoute>
                    <TaskFormPage />
                  </ProtectedRoute>
                }
              />

              {/* Edit existing task route */}
              <Route
                path="/tasks/:id/edit"
                element={
                  <ProtectedRoute>
                    <TaskFormPage />
                  </ProtectedRoute>
                }
              />

              {/* Direct index landing back to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 Not Found Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      </TaskProvider>
    </ThemeProvider>
  );
}
