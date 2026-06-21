import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ContactRecord, ScriptVersion } from '@/types';

interface EffectChartProps {
  records: ContactRecord[];
}

const versionNames: Record<ScriptVersion, string> = {
  gentle: '温和提醒版',
  professional: '药师专业版',
  family: '家属协助版'
};

const versionColors: Record<ScriptVersion, string> = {
  gentle: '#38A169',
  professional: '#1A5F7A',
  family: '#FF8C42'
};

export function EffectChart({ records }: EffectChartProps) {
  const chartData = records.map(record => ({
    name: versionNames[record.scriptVersion],
    咨询量: record.consultationCount,
    到店量: record.visitCount,
    核销量: record.redemptionCount,
    转化率: ((record.visitCount / record.sentCount) * 100).toFixed(1)
  }));

  return (
    <div className="card h-[400px]">
      <h4 className="font-semibold text-ink mb-4">话术效果对比</h4>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="咨询量" 
            fill={versionColors.gentle} 
            radius={[4, 4, 0, 0]}
            name="咨询量"
          />
          <Bar 
            dataKey="到店量" 
            fill={versionColors.professional} 
            radius={[4, 4, 0, 0]}
            name="到店量"
          />
          <Bar 
            dataKey="核销量" 
            fill={versionColors.family} 
            radius={[4, 4, 0, 0]}
            name="核销量"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
