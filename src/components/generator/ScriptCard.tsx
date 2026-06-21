import { useNavigate } from 'react-router-dom';
import { Eye, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { ScriptTemplate, ScriptVersion } from '@/types';
import { ComplianceAlert } from './ComplianceAlert';
import { useScriptStore, replacePlaceholders } from '@/store/useScriptStore';

interface ScriptCardProps {
  script: ScriptTemplate;
  index: number;
  isSelected: boolean;
  onSelect: (version: ScriptVersion) => void;
}

const colorClasses: Record<string, { header: string; border: string; bg: string }> = {
  gentle: {
    header: 'bg-gentle-500 text-white',
    border: 'border-gentle-200',
    bg: 'bg-gentle-50'
  },
  primary: {
    header: 'bg-primary-600 text-white',
    border: 'border-primary-200',
    bg: 'bg-primary-50'
  },
  accent: {
    header: 'bg-accent-500 text-white',
    border: 'border-accent-200',
    bg: 'bg-accent-50'
  }
};

export function ScriptCard({ script, index, isSelected, onSelect }: ScriptCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { placeholders, setSelectedVersion } = useScriptStore();
  
  const colors = colorClasses[script.versionColor];
  
  const handlePreview = () => {
    onSelect(script.version);
    setSelectedVersion(script.version);
    navigate('/preview');
  };
  
  const handleCopy = async () => {
    const content = replacePlaceholders(script.content, placeholders);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div 
      className={cn(
        'rounded-2xl overflow-hidden shadow-card transition-all duration-500',
        'animate-fade-in-up',
        `stagger-${index + 1}`,
        isSelected && 'ring-2 ring-primary-500 ring-offset-2 scale-[1.01] shadow-card-hover'
      )}
    >
      <div className={cn('px-5 py-4', colors.header)}>
        <h4 className="font-semibold">{script.versionName}</h4>
      </div>
      
      <div className={cn('p-5 border-2 border-t-0', colors.border, 'bg-white')}>
        <div className={cn('p-4 rounded-xl mb-4 min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed text-ink', colors.bg)}>
          {script.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 && line ? 'mt-2' : ''}>
              {line}
            </p>
          ))}
        </div>
        
        <ComplianceAlert forbiddenPromises={script.forbiddenPromises} />
        
        <div className="mt-5 flex gap-3">
          <button
            onClick={handlePreview}
            className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2.5"
          >
            <Eye className="w-4 h-4" />
            <span>预览消息</span>
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all duration-300',
              copied 
                ? 'bg-gentle-500 text-white' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>复制话术</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
