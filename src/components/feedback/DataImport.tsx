import { Upload, FileText, X, Check, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { useScriptStore } from '@/store/useScriptStore';
import type { AudienceId, PurposeId, ScriptVersion, CSVRowValidation } from '@/types';
import { cn } from '@/lib/utils';

interface SimpleImportRow {
  audienceId: AudienceId;
  purposeId: PurposeId;
  scriptVersion: ScriptVersion;
  contactDate: string;
  sentCount: number;
  consultationCount: number;
  visitCount: number;
  redemptionCount: number;
}

const audienceMap: Record<string, AudienceId> = {
  '高血压复购会员': 'hypertension',
  '个账支付会员': 'personal-account',
  '家庭账户咨询会员': 'family-binding',
  'hypertension': 'hypertension',
  'personal-account': 'personal-account',
  'family-binding': 'family-binding'
};

const purposeMap: Record<string, PurposeId> = {
  '权益到期提醒': 'expiry-reminder',
  '药师服务预约': 'pharmacist-appointment',
  '健康品类复购': 'repurchase',
  '政策解释': 'policy-explain',
  'expiry-reminder': 'expiry-reminder',
  'pharmacist-appointment': 'pharmacist-appointment',
  'repurchase': 'repurchase',
  'policy-explain': 'policy-explain'
};

const versionMap: Record<string, ScriptVersion> = {
  '温和提醒版': 'gentle',
  '药师专业版': 'professional',
  '家属协助版': 'family',
  'gentle': 'gentle',
  'professional': 'professional',
  'family': 'family'
};

const audienceLabels: Record<AudienceId, string> = {
  'hypertension': '高血压复购会员',
  'personal-account': '个账支付会员',
  'family-binding': '家庭账户咨询会员'
};

const purposeLabels: Record<PurposeId, string> = {
  'expiry-reminder': '权益到期提醒',
  'pharmacist-appointment': '药师服务预约',
  'repurchase': '健康品类复购',
  'policy-explain': '政策解释'
};

const versionLabels: Record<ScriptVersion, string> = {
  'gentle': '温和提醒版',
  'professional': '药师专业版',
  'family': '家属协助版'
};

const validateNumber = (value: string, fieldName: string, requirePositive = false): { valid: boolean; errors: string[]; parsed: number | null } => {
  const errors: string[] = [];
  
  if (!value || value.trim() === '') {
    errors.push(`${fieldName}不能为空`);
    return { valid: false, errors, parsed: null };
  }
  
  const trimmed = value.trim();
  if (isNaN(Number(trimmed))) {
    errors.push(`${fieldName}必须是数字，当前值"${trimmed}"无效`);
    return { valid: false, errors, parsed: null };
  }
  
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) {
    errors.push(`${fieldName}必须是整数`);
    return { valid: false, errors, parsed: null };
  }
  
  if (requirePositive && parsed <= 0) {
    errors.push(`${fieldName}必须大于0，当前值${parsed}无效`);
    return { valid: false, errors, parsed: null };
  }
  
  if (parsed < 0) {
    errors.push(`${fieldName}不能为负数，当前值${parsed}无效`);
    return { valid: false, errors, parsed: null };
  }
  
  return { valid: true, errors, parsed };
};

const validateDate = (value: string): { valid: boolean; errors: string[]; parsed: string } => {
  const errors: string[] = [];
  
  if (!value || value.trim() === '') {
    const today = new Date().toISOString().split('T')[0];
    errors.push('日期为空，已自动填充为今天');
    return { valid: true, errors, parsed: today };
  }
  
  const trimmed = value.trim();
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(trimmed)) {
    const today = new Date().toISOString().split('T')[0];
    errors.push(`日期格式"${trimmed}"不正确，应为YYYY-MM-DD，已自动填充为今天`);
    return { valid: true, errors, parsed: today };
  }
  
  const date = new Date(trimmed);
  if (isNaN(date.getTime())) {
    const today = new Date().toISOString().split('T')[0];
    errors.push(`日期"${trimmed}"无效，已自动填充为今天`);
    return { valid: true, errors, parsed: today };
  }
  
  return { valid: true, errors, parsed: trimmed };
};

