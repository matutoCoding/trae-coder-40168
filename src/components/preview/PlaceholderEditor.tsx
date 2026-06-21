import { MapPin, User, Clock } from 'lucide-react';
import type { PlaceholderConfig } from '@/types';

interface PlaceholderEditorProps {
  placeholders: PlaceholderConfig;
  onChange: (config: Partial<PlaceholderConfig>) => void;
}

const fields = [
  {
    key: 'storeAddress' as const,
    label: '门店地址',
    icon: MapPin,
    placeholder: '例如：北京市朝阳区XX路XX号XX药店'
  },
  {
    key: 'pharmacistName' as const,
    label: '药师姓名',
    icon: User,
    placeholder: '例如：张药师'
  },
  {
    key: 'consultationTime' as const,
    label: '可咨询时间',
    icon: Clock,
    placeholder: '例如：周一至周五 9:00-18:00'
  }
];

export function PlaceholderEditor({ placeholders, onChange }: PlaceholderEditorProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-ink">编辑占位符信息</h4>
      <p className="text-sm text-gray-500">
        填写以下信息，系统将自动替换话术中的占位符
      </p>
      
      <div className="space-y-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Icon className="w-4 h-4 text-primary-500" />
                {field.label}
              </label>
              <input
                type="text"
                value={placeholders[field.key]}
                onChange={(e) => onChange({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="input-field"
              />
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-primary-50 rounded-xl">
        <p className="text-sm text-primary-700 font-medium mb-2">
          📝 替换说明
        </p>
        <ul className="text-xs text-primary-600 space-y-1">
          <li>• 【门店地址】将替换为您填写的门店地址</li>
          <li>• 【药师姓名】将替换为您填写的药师姓名</li>
          <li>• 【可咨询时间】将替换为您填写的咨询时间</li>
        </ul>
      </div>
    </div>
  );
}
