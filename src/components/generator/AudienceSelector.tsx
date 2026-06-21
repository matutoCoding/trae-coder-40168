import { HeartPulse, CreditCard, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AudienceGroup, AudienceId } from '@/types';

interface AudienceSelectorProps {
  audiences: AudienceGroup[];
  selected: AudienceId | null;
  onSelect: (id: AudienceId) => void;
}

const iconMap: Record<string, typeof HeartPulse> = {
  'heart-pulse': HeartPulse,
  'credit-card': CreditCard,
  'users': Users
};

export function AudienceSelector({ audiences, selected, onSelect }: AudienceSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-semibold text-lg text-ink">
        选择触达人群
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {audiences.map((audience, index) => {
          const Icon = iconMap[audience.icon];
          const isSelected = selected === audience.id;
          
          return (
            <button
              key={audience.id}
              onClick={() => onSelect(audience.id)}
              className={cn(
                'card card-hover text-left relative overflow-hidden',
                'transition-all duration-300 animate-fade-in-up',
                `stagger-${index + 1}`,
                isSelected && 'ring-2 ring-primary-500 ring-offset-2 scale-[1.02]'
              )}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300',
                isSelected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
              )}>
                <Icon className="w-6 h-6" />
              </div>
              
              <h4 className={cn(
                'font-semibold mb-2 transition-colors duration-300',
                isSelected ? 'text-primary-600' : 'text-ink'
              )}>
                {audience.name}
              </h4>
              
              <p className="text-sm text-gray-500">
                {audience.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
