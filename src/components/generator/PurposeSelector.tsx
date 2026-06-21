import { Calendar, Clock, ShoppingCart, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContactPurpose, PurposeId } from '@/types';

interface PurposeSelectorProps {
  purposes: ContactPurpose[];
  selected: PurposeId | null;
  onSelect: (id: PurposeId) => void;
}

const iconMap: Record<PurposeId, typeof Calendar> = {
  'expiry-reminder': Calendar,
  'pharmacist-appointment': Clock,
  'repurchase': ShoppingCart,
  'policy-explain': FileText
};

export function PurposeSelector({ purposes, selected, onSelect }: PurposeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-semibold text-lg text-ink">
        选择触达目的
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {purposes.map((purpose, index) => {
          const Icon = iconMap[purpose.id];
          const isSelected = selected === purpose.id;
          
          return (
            <button
              key={purpose.id}
              onClick={() => onSelect(purpose.id)}
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
                {purpose.name}
              </h4>
              
              <p className="text-sm text-gray-500">
                {purpose.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
