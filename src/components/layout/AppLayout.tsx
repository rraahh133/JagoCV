import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function AppLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex-col w-full flex-1 bg-slate-50 dark:bg-[#0B1221] min-h-screen">
      {/* Loading overlay — tidak unmount Outlet agar state wizard tidak reset */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-[#0B1221]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Navbar 
        userName={user?.name}
        userRole={user?.subscriptionTier}
        profileImageUrl={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=eff6ff&color=3b82f6`}
        onProfileClick={() => navigate('/profile')}
        onThemeToggle={toggleTheme}
      />

      {/* Ambient Background for App */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 dark:bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Main Dashboard Application Hub */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
