import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      setLocation("/login");
      return;
    }

    // If user is authenticated but doesn't have required role
    if (isAuthenticated && user && requiredRole) {
      const userRole = user.role;
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      if (!allowedRoles.includes(userRole)) {
        // Redirect based on user's actual role
        switch (userRole) {
          case 'admin':
            setLocation("/admin/dashboard");
            break;
          case 'finder':
            setLocation("/finder/dashboard");
            break;
          case 'client':
            setLocation("/client/dashboard");
            break;
          default:
            setLocation("/");
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, requireAuth, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, don't render
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If user is authenticated but doesn't have required role, don't render
  if (isAuthenticated && user && requiredRole) {
    const userRole = user.role;
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!allowedRoles.includes(userRole)) {
      return null;
    }
  }

  // Render the protected component
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

export function FinderRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="finder">
      {children}
    </ProtectedRoute>
  );
}

export function ClientRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="client">
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

// Special route for support agents
export function AgentRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    // For agent routes, we need to check if the user has support agent permissions
    // This will be validated at the API level, but we redirect non-admins away
    if (user && user.role !== 'admin') {
      switch (user.role) {
        case 'finder':
          setLocation("/finder/dashboard");
          break;
        case 'client':
          setLocation("/client/dashboard");
          break;
        default:
          setLocation("/");
      }
    }
  }, [isLoading, isAuthenticated, user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}