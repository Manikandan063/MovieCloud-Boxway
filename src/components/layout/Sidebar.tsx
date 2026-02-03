import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth, type UserRole } from '@/context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'architect', 'hr', 'accountant', 'intern'] },
  { path: '/staff', icon: Users, label: 'Staff', roles: ['admin', 'hr'] },
  { path: '/clients', icon: Briefcase, label: 'Clients', roles: ['admin', 'architect'] },
  { path: '/projects', icon: Building2, label: 'Projects', roles: ['admin', 'architect', 'intern'] },
  { path: '/payroll', icon: CreditCard, label: 'Payroll', roles: ['admin', 'accountant', 'hr'] },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#3E2C24] flex flex-col transition-all duration-300 z-40 ${collapsed ? 'w-[72px]' : 'w-[260px]'
        } border-r border-white/5`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#CFAE70] rounded-full" />
            <span className="font-bold text-xl tracking-[0.1em] uppercase text-white">Boxway</span>
          </div>
        )}
        {collapsed && (
          <div className="w-6 h-6 border border-[#CFAE70] rounded-full flex items-center justify-center mx-auto">
            <div className="w-1.5 h-1.5 bg-[#CFAE70] rounded-full" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors ${collapsed ? 'hidden' : ''}`}
        >
          <ChevronLeft className="w-5 h-5 text-sidebar-muted" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {filteredNavItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 group
                ${isActive
                  ? 'bg-white/5 text-[#CFAE70] border-r-2 border-[#CFAE70]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }
                ${collapsed ? 'justify-center px-0' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        {user && ['admin', 'architect', 'hr', 'accountant'].includes(user.role) && (
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 mb-2
              ${isActive
                ? 'bg-white/5 text-[#CFAE70] border-r-2 border-[#CFAE70]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }
              ${collapsed ? 'justify-center px-0' : ''}
            `}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        )}
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-3 mb-4 bg-white/5">
            <div className="flex-1 min-w-0 px-2">
              <p className="text-[10px] font-bold text-white uppercase tracking-wider truncate">{user.name}</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`
            flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500
            text-white/40 hover:text-red-400 hover:bg-red-400/5 w-full
            ${collapsed ? 'justify-center px-0' : ''}
          `}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle (when collapsed) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 bg-sidebar rounded-full border border-sidebar-border flex items-center justify-center hover:bg-sidebar-accent transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-sidebar-muted" />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
