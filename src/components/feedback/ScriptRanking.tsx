import { Trophy, Users, Store, CheckCircle } from 'lucide-react';
import type { ContactRecord, ScriptVersion } from '@/types';
import { cn } from '@/lib/utils';

interface ScriptRankingProps {
  records: ContactRecord[];
}

const versionNames: Record<ScriptVersion, string> = {
  gentle: '温和提醒版',
  professional: '药师专业版',
  family: '家属协助版'
};

const versionColors: Record<ScriptVersion, { bg: string; text: string }> = {
  gentle: { bg: 'bg-gentle-100', text: 'text-gentle-700' },
  professional: { bg: 'bg-primary-100', text: 'text-primary-700' },
  family: { bg: 'bg-accent-100', text: 'text-accent-700' }
};

const rankColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

export function ScriptRanking({ records }: ScriptRankingProps) {
  const aggregatedData = records.reduce((acc, record) => {
    const existing = acc.find(item => item.scriptVersion === record.scriptVersion);
    if (existing) {
      existing.sentCount += record.sentCount;
      existing.consultationCount += record.consultationCount;
      existing.visitCount += record.visitCount;
      existing.redemptionCount += record.redemptionCount;
    } else {
      acc.push({ ...record });
    }
    return acc;
  }, [] as ContactRecord[]);
  
  const rankedData = aggregatedData
    .map(item => ({
      ...item,
      conversionRate: (item.visitCount / item.sentCount) * 100,
      consultationRate: (item.consultationCount / item.sentCount) * 100,
      redemptionRate: (item.redemptionCount / item.sentCount) * 100
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate);

  return (
    <div className="card">
      <h4 className="font-semibold text-ink mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent-500" />
        话术效果排行
      </h4>
      
      <div className="space-y-4">
        {rankedData.map((item, index) => {
          const colors = versionColors[item.scriptVersion];
          return (
            <div 
              key={item.scriptVersion}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-300',
                index === 0 ? 'border-accent-200 bg-accent-50' : 'border-gray-100 bg-white'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                    rankColors[index]
                  )}>
                    {index === 0 ? (
                      <Trophy className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    colors.bg,
                    colors.text
                  )}>
                    {versionNames[item.scriptVersion]}
                  </span>
                </div>
                <span className="text-2xl font-bold font-serif text-ink">
                  {item.conversionRate.toFixed(1)}%
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">咨询率</span>
                  </div>
                  <p className="font-semibold text-primary-600">
                    {item.consultationRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <Store className="w-4 h-4" />
                    <span className="text-xs">到店率</span>
                  </div>
                  <p className="font-semibold text-gentle-600">
                    {item.conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">核销率</span>
                  </div>
                  <p className="font-semibold text-accent-600">
                    {item.redemptionRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full rounded-full transition-all duration-1000',
                    index === 0 ? 'bg-accent-500' : index === 1 ? 'bg-primary-500' : 'bg-gentle-500'
                  )}
                  style={{ width: `${item.conversionRate}%` }}
                />
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                发送 {item.sentCount} 条 · 咨询 {item.consultationCount} 人 · 到店 {item.visitCount} 人 · 核销 {item.redemptionCount} 人
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
