import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserIcon from '@/components/ui/UserIcon';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-[#F6EFE6] border-b border-[#1F1F1F]/10 flex items-center justify-between px-8 md:px-12 sticky top-0 z-30">
      <div className="flex items-center gap-6">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 lg:hidden"
          >
            <Menu className="w-5 h-5 text-[#1F1F1F]" />
          </button>
        )}
        {title && (
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-[#1F1F1F] border-l-2 border-[#6B8E23] pl-6 transition-all animate-in fade-in slide-in-from-left-4">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-8">
        {/* Notifications */}
        <button className="relative p-2 text-[#1F1F1F]/60 hover:text-[#CFAE70] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#CFAE70] rounded-full" />
        </button>

        {/* User */}
        {user && (
          <div className="flex items-center gap-6 pl-8 border-l border-[#1F1F1F]/10">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-[#1F1F1F] uppercase tracking-wider">{user.name}</p>
              <p className="text-[9px] text-[#8E8E8E] uppercase tracking-widest mt-0.5">{user.role}</p>
            </div>
            <div className="w-10 h-10 border border-[#1F1F1F]/20 flex items-center justify-center group cursor-pointer hover:border-[#CFAE70] transition-all">
              <UserIcon size={20} className="group-hover:scale-110 transition-transform" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
