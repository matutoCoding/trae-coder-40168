import { useState, useEffect } from 'react';
import { Calendar, Users, Store, CheckCircle, BarChart3, RefreshCw, Info, AlertCircle } from 'lucide-react';
import { StatsCard } from '@/components/feedback/StatsCard';
import { EffectChart } from '@/components/feedback/EffectChart';
import { ScriptRanking } from '@/components/feedback/ScriptRanking';
import { DataImport } from '@/components/feedback/DataImport';
import { CrossComparison } from '@/components/feedback/CrossComparison';
import { useScriptStore } from '@/store/useScriptStore';
import type { AudienceId, PurposeId } from '@/types';
import { audienceGroups, contactPurposes } from '@/data/mockData';
import { cn } from '@/lib/utils';

const audienceOptions = [
  { value: 'all', label: '全部人群' },
  ...audienceGroups.map(g => ({ value: g.id, label: g.name }))
];

const purposeOptions = [
  { value: 'all', label: '全部目的' },
  ...contactPurposes.map(p => ({ value: p.id, label: p.name }))
];

export function FeedbackPage() {
  const { contactRecords, lastImportedDateRange } = useScriptStore();
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2026-06-01',
    end: '2026-06-30'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison'>('overview');
  const [showImportAlert, setShowImportAlert] = useState(false);

  useEffect(() => {
    if (lastImportedDateRange) {
      setShowImportAlert(true);
    }
  }, [lastImportedDateRange]);

  const applyImportedRange = () => {
    if (lastImportedDateRange) {
      setDateRange(lastImportedDateRange);
      setShowImportAlert(false);
    }
  };

  const resetFilters = () => {
    setAudienceFilter('all');
    setPurposeFilter('all');
    setDateRange({ start: '2026-06-01', end: '2026-06-30' });
  };

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

  const hasActiveFilter = audienceFilter !== 'all' || purposeFilter !== 'all' || 
    dateRange.start !== '2026-06-01' || dateRange.end !== '2026-06-30';

  const handleImportSuccess = (range: { start: string; end: string }) => {
    setDateRange(range);
    setShowImportAlert(false);
  };

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

      {showImportAlert && lastImportedDateRange && (
        <div className="animate-fade-in-up bg-gentle-50 border-2 border-gentle-200 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gentle-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-gentle-600" />
              </div>
              <div>
                <p className="font-semibold text-gentle-700">检测到新导入的数据</p>
                <p className="text-sm text-gentle-600 mt-1">
                  导入数据日期范围：<span className="font-medium">{lastImportedDateRange.start}</span> 至 <span className="font-medium">{lastImportedDateRange.end}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowImportAlert(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                暂不切换
              </button>
              <button
                onClick={applyImportedRange}
                className="px-5 py-2 bg-gentle-600 text-white rounded-xl hover:bg-gentle-700 transition-colors text-sm font-medium"
              >
                查看本次导入
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card animate-fade-in-up stagger-1">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h4 className="font-semibold text-ink flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            筛选条件
          </h4>
          {hasActiveFilter && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重置筛选
            </button>
          )}
        </div>
        
        {hasActiveFilter && (
          <div className="mb-4 flex flex-wrap gap-2">
            {audienceFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                人群: {audienceOptions.find(o => o.value === audienceFilter)?.label}
                <button onClick={() => setAudienceFilter('all')} className="hover:text-primary-900">×</button>
              </span>
            )}
            {purposeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-sm">
                目的: {purposeOptions.find(o => o.value === purposeFilter)?.label}
                <button onClick={() => setPurposeFilter('all')} className="hover:text-accent-900">×</button>
              </span>
            )}
            {(dateRange.start !== '2026-06-01' || dateRange.end !== '2026-06-30') && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gentle-50 text-gentle-700 rounded-full text-sm">
                日期: {dateRange.start} ~ {dateRange.end}
                <button onClick={resetFilters} className="hover:text-gentle-900">×</button>
              </span>
            )}
          </div>
        )}

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

        {filteredRecords.length === 0 && contactRecords.length > 0 && (
          <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning-700">当前筛选条件下没有数据</p>
              <p className="text-xs text-warning-600 mt-1">
                建议调整日期范围或重置筛选条件。系统共存在 {contactRecords.length} 条历史记录。
              </p>
            </div>
          </div>
        )}
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

      <div className="flex items-center gap-2 animate-fade-in-up">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
            activeTab === 'overview'
              ? 'bg-primary-600 text-white shadow-card'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          )}
        >
          数据总览
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={cn(
            'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
            activeTab === 'comparison'
              ? 'bg-primary-600 text-white shadow-card'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          )}
        >
          交叉对比分析
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
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
              <DataImport onImportSuccess={handleImportSuccess} />
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
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">目的</th>
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
                          <td className="px-3 py-2 text-gray-600 text-xs">{record.contactDate}</td>
                          <td className="px-3 py-2 text-xs">
                            {audienceGroups.find(a => a.id === record.audienceId)?.name}
                          </td>
                          <td className="px-3 py-2 text-xs">
                            {contactPurposes.find(p => p.id === record.purposeId)?.name}
                          </td>
                          <td className="px-3 py-2">
                            <span className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium',
                              record.scriptVersion === 'gentle' && 'bg-gentle-100 text-gentle-700',
                              record.scriptVersion === 'professional' && 'bg-primary-100 text-primary-700',
                              record.scriptVersion === 'family' && 'bg-accent-100 text-accent-700'
                            )}>
                              {record.scriptVersion === 'gentle' && '温和版'}
                              {record.scriptVersion === 'professional' && '专业版'}
                              {record.scriptVersion === 'family' && '家属版'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center text-xs">{record.sentCount}</td>
                          <td className="px-3 py-2 text-center text-xs text-primary-600">{record.consultationCount}</td>
                          <td className="px-3 py-2 text-center text-xs text-gentle-600">{record.visitCount}</td>
                          <td className="px-3 py-2 text-center text-xs text-accent-600">{record.redemptionCount}</td>
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
                    <p className="text-xs mt-1">请导入触达结果或调整筛选条件</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'comparison' && (
        <div className="animate-fade-in-up">
          <CrossComparison records={filteredRecords} />
        </div>
      )}
    </div>
  );
}
