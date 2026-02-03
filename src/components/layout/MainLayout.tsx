import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/staff': 'Staff Management',
  '/clients': 'Client Management',
  '/projects': 'Project Management',
  '/payroll': 'Payroll',
  '/settings': 'Settings',
};

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const currentTitle = pageTitles[location.pathname] || 'Boxway';

  return (
    <div className="min-h-screen bg-[#F6EFE6]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
          }`}
      >
        <Header
          title={currentTitle}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="px-6 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
