import React, { useEffect } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingView from './views/LandingView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import ForgotPasswordView from './views/ForgotPasswordView';
import ResetPasswordView from './views/ResetPasswordView';
import ProfileView from './views/ProfileView';
import PricingView from './views/PricingView';
import DashboardView from './views/DashboardView';
import CreateCvView from './views/CreateCvView';
import DesignResumeView from './views/DesignResumeView';
import BuildPortfolioView from './views/BuildPortfolioView';
import CvResultView from './views/CvResultView';
import ResumeResultView from './views/ResumeResultView';
import PortfolioResultView from './views/PortfolioResultView';
import AppLayout from './components/layout/AppLayout';

import EditProfileView from './views/EditProfileView';
import SettingsView from './views/SettingsView';
import HelpView from './views/HelpView';

import { useAuth } from './hooks/useAuth';

function RootRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return null; // Or a loading spinner
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingView />;
}

export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/forgot-password" element={<ForgotPasswordView />} />
        <Route path="/reset-password" element={<ResetPasswordView />} />
        <Route path="/pricing" element={<PricingView />} />
        
        {/* Authenticated Routes wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/edit" element={<EditProfileView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/help" element={<HelpView />} />
          <Route path="/cv/build" element={<CreateCvView />} />
          <Route path="/cv/result/:idOrSlug" element={<CvResultView />} />
          <Route path="/resume/design" element={<DesignResumeView />} />
          <Route path="/resume/result/:idOrSlug" element={<ResumeResultView />} />
          <Route path="/portfolio/build" element={<BuildPortfolioView />} />
          <Route path="/portfolio/result/:idOrSlug" element={<PortfolioResultView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

