import { useState, useMemo } from 'react';
import { ArrowUpDown, Users, Store, CheckCircle } from 'lucide-react';
import type { ContactRecord, AudienceId, PurposeId, ScriptVersion, SortMetric, CrossComparisonData } from '@/types';
import { audienceGroups, contactPurposes } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CrossComparisonProps {
  records: ContactRecord[];
}

const versionLabels: Record<ScriptVersion, string> = {
  gentle: '温和提醒版',
  professional: '药师专业版',
  family: '家属协助版'
};

const versionColors: Record<ScriptVersion, { bg: string; text: string; bar: string }> = {
  gentle: { bg: 'bg-gentle-50', text: 'text-gentle-700', bar: 'bg-gentle-500' },
  professional: { bg: 'bg-primary-50', text: 'text-primary-700', bar: 'bg-primary-600' },
  family: { bg: 'bg-accent-50', text: 'text-accent-700', bar: 'bg-accent-500' }
};

const metricConfig: Record<SortMetric, { label: string; icon: typeof Users; color: string }> = {
  consultation: { label: '咨询率', icon: Users, color: 'text-primary-600' },
  visit: { label: '到店率', icon: Store, color: 'text-gentle-600' },
  redemption: { label: '核销率', icon: CheckCircle, color: 'text-accent-600' }
};

export function CrossComparison({ records }: CrossComparisonProps) {
  const [selectedAudience, setSelectedAudience] = useState<'all' | AudienceId>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<'all' | PurposeId>('all');
  const [sortMetric, setSortMetric] = useState<SortMetric>('visit');
  const [sortAsc, setSortAsc] = useState(false);

  const comparisonData = useMemo(() => {
    const filtered = records.filter(r => {
      const matchAudience = selectedAudience === 'all' || r.audienceId === selectedAudience;
      const matchPurpose = selectedPurpose === 'all' || r.purposeId === selectedPurpose;
      return matchAudience && matchPurpose;
    });

    const grouped = new Map<string, CrossComparisonData>();

    filtered.forEach(record => {
      const key = `${record.audienceId}-${record.purposeId}-${record.scriptVersion}`;
      const existing = grouped.get(key);

      if (existing) {
        existing.sentCount += record.sentCount;
        existing.consultationCount += record.consultationCount;
        existing.visitCount += record.visitCount;
        existing.redemptionCount += record.redemptionCount;
      } else {
        grouped.set(key, {
          audienceId: record.audienceId,
          purposeId: record.purposeId,
          scriptVersion: record.scriptVersion,
          sentCount: record.sentCount,
          consultationCount: record.consultationCount,
          visitCount: record.visitCount,
          redemptionCount: record.redemptionCount,
          consultationRate: 0,
          visitRate: 0,
          redemptionRate: 0
        });
      }
    });

    return Array.from(grouped.values()).map(item => ({
      ...item,
      consultationRate: item.sentCount > 0 ? (item.consultationCount / item.sentCount) * 100 : 0,
      visitRate: item.sentCount > 0 ? (item.visitCount / item.sentCount) * 100 : 0,
      redemptionRate: item.sentCount > 0 ? (item.redemptionCount / item.sentCount) * 100 : 0
    }));
  }, [records, selectedAudience, selectedPurpose]);

  const sortedData = useMemo(() => {
    const sorted = [...comparisonData].sort((a, b) => {
      const rateKey = `${sortMetric}Rate` as keyof CrossComparisonData;
      const aVal = a[rateKey] as number;
      const bVal = b[rateKey] as number;
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [comparisonData, sortMetric, sortAsc]);

  const groupedByAudienceAndPurpose = useMemo(() => {
    const groups = new Map<string, CrossComparisonData[]>();
    
    sortedData.forEach(item => {
      const key = `${item.audienceId}-${item.purposeId}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });
    
    return Array.from(groups.entries());
  }, [sortedData]);

  const handleSort = (metric: SortMetric) => {
    if (sortMetric === metric) {
      setSortAsc(!sortAsc);
    } else {
      setSortMetric(metric);
      setSortAsc(false);
    }
  };

  const getAudienceName = (id: AudienceId) => audienceGroups.find(a => a.id === id)?.name || id;
  const getPurposeName = (id: PurposeId) => contactPurposes.find(p => p.id === id)?.name || id;

  if (records.length === 0) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>暂无数据，请先导入触达结果</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h4 className="font-semibold text-ink">交叉对比分析</h4>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">排序指标:</label>
            {(Object.entries(metricConfig) as [SortMetric, typeof metricConfig[SortMetric]][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  sortMetric === key
                    ? cn('bg-gray-100', config.color)
                    : 'text-gray-500 hover:bg-gray-50'
                )}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label}
                {sortMetric === key && (
                  <ArrowUpDown className={cn(
                    'w-3 h-3 transition-transform',
                    sortAsc && 'rotate-180'
                  )} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-gray-500 mb-2 block">按人群筛选</label>
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value as typeof selectedAudience)}
            className="input-field py-2 text-sm"
          >
            <option value="all">全部人群</option>
            {audienceGroups.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block">按触达目的筛选</label>
          <select
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value as typeof selectedPurpose)}
            className="input-field py-2 text-sm"
          >
            <option value="all">全部目的</option>
            {contactPurposes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {groupedByAudienceAndPurpose.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
          当前筛选条件下暂无数据
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByAudienceAndPurpose.map(([key, items]) => {
            const [audienceId, purposeId] = key.split('-') as [AudienceId, PurposeId];
            const maxRate = Math.max(...items.map(i => i[`${sortMetric}Rate` as keyof CrossComparisonData] as number), 1);

            return (
              <div key={key} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-ink">{getAudienceName(audienceId)}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm text-gray-600">{getPurposeName(purposeId)}</span>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {items.map((item) => {
                    const colors = versionColors[item.scriptVersion];
                    const currentRate = item[`${sortMetric}Rate` as keyof CrossComparisonData] as number;
                    const barWidth = (currentRate / maxRate) * 100;

                    return (
                      <div key={`${item.audienceId}-${item.purposeId}-${item.scriptVersion}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium',
                            colors.bg,
                            colors.text
                          )}>
                            {versionLabels[item.scriptVersion]}
                          </span>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-500">发送 {item.sentCount}</span>
                            <span className="text-primary-600 font-medium">
                              咨询率 {item.consultationRate.toFixed(1)}%
                            </span>
                            <span className="text-gentle-600 font-medium">
                              到店率 {item.visitRate.toFixed(1)}%
                            </span>
                            <span className="text-accent-600 font-medium">
                              核销率 {item.redemptionRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-14">咨询率</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                style={{ width: `${(item.consultationRate / maxRate) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-primary-600 w-14 text-right font-medium">
                              {item.consultationRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-14">到店率</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gentle-500 rounded-full transition-all duration-500"
                                style={{ width: `${(item.visitRate / maxRate) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gentle-600 w-14 text-right font-medium">
                              {item.visitRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-14">核销率</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent-500 rounded-full transition-all duration-500"
                                style={{ width: `${(item.redemptionRate / maxRate) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-accent-600 w-14 text-right font-medium">
                              {item.redemptionRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
