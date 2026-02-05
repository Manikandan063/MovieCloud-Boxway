import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent';
  isSeamless?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  isSeamless = false,
  onClick,
}) => {
  const iconContainerClasses = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary text-primary-foreground',
    accent: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div
      onClick={onClick}
      className={`
      group transition-all duration-300 p-8 
      ${isSeamless
          ? 'bg-transparent'
          : 'bg-card border border-border rounded-xl hover:shadow-md'
        }
      ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
    `}>
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
          <p className="text-5xl font-display font-black text-foreground tracking-tighter tabular-nums leading-none">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground/70">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1.5 text-[11px] font-bold mt-3 ${trend.isPositive ? 'text-success' : 'text-destructive'
              }`}>
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-current/10">
                {trend.isPositive ? '↑' : '↓'}
              </span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal ml-0.5 uppercase tracking-wider">Growth</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${iconContainerClasses[variant]} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
