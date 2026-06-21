import { useState } from 'react';
import { Calendar, Users, Store, CheckCircle, BarChart3 } from 'lucide-react';
import { StatsCard } from '@/components/feedback/StatsCard';
import { EffectChart } from '@/components/feedback/EffectChart';
import { ScriptRanking } from '@/components/feedback/ScriptRanking';
import { DataImport } from '@/components/feedback/DataImport';
import { useScriptStore } from '@/store/useScriptStore';
import type { AudienceId, PurposeId } from '@/types';
import { audienceGroups, contactPurposes } from '@/data/mockData';

const audienceOptions = [
  { value: 'all', label: '全部人群' },
  ...audienceGroups.map(g => ({ value: g.id, label: g.name }))
];

const purposeOptions = [
  { value: 'all', label: '全部目的' },
  ...contactPurposes.map(p => ({ value: p.id, label: p.name }))
];

export function FeedbackPage() {
  const { contactRecords } = useScriptStore();
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2026-06-01',
    end: '2026-06-30'
  });

  const filteredRecords = contactRecords.filter(record => {
    const matchAudience = audienceFilter === 'all' || record.audienceId === audienceFilter;
    const matchPurpose = purposeFilter === 'all' || record.purposeId === purposeFilter;
    const matchDate = record.contactDate >= dateRange.start && record.contactDate <= dateRange.end;
    return matchAudience && matchPurpose && matchDate;
  });

  const totalSent = filteredRecords.reduce((sum, r) => sum + r.sentCount, 0);
  const totalConsultation = filteredRecords.reduce((sum, r) => sum + r.consultationCount, 0);
  const totalVisit = filteredRecords.reduce((sum, r) => sum + r.visitCount, 0);
  const totalRedemption = filteredRecords.reduce((sum, r) => sum + r.redemptionCount, 0);

  const consultationRate = totalSent > 0 ? (totalConsultation / totalSent * 100) : 0;
  const visitRate = totalSent > 0 ? (totalVisit / totalSent * 100) : 0;
  const redemptionRate = totalSent > 0 ? (totalRedemption / totalSent * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="font-serif font-bold text-2xl text-ink mb-2">
          反馈归类
        </h2>
        <p className="text-gray-500">
          导入店员回填结果，查看各话术版本的转化效果
        </p>
      </div>

      <div className="card animate-fade-in-up stagger-1">
        <h4 className="font-semibold text-ink mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          筛选条件
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">触达人群</label>
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="input-field"
            >
              {audienceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-2 block">触达目的</label>
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="input-field"
            >
              {purposeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-2 block">开始日期</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-2 block">结束日期</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up stagger-1">
          <StatsCard
            title="总发送量"
            value={totalSent}
            subtitle="条消息"
            trend={12}
            icon={BarChart3}
            color="primary"
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatsCard
            title="咨询量"
            value={totalConsultation}
            subtitle={`咨询率 ${consultationRate.toFixed(1)}%`}
            trend={8}
            icon={Users}
            color="gentle"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatsCard
            title="到店量"
            value={totalVisit}
            subtitle={`到店率 ${visitRate.toFixed(1)}%`}
            trend={15}
            icon={Store}
            color="accent"
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatsCard
            title="核销量"
            value={totalRedemption}
            subtitle={`核销率 ${redemptionRate.toFixed(1)}%`}
            trend={22}
            icon={CheckCircle}
            color="warning"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fade-in-up stagger-2">
          {filteredRecords.length > 0 ? (
            <EffectChart records={filteredRecords} />
          ) : (
            <div className="card h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无符合条件的数据</p>
              </div>
            </div>
          )}
        </div>
        <div className="animate-fade-in-up stagger-3">
          {filteredRecords.length > 0 ? (
            <ScriptRanking records={filteredRecords} />
          ) : (
            <div className="card h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无排行数据</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in-up stagger-4">
          <DataImport />
        </div>
        
        <div className="card animate-fade-in-up stagger-5">
          <h4 className="font-semibold text-ink mb-4">数据明细</h4>
          {filteredRecords.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">日期</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">人群</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">版本</th>
                    <th className="px-3 py-2 text-center text-gray-600 font-medium">发送</th>
                    <th className="px-3 py-2 text-center text-gray-600 font-medium">咨询</th>
                    <th className="px-3 py-2 text-center text-gray-600 font-medium">到店</th>
                    <th className="px-3 py-2 text-center text-gray-600 font-medium">核销</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">{record.contactDate}</td>
                      <td className="px-3 py-2">
                        {audienceGroups.find(a => a.id === record.audienceId)?.name}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${record.scriptVersion === 'gentle' ? 'bg-gentle-100 text-gentle-700' : ''}
                          ${record.scriptVersion === 'professional' ? 'bg-primary-100 text-primary-700' : ''}
                          ${record.scriptVersion === 'family' ? 'bg-accent-100 text-accent-700' : ''}
                        `}>
                          {record.scriptVersion === 'gentle' && '温和版'}
                          {record.scriptVersion === 'professional' && '专业版'}
                          {record.scriptVersion === 'family' && '家属版'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">{record.sentCount}</td>
                      <td className="px-3 py-2 text-center text-primary-600">{record.consultationCount}</td>
                      <td className="px-3 py-2 text-center text-gentle-600">{record.visitCount}</td>
                      <td className="px-3 py-2 text-center text-accent-600">{record.redemptionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无明细数据</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
