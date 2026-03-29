import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@hooks';
import { useState } from 'react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isEditor = user?.role === 'editor';
  const isClient = user?.role === 'client';

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard 
    },
    { 
      path: '/projects', 
      label: 'Projects', 
      icon: FolderKanban 
    },
    { 
      path: '/chat', 
      label: 'Messages', 
      icon: MessageSquare,
      badge: 3
    },
    ...(isEditor ? [
      { 
        path: '/marketplace', 
        label: 'Find Work', 
        icon: Briefcase 
      },
      { 
        path: '/earnings', 
        label: 'Earnings', 
        icon: Wallet 
      },
    ] : []),
    ...(isClient ? [
      { 
        path: '/marketplace', 
        label: 'Hire Editors', 
        icon: User 
      },
    ] : []),
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings 
    },
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-dark-800/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-dark-700 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <div className="p-4">
        {/* User Info */}
        <div className={`flex items-center mb-8 ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-semibold truncate">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} 
                px-3 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-500/20 to-accent-400/20 text-white border border-primary-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              
              {/* Badge */}
              {item.badge && (
                <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} 
                  w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center`}>
                  {item.badge}
                </span>
              )}
              
              {/* Tooltip for collapsed */}
              {collapsed && (
                <div className="absolute left-14 bg-dark-700 px-3 py-1.5 rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
