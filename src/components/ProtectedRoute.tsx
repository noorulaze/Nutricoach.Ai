import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowUnonboarded?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowUnonboarded = false 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] text-xl font-bold animate-pulse">
          ⚡
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce [animation-delay:0.4s]" />
          <span className="ml-1 text-zinc-300">Authenticating session...</span>
        </div>
      </div>
    );
  }

  // If not logged in, redirect directly to Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If newly registered user hasn't completed onboarding yet
  if (!user.onboarded && !allowUnonboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
