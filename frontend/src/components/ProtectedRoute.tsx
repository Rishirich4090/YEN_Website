/**
 * ProtectedRoute - Route protection based on authentication and role
 * Provides role-based access control for React Router v6
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'member';
  fallbackPath?: string;
  requireVerification?: boolean;
}

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  fallbackPath = '/login',
  requireVerification = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('🔄 ProtectedRoute Check:', {
    path: location.pathname,
    requireAuth,
    requiredRole,
    isAuthenticated,
    isLoading,
    userRole: user?.role,
    userEmail: user?.email
  });

  // Show loading spinner while checking auth
  if (isLoading) {
    console.log('🔄 ProtectedRoute: Showing loading spinner');
    return <LoadingSpinner />;
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    console.log('🔄 ProtectedRoute: Redirecting to login (not authenticated)');
    // Save the attempted location for redirect after login
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If authentication not required and user is not authenticated, allow access
  if (!requireAuth && !isAuthenticated) {
    console.log('🔄 ProtectedRoute: Allowing access (public route)');
    return <>{children}</>;
  }

  // Check email verification requirement
  if (requireVerification && user && !user.isEmailVerified) {
    return (
      <Navigate 
        to="/verify-email" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role requirement
  if (requiredRole && user) {
    if (user.role !== requiredRole) {
      console.log('🔄 ProtectedRoute: Wrong role, redirecting', {
        required: requiredRole,
        actual: user.role
      });
      
      // Redirect based on user's actual role
      const redirectPath = user.role === 'admin' 
        ? '/admin/dashboard' 
        : '/member/dashboard';
      
      return (
        <Navigate 
          to={redirectPath} 
          replace 
        />
      );
    }
  }

  console.log('🔄 ProtectedRoute: All checks passed, rendering children');
  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;

// Convenience components for specific roles
export const AdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
);

export const MemberRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="member">
    {children}
  </ProtectedRoute>
);

export const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  console.log('🔄 PublicRoute Check:', { isAuthenticated, isLoading, userRole: user?.role });
  
  // Show loading while checking auth state
  if (isLoading) {
    console.log('🔄 PublicRoute: Showing loading spinner');
    return <LoadingSpinner />;
  }
  
  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    console.log('🔄 PublicRoute: User authenticated, redirecting to dashboard');
    
    const redirectPath = user.role === 'admin' 
      ? '/admin/dashboard' 
      : '/member/dashboard';
    
    return (
      <Navigate 
        to={redirectPath} 
        replace 
      />
    );
  }
  
  console.log('🔄 PublicRoute: Rendering public content');
  return <>{children}</>;
};

export const VerifiedRoute: React.FC<{ children: ReactNode; requiredRole?: 'admin' | 'member' }> = ({ 
  children, 
  requiredRole 
}) => (
  <ProtectedRoute requiredRole={requiredRole} requireVerification={true}>
    {children}
  </ProtectedRoute>
);
