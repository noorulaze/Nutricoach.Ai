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
      <div className="min-h-screen bg-[#f6f8f5] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#eef7eb] border border-[#d6ebd0] flex items-center justify-center text-[#5ba83c] text-xl font-bold animate-pulse shadow-xs">
          🌱
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#5e6f5e]">
          <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce [animation-delay:0.4s]" />
          <span className="ml-1 text-[#192418] font-medium">Verifying session...</span>
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
