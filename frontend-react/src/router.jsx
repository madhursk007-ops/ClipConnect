import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

// Layouts
import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';
import DashboardLayout from '@layouts/DashboardLayout';

// Pages
import Landing from '@pages/Landing';
import Login from '@pages/auth/Login';
import Register from '@pages/auth/Register';
import Dashboard from '@pages/dashboard/Dashboard';
import Profile from '@pages/profile/Profile';
import Marketplace from '@pages/marketplace/Marketplace';
import Projects from '@pages/projects/Projects';
import ProjectDetail from '@pages/projects/ProjectDetail';
import Chat from '@pages/chat/Chat';
import Settings from '@pages/settings/Settings';
import NotFound from '@pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'marketplace', element: <Marketplace /> },
      { path: 'profile/:id', element: <Profile /> },
    ],
  },

  // Auth Routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },

  // Protected Dashboard Routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },

  // Protected Project Routes
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Projects /> },
      { path: ':id', element: <ProjectDetail /> },
    ],
  },

  // Protected Chat Route
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Chat /> },
      { path: ':userId', element: <Chat /> },
    ],
  },

  // Protected Settings Route
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Settings /> },
    ],
  },

  // 404 Not Found
  { path: '*', element: <NotFound /> },
]);

export default router;