interface DataImportProps {
  onImportSuccess?: (dateRange: { start: string; end: string }) => void;
}

export function DataImport({ onImportSuccess }: DataImportProps) {
  const { importContactRecords } = useScriptStore();
  const [isDragging, setIsDragging] = useState(false);
  const [validatedRows, setValidatedRows] = useState<CSVRowValidation[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseAndValidateCSV = (text: string): CSVRowValidation[] => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return [];
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map((line, idx) => {
      const rowIndex = idx + 2;
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      const errors: string[] = [];
      
      const rawAudience = row['触达人群'] || row['audienceId'] || '';
      const rawPurpose = row['触达目的'] || row['purposeId'] || '';
      const rawVersion = row['话术版本'] || row['scriptVersion'] || '';
      const rawDate = row['触达日期'] || row['contactDate'] || '';
      const rawSent = row['发送数量'] || row['sentCount'] || '';
      const rawConsult = row['咨询量'] || row['consultationCount'] || '';
      const rawVisit = row['到店量'] || row['visitCount'] || '';
      const rawRedemption = row['核销量'] || row['redemptionCount'] || '';
      
      let audienceId: AudienceId = 'hypertension';
      if (!rawAudience) {
        errors.push('触达人群为空，已默认为"高血压复购会员"');
      } else if (!audienceMap[rawAudience]) {
        errors.push(`触达人群"${rawAudience}"无法识别，已默认为"高血压复购会员"`);
      } else {
        audienceId = audienceMap[rawAudience];
      }
      
      let purposeId: PurposeId = 'expiry-reminder';
      if (!rawPurpose) {
        errors.push('触达目的为空，已默认为"权益到期提醒"');
      } else if (!purposeMap[rawPurpose]) {
        errors.push(`触达目的"${rawPurpose}"无法识别，已默认为"权益到期提醒"`);
      } else {
        purposeId = purposeMap[rawPurpose];
      }
      
      let scriptVersion: ScriptVersion = 'gentle';
      if (!rawVersion) {
        errors.push('话术版本为空，已默认为"温和提醒版"');
      } else if (!versionMap[rawVersion]) {
        errors.push(`话术版本"${rawVersion}"无法识别，已默认为"温和提醒版"`);
      } else {
        scriptVersion = versionMap[rawVersion];
      }
      
      const dateResult = validateDate(rawDate);
      errors.push(...dateResult.errors);
      
      const sentResult = validateNumber(rawSent, '发送数量', true);
      errors.push(...sentResult.errors);
      
      const consultResult = validateNumber(rawConsult, '咨询量');
      errors.push(...consultResult.errors);
      
      const visitResult = validateNumber(rawVisit, '到店量');
      errors.push(...visitResult.errors);
      
      const redemptionResult = validateNumber(rawRedemption, '核销量');
      errors.push(...redemptionResult.errors);
      
      const isValid = sentResult.valid && consultResult.valid && visitResult.valid && redemptionResult.valid;
      
      return {
        rowIndex,
        isValid,
        errors,
        data: {
          audienceId,
          purposeId,
          scriptVersion,
          contactDate: dateResult.parsed,
          sentCount: sentResult.parsed,
          consultationCount: consultResult.parsed,
          visitCount: visitResult.parsed,
          redemptionCount: redemptionResult.parsed
        },
        rawValues: {
          '触达人群': rawAudience,
          '触达目的': rawPurpose,
          '话术版本': rawVersion,
          '触达日期': rawDate,
          '发送数量': rawSent,
          '咨询量': rawConsult,
          '到店量': rawVisit,
          '核销量': rawRedemption
        }
      };
    });
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const validated = parseAndValidateCSV(text);
        setValidatedRows(validated);
        setImportStatus('idle');
        setEditingIndex(null);
      } catch (error) {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleFile(file);
    } else {
      setImportStatus('error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const updateRow = (index: number, field: keyof CSVRowValidation['data'], value: string | number) => {
    setValidatedRows(prev => {
      const updated = [...prev];
      const row = { ...updated[index] };
      const data = { ...row.data };
      const errors: string[] = [];
      
      if (field === 'sentCount' || field === 'consultationCount' || field === 'visitCount' || field === 'redemptionCount') {
        const fieldLabels: Record<string, string> = {
          sentCount: '发送数量',
          consultationCount: '咨询量',
          visitCount: '到店量',
          redemptionCount: '核销量'
        };
        const requirePositive = field === 'sentCount';
        const result = validateNumber(String(value), fieldLabels[field], requirePositive);
        errors.push(...result.errors);
        (data as any)[field] = result.parsed;
        
        const otherErrors = row.errors.filter(err => !err.startsWith(fieldLabels[field]));
        row.errors = [...otherErrors, ...errors];
        row.isValid = row.errors.filter(e => e.includes('必须大于') || e.includes('不能为负') || e.includes('必须是数字') || e.includes('不能为空')).length === 0;
        row.data = data;
      } else if (field === 'contactDate') {
        const result = validateDate(String(value));
        errors.push(...result.errors);
        data.contactDate = result.parsed;
        
        const otherErrors = row.errors.filter(err => !err.includes('日期'));
        row.errors = [...otherErrors, ...errors];
        row.data = data;
      } else if (field === 'audienceId') {
        data.audienceId = value as AudienceId;
        row.data = data;
      } else if (field === 'purposeId') {
        data.purposeId = value as PurposeId;
        row.data = data;
      } else if (field === 'scriptVersion') {
        data.scriptVersion = value as ScriptVersion;
        row.data = data;
      }
      
      updated[index] = row;
      return updated;
    });
  };

  const deleteRow = (index: number) => {
    setValidatedRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = () => {
    const validRows = validatedRows.filter(r => 
      r.isValid && 
      r.data.sentCount !== null && r.data.sentCount > 0 &&
      r.data.consultationCount !== null && r.data.consultationCount >= 0 &&
      r.data.visitCount !== null && r.data.visitCount >= 0 &&
      r.data.redemptionCount !== null && r.data.redemptionCount >= 0
    );
    
    if (validRows.length === 0) {
      setImportStatus('error');
      return;
    }
    
    const importData: SimpleImportRow[] = validRows.map(r => ({
      audienceId: r.data.audienceId,
      purposeId: r.data.purposeId,
      scriptVersion: r.data.scriptVersion,
      contactDate: r.data.contactDate,
      sentCount: r.data.sentCount!,
      consultationCount: r.data.consultationCount!,
      visitCount: r.data.visitCount!,
      redemptionCount: r.data.redemptionCount!
    }));
    
    importContactRecords(importData);
    
    const dates = validRows.map(r => r.data.contactDate).sort();
    const dateRange = { start: dates[0], end: dates[dates.length - 1] };
    
    setImportStatus('success');
    setValidatedRows([]);
    setEditingIndex(null);
    
    if (onImportSuccess) {
      onImportSuccess(dateRange);
    }
    
    setTimeout(() => setImportStatus('idle'), 5000);
  };

  const clearPreview = () => {
    setValidatedRows([]);
    setImportStatus('idle');
    setEditingIndex(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validCount = validatedRows.filter(r => r.isValid).length;
  const invalidCount = validatedRows.length - validCount;
  const warningCount = validatedRows.filter(r => r.errors.length > 0 && r.isValid).length;

  return (
    <div className="card">
      <h4 className="font-semibold text-ink mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary-500" />
        导入触达结果
      </h4>
      
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer',
          'transition-all duration-300',
          isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50',
          validatedRows.length > 0 && 'hidden'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-primary-500" />
        </div>
        <p className="text-ink font-medium mb-1">
          拖拽CSV文件到此处，或点击选择
        </p>
        <p className="text-sm text-gray-500">
          支持格式：CSV，需包含触达人群、触达目的、话术版本等字段
        </p>
      </div>

      {validatedRows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                共 {validatedRows.length} 条数据
              </span>
              <span className={cn(
                'text-sm px-3 py-1 rounded-full',
                validCount > 0 ? 'bg-gentle-100 text-gentle-700' : 'bg-gray-100 text-gray-500'
              )}>
                ✓ 可导入 {validCount} 条
              </span>
              {warningCount > 0 && (
                <span className="text-sm px-3 py-1 rounded-full bg-accent-100 text-accent-700">
                  ⚠ 自动修正 {warningCount} 条
                </span>
              )}
              {invalidCount > 0 && (
                <span className="text-sm px-3 py-1 rounded-full bg-warning-100 text-warning-700">
                  ✗ 错误 {invalidCount} 条
                </span>
              )}
            </div>
            <button
              onClick={clearPreview}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto scrollbar-thin border border-gray-200 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-2 py-2 text-left text-gray-600 font-medium w-12">行</th>
                  <th className="px-2 py-2 text-left text-gray-600 font-medium">人群</th>
                  <th className="px-2 py-2 text-left text-gray-600 font-medium">目的</th>
                  <th className="px-2 py-2 text-left text-gray-600 font-medium">版本</th>
                  <th className="px-2 py-2 text-center text-gray-600 font-medium">日期</th>
                  <th className="px-2 py-2 text-center text-gray-600 font-medium w-20">发送</th>
                  <th className="px-2 py-2 text-center text-gray-600 font-medium w-16">咨询</th>
                  <th className="px-2 py-2 text-center text-gray-600 font-medium w-16">到店</th>
                  <th className="px-2 py-2 text-center text-gray-600 font-medium w-16">核销</th>
                  <th className="px-2 py-2 text-center text-gray-600 font-medium w-16">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {validatedRows.map((row, index) => (
                  <tr 
                    key={index} 
                    className={cn(
                      'transition-colors',
                      !row.isValid && 'bg-warning-50',
                      editingIndex === index && 'bg-primary-50'
                    )}
                  >
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">{row.rowIndex}</span>
                        {!row.isValid && <AlertTriangle className="w-3.5 h-3.5 text-warning-500" />}
                        {row.isValid && row.errors.length > 0 && <span className="text-accent-500 text-xs">!</span>}
                      </div>
                    </td>
                    
                    {editingIndex === index ? (
                      <>
                        <td className="px-2 py-1">
                          <select
                            value={row.data.audienceId}
                            onChange={(e) => updateRow(index, 'audienceId', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-400 focus:outline-none"
                          >
                            {Object.entries(audienceLabels).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1">
                          <select
                            value={row.data.purposeId}
                            onChange={(e) => updateRow(index, 'purposeId', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-400 focus:outline-none"
                          >
                            {Object.entries(purposeLabels).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1">
                          <select
                            value={row.data.scriptVersion}
                            onChange={(e) => updateRow(index, 'scriptVersion', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-400 focus:outline-none"
                          >
                            {Object.entries(versionLabels).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="date"
                            value={row.data.contactDate}
                            onChange={(e) => updateRow(index, 'contactDate', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-400 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="1"
                            value={row.data.sentCount ?? ''}
                            onChange={(e) => updateRow(index, 'sentCount', e.target.value)}
                            className="w-full px-2 py-1 text-xs text-center border border-gray-300 rounded focus:border-primary-400 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            value={row.data.consultationCount ?? ''}
                            onChange={(e) => updateRow(index, 'consultationCount', e.target.value)}
                            className="w-full px-2 py-1 text-xs text-center border border-gray-300 rounded focus:border-primary-400 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            value={row.data.visitCount ?? ''}
                            onChange={(e) => updateRow(index, 'visitCount', e.target.value)}
                            className="w-full px-2 py-1 text-xs text-center border border-gray-300 rounded focus:border-primary-400 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            value={row.data.redemptionCount ?? ''}
                            onChange={(e) => updateRow(index, 'redemptionCount', e.target.value)}
                            className="w-full px-2 py-1 text-xs text-center border border-gray-300 rounded focus:border-primary-400 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="text-primary-600 hover:text-primary-700 p-1"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-2 text-xs">{audienceLabels[row.data.audienceId]}</td>
                        <td className="px-2 py-2 text-xs">{purposeLabels[row.data.purposeId]}</td>
                        <td className="px-2 py-2 text-xs">{versionLabels[row.data.scriptVersion]}</td>
                        <td className="px-2 py-2 text-center text-xs text-gray-600">{row.data.contactDate}</td>
                        <td className={cn(
                          'px-2 py-2 text-center text-xs font-medium',
                          (row.data.sentCount === null || row.data.sentCount <= 0) ? 'text-warning-600' : 'text-ink'
                        )}>
                          {row.data.sentCount ?? '-'}
                        </td>
                        <td className={cn(
                          'px-2 py-2 text-center text-xs',
                          row.data.consultationCount === null || row.data.consultationCount < 0 ? 'text-warning-600' : 'text-primary-600'
                        )}>
                          {row.data.consultationCount ?? '-'}
                        </td>
                        <td className={cn(
                          'px-2 py-2 text-center text-xs',
                          row.data.visitCount === null || row.data.visitCount < 0 ? 'text-warning-600' : 'text-gentle-600'
                        )}>
                          {row.data.visitCount ?? '-'}
                        </td>
                        <td className={cn(
                          'px-2 py-2 text-center text-xs',
                          row.data.redemptionCount === null || row.data.redemptionCount < 0 ? 'text-warning-600' : 'text-accent-600'
                        )}>
                          {row.data.redemptionCount ?? '-'}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setEditingIndex(index)}
                              className="text-gray-400 hover:text-primary-600 p-1 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteRow(index)}
                              className="text-gray-400 hover:text-warning-600 p-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {validatedRows.some(r => r.errors.length > 0) && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                数据校验提示
              </p>
              <ul className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                {validatedRows.flatMap((row, rowIdx) =>
                  row.errors.slice(0, 2).map((err, errIdx) => (
                    <li key={`${rowIdx}-${errIdx}`} className="text-xs text-amber-600 flex items-start gap-2">
                      <span className="font-medium">第{row.rowIndex}行:</span>
                      <span>{err}</span>
                    </li>
                  ))
                ).slice(0, 10)}
                {validatedRows.reduce((acc, r) => acc + r.errors.length, 0) > 10 && (
                  <li className="text-xs text-amber-500">...还有更多提示，请修正数据后重新查看</li>
                )}
              </ul>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={validCount === 0}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认导入 {validCount} 条有效数据
            </button>
            {invalidCount > 0 && (
              <button
                onClick={() => setValidatedRows(prev => prev.filter(r => r.isValid))}
                className="btn-secondary"
              >
                移除 {invalidCount} 条错误数据
              </button>
            )}
          </div>
        </div>
      )}

      {importStatus === 'success' && (
        <div className="mt-4 p-4 bg-gentle-50 border border-gentle-200 rounded-xl flex items-center gap-3">
          <Check className="w-5 h-5 text-gentle-600" />
          <div>
            <span className="text-gentle-700 font-medium">数据导入成功！</span>
            <p className="text-xs text-gentle-600 mt-0.5">已自动匹配日期范围，可点击上方"查看本次导入"查看效果</p>
          </div>
        </div>
      )}

      {importStatus === 'error' && (
        <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning-600" />
          <span className="text-warning-700 font-medium">
            {validatedRows.length > 0 ? '没有可导入的有效数据，请检查发送数量等字段' : '文件格式错误，请检查CSV格式'}
          </span>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 font-medium mb-2">CSV格式示例（发送数量必须大于0，其他数量大于等于0）：</p>
        <code className="text-xs text-gray-600 block whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200">
{`触达人群,触达目的,话术版本,触达日期,发送数量,咨询量,到店量,核销量
高血压复购会员,权益到期提醒,温和提醒版,2026-06-15,120,35,22,18
个账支付会员,药师服务预约,药师专业版,2026-06-18,85,42,28,24`}
        </code>
      </div>
    </div>
  );
}
