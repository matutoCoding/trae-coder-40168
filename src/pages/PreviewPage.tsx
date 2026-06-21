import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { WechatSimulator } from '@/components/preview/WechatSimulator';
import { PlaceholderEditor } from '@/components/preview/PlaceholderEditor';
import { useScriptStore, replacePlaceholders } from '@/store/useScriptStore';
import { cn } from '@/lib/utils';
import type { ScriptVersion } from '@/types';

const versionOptions: { value: ScriptVersion; label: string; color: string }[] = [
  { value: 'gentle', label: '温和提醒版', color: 'gentle' },
  { value: 'professional', label: '药师专业版', color: 'primary' },
  { value: 'family', label: '家属协助版', color: 'accent' }
];

export function PreviewPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const {
    selectedVersion,
    generatedScripts,
    placeholders,
    setSelectedVersion,
    setPlaceholders,
    selectedAudience,
    selectedPurpose
  } = useScriptStore();
  
  const currentScript = generatedScripts.find(s => s.version === selectedVersion);
  const hasData = generatedScripts.length > 0 && selectedVersion;
  
  const finalContent = currentScript 
    ? replacePlaceholders(currentScript.content, placeholders)
    : '';
  
  const handleCopy = async () => {
    if (!finalContent) return;
    await navigator.clipboard.writeText(finalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回话术生成</span>
          </button>
          <h2 className="font-serif font-bold text-2xl text-ink">
            消息预览
          </h2>
          <p className="text-gray-500 mt-1">
            预览会员收到的消息效果，替换门店和药师信息
          </p>
        </div>
        
        {hasData && (
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300',
              copied 
                ? 'bg-gentle-500 text-white' 
                : 'btn-accent'
            )}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>复制话术</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {!hasData && (
        <div className="bg-primary-50 border-2 border-dashed border-primary-200 rounded-2xl p-12 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="font-serif font-semibold text-lg text-ink mb-2">
            暂无预览内容
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            请先在话术生成页面选择人群和目的，生成话术后再预览
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            去生成话术
          </button>
        </div>
      )}
      
      {hasData && currentScript && (
        <>
          <div className="flex gap-2 animate-fade-in-up stagger-1">
            {versionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedVersion(option.value)}
                className={cn(
                  'px-4 py-2 rounded-xl font-medium transition-all duration-300',
                  selectedVersion === option.value
                    ? `bg-${option.color}-${option.color === 'gentle' ? '500' : option.color === 'primary' ? '600' : '500'} text-white shadow-card`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 animate-fade-in-up stagger-2">
              <div className="sticky top-8">
                <WechatSimulator
                  content={finalContent}
                  versionName={currentScript.versionName}
                  versionColor={currentScript.versionColor}
                />
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6 animate-fade-in-up stagger-3">
              <div className="card">
                <PlaceholderEditor
                  placeholders={placeholders}
                  onChange={setPlaceholders}
                />
              </div>
              
              <div className="card">
                <h4 className="font-semibold text-ink mb-4">话术原文</h4>
                <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm text-ink leading-relaxed">
                  {currentScript.content}
                </div>
              </div>
              
              <div className="card bg-warning-50 border-2 border-warning-200">
                <h4 className="font-semibold text-warning-700 mb-3">
                  ⚠️ 合规提醒 - 发送前请确认
                </h4>
                <ul className="space-y-2">
                  {currentScript.forbiddenPromises.map((promise, index) => (
                    <li key={index} className="text-sm text-warning-600 flex items-start gap-2">
                      <span className="text-warning-500 font-bold">•</span>
                      <span>{promise}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="card bg-cream border-2 border-primary-200">
                <h4 className="font-semibold text-primary-700 mb-3">
                  📊 当前选择
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">触达人群</p>
                    <p className="font-medium text-ink">
                      {selectedAudience === 'hypertension' && '高血压复购会员'}
                      {selectedAudience === 'personal-account' && '个账支付会员'}
                      {selectedAudience === 'family-binding' && '家庭账户咨询会员'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">触达目的</p>
                    <p className="font-medium text-ink">
                      {selectedPurpose === 'expiry-reminder' && '权益到期提醒'}
                      {selectedPurpose === 'pharmacist-appointment' && '药师服务预约'}
                      {selectedPurpose === 'repurchase' && '健康品类复购'}
                      {selectedPurpose === 'policy-explain' && '政策解释'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">话术版本</p>
                    <p className="font-medium text-ink">{currentScript.versionName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
