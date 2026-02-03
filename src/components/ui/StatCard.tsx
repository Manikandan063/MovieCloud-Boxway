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
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  const iconContainerClasses = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary text-primary-foreground',
    accent: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div className="stat-card group hover:shadow-md transition-all duration-300 p-5 bg-card border border-border rounded-xl">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-display font-bold text-foreground tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-[11px] font-semibold mt-2 ${trend.isPositive ? 'text-success' : 'text-destructive'
              }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal ml-0.5">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${iconContainerClasses[variant]} group-hover:bg-opacity-80 transition-all duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
