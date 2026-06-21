import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  trend?: number;
  icon: React.ElementType;
  color: 'primary' | 'gentle' | 'accent' | 'warning';
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-50',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    value: 'text-primary-700'
  },
  gentle: {
    bg: 'bg-gentle-50',
    iconBg: 'bg-gentle-100',
    iconColor: 'text-gentle-600',
    value: 'text-gentle-700'
  },
  accent: {
    bg: 'bg-accent-50',
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-600',
    value: 'text-accent-700'
  },
  warning: {
    bg: 'bg-warning-50',
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
    value: 'text-warning-700'
  }
};

export function StatsCard({ title, value, subtitle, trend, icon: Icon, color }: StatsCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={cn('card', colors.bg, 'border-none')}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={cn('text-3xl font-bold font-serif', colors.value)}>
            {value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm',
              trend > 0 ? 'text-gentle-600' : trend < 0 ? 'text-warning-600' : 'text-gray-500'
            )}>
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span>{Math.abs(trend)}% 较上周</span>
            </div>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors.iconBg)}>
          <Icon className={cn('w-6 h-6', colors.iconColor)} />
        </div>
      </div>
    </div>
  );
}
