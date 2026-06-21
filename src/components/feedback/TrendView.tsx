import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ContactRecord, AudienceId, PurposeId, ScriptVersion } from '@/types';
import { audienceGroups, contactPurposes } from '@/data/mockData';

interface TrendViewProps {
  records: ContactRecord[];
}

type TimeGranularity = 'week' | 'month';

const versionLabels: Record<ScriptVersion, string> = {
  gentle: '温和提醒版',
  professional: '药师专业版',
  family: '家属协助版'
};

const versionLineColors: Record<ScriptVersion, string> = {
  gentle: '#38A169',
  professional: '#1A5F7A',
  family: '#FF8C42'
};

function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const d = String(monday.getDate()).padStart(2, '0');
  return `${monday.getFullYear()}-${m}-${d}`;
}

function getMonthKey(dateStr: string): string {
  return dateStr.substring(0, 7);
}

function formatDateLabel(key: string, granularity: TimeGranularity): string {
  if (granularity === 'month') {
    const [y, m] = key.split('-');
    return `${parseInt(m)}月`;
  }
  const [y, m, d] = key.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

export function TrendView({ records }: TrendViewProps) {
  const [granularity, setGranularity] = useState<TimeGranularity>('week');
  const [selectedAudience, setSelectedAudience] = useState<'all' | AudienceId>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<'all' | PurposeId>('all');
  const [selectedMetric, setSelectedMetric] = useState<'consultationRate' | 'visitRate' | 'redemptionRate'>('visitRate');

  const metricLabels: Record<string, string> = {
    consultationRate: '咨询率',
    visitRate: '到店率',
    redemptionRate: '核销率'
  };

  const chartData = useMemo(() => {
    const filtered = records.filter(r => {
      const matchAudience = selectedAudience === 'all' || r.audienceId === selectedAudience;
      const matchPurpose = selectedPurpose === 'all' || r.purposeId === selectedPurpose;
      return matchAudience && matchPurpose;
    });

    if (filtered.length === 0) return [];

    const getKey = granularity === 'week' ? getWeekKey : getMonthKey;

    const buckets = new Map<string, Map<ScriptVersion, { sent: number; consultation: number; visit: number; redemption: number }>>();

    filtered.forEach(record => {
      const periodKey = getKey(record.contactDate);
      if (!buckets.has(periodKey)) {
        buckets.set(periodKey, new Map());
      }
      const periodBuckets = buckets.get(periodKey)!;
      if (!periodBuckets.has(record.scriptVersion)) {
        periodBuckets.set(record.scriptVersion, { sent: 0, consultation: 0, visit: 0, redemption: 0 });
      }
      const bucket = periodBuckets.get(record.scriptVersion)!;
      bucket.sent += record.sentCount;
      bucket.consultation += record.consultationCount;
      bucket.visit += record.visitCount;
      bucket.redemption += record.redemptionCount;
    });

    const sortedKeys = Array.from(buckets.keys()).sort();

    return sortedKeys.map(periodKey => {
      const periodBuckets = buckets.get(periodKey)!;
      const row: Record<string, string | number> = {
        period: formatDateLabel(periodKey, granularity),
        periodKey
      };

      (['gentle', 'professional', 'family'] as ScriptVersion[]).forEach(version => {
        const bucket = periodBuckets.get(version);
        if (bucket && bucket.sent > 0) {
          row[`${version}ConsultationRate`] = +(bucket.consultation / bucket.sent * 100).toFixed(1);
          row[`${version}VisitRate`] = +(bucket.visit / bucket.sent * 100).toFixed(1);
          row[`${version}RedemptionRate`] = +(bucket.redemption / bucket.sent * 100).toFixed(1);
        }
      });

      return row;
    });
  }, [records, granularity, selectedAudience, selectedPurpose]);

  const lineDataKey = (version: ScriptVersion) => {
    const metricMap: Record<string, string> = {
      consultationRate: `${version}ConsultationRate`,
      visitRate: `${version}VisitRate`,
      redemptionRate: `${version}RedemptionRate`
    };
    return metricMap[selectedMetric];
  };

  if (records.length === 0) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">暂无数据</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h4 className="font-semibold text-ink">转化率趋势</h4>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setGranularity('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                granularity === 'week' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              按周
            </button>
            <button
              onClick={() => setGranularity('month')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                granularity === 'month' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              按月
            </button>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(['consultationRate', 'visitRate', 'redemptionRate'] as const).map(metric => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedMetric === metric ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                {metricLabels[metric]}
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

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
          当前筛选条件下暂无数据
        </div>
      ) : (
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="period"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              {(['gentle', 'professional', 'family'] as ScriptVersion[]).map(version => (
                <Line
                  key={version}
                  type="monotone"
                  dataKey={lineDataKey(version)}
                  stroke={versionLineColors[version]}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: versionLineColors[version] }}
                  activeDot={{ r: 6 }}
                  name={versionLabels[version]}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
