import { AlertTriangle } from 'lucide-react';

interface ComplianceAlertProps {
  forbiddenPromises: string[];
}

export function ComplianceAlert({ forbiddenPromises }: ComplianceAlertProps) {
  return (
    <div className="mt-4 p-4 bg-warning-50 border-2 border-warning-200 rounded-xl animate-pulse-soft">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-warning-700 mb-2">
            ⚠️ 合规提醒 - 不应承诺的内容
          </p>
          <ul className="space-y-1">
            {forbiddenPromises.map((promise, index) => (
              <li 
                key={index} 
                className="text-sm text-warning-600 flex items-start gap-2"
              >
                <span className="text-warning-500 font-bold">•</span>
                <span>{promise}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
