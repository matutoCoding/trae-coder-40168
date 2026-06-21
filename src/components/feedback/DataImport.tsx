import { Upload, FileText, X, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { useScriptStore } from '@/store/useScriptStore';
import type { AudienceId, PurposeId, ScriptVersion, ContactRecord } from '@/types';

interface ImportRow {
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

export function DataImport() {
  const { importContactRecords } = useScriptStore();
  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState<ImportRow[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return {
        audienceId: audienceMap[row['触达人群'] || row['audienceId'] || 'hypertension'],
        purposeId: purposeMap[row['触达目的'] || row['purposeId'] || 'expiry-reminder'],
        scriptVersion: versionMap[row['话术版本'] || row['scriptVersion'] || 'gentle'],
        contactDate: row['触达日期'] || row['contactDate'] || new Date().toISOString().split('T')[0],
        sentCount: parseInt(row['发送数量'] || row['sentCount'] || '0'),
        consultationCount: parseInt(row['咨询量'] || row['consultationCount'] || '0'),
        visitCount: parseInt(row['到店量'] || row['visitCount'] || '0'),
        redemptionCount: parseInt(row['核销量'] || row['redemptionCount'] || '0')
      };
    });
    
    return rows;
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        setPreviewData(data);
        setImportStatus('idle');
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

  const handleImport = () => {
    importContactRecords(previewData);
    setImportStatus('success');
    setPreviewData([]);
    setTimeout(() => setImportStatus('idle'), 3000);
  };

  const clearPreview = () => {
    setPreviewData([]);
    setImportStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
          }
          ${previewData.length > 0 ? 'hidden' : ''}
        `}
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

      {previewData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              预览 {previewData.length} 条数据
            </span>
            <button
              onClick={clearPreview}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto scrollbar-thin border border-gray-200 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
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
                {previewData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{row.audienceId}</td>
                    <td className="px-3 py-2">{row.purposeId}</td>
                    <td className="px-3 py-2">{row.scriptVersion}</td>
                    <td className="px-3 py-2 text-center">{row.sentCount}</td>
                    <td className="px-3 py-2 text-center text-primary-600">{row.consultationCount}</td>
                    <td className="px-3 py-2 text-center text-gentle-600">{row.visitCount}</td>
                    <td className="px-3 py-2 text-center text-accent-600">{row.redemptionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 5 && (
              <p className="text-center text-sm text-gray-500 py-2 bg-gray-50">
                还有 {previewData.length - 5} 条数据未显示
              </p>
            )}
          </div>
          
          <button
            onClick={handleImport}
            className="w-full btn-primary"
          >
            确认导入 {previewData.length} 条数据
          </button>
        </div>
      )}

      {importStatus === 'success' && (
        <div className="mt-4 p-4 bg-gentle-50 border border-gentle-200 rounded-xl flex items-center gap-3">
          <Check className="w-5 h-5 text-gentle-600" />
          <span className="text-gentle-700 font-medium">数据导入成功！</span>
        </div>
      )}

      {importStatus === 'error' && (
        <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-xl flex items-center gap-3">
          <X className="w-5 h-5 text-warning-600" />
          <span className="text-warning-700 font-medium">文件格式错误，请检查CSV格式</span>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 font-medium mb-2">CSV格式示例：</p>
        <code className="text-xs text-gray-600 block whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200">
{`触达人群,触达目的,话术版本,触达日期,发送数量,咨询量,到店量,核销量
高血压复购会员,权益到期提醒,温和提醒版,2026-06-15,120,35,22,18
个账支付会员,药师服务预约,药师专业版,2026-06-18,85,42,28,24`}
        </code>
      </div>
    </div>
  );
}
