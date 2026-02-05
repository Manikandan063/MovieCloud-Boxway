import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';


const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


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
