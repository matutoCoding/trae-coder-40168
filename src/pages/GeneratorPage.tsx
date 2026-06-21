import { Sparkles, RotateCcw } from 'lucide-react';
import { AudienceSelector } from '@/components/generator/AudienceSelector';
import { PurposeSelector } from '@/components/generator/PurposeSelector';
import { ScriptCard } from '@/components/generator/ScriptCard';
import { DraftManager } from '@/components/generator/DraftManager';
import { useScriptStore } from '@/store/useScriptStore';
import { audienceGroups, contactPurposes } from '@/data/mockData';
import { useState, useEffect } from 'react';

export function GeneratorPage() {
  const {
    selectedAudience,
    selectedPurpose,
    selectedVersion,
    generatedScripts,
    setSelectedAudience,
    setSelectedPurpose,
    setSelectedVersion,
    generateScripts,
    clearSelection
  } = useScriptStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScripts, setShowScripts] = useState(false);
  
  const canGenerate = selectedAudience && selectedPurpose;
  
  const handleGenerate = () => {
    if (!canGenerate) return;
    
    setIsGenerating(true);
    setShowScripts(false);
    
    setTimeout(() => {
      generateScripts();
      setIsGenerating(false);
      setShowScripts(true);
    }, 800);
  };
  
  useEffect(() => {
    if (generatedScripts.length > 0) {
      setShowScripts(true);
    }
  }, [generatedScripts]);
  
  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-ink mb-2">
            话术生成
          </h2>
          <p className="text-gray-500">
            选择触达人群和目的，系统将为您生成三版合规话术
          </p>
        </div>
        <DraftManager />
      </div>
      
      <AudienceSelector
        audiences={audienceGroups}
        selected={selectedAudience}
        onSelect={setSelectedAudience}
      />
      
      <PurposeSelector
        purposes={contactPurposes}
        selected={selectedPurpose}
        onSelect={setSelectedPurpose}
      />
      
      <div className="flex gap-4 animate-fade-in-up stagger-2 flex-wrap">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className="btn-primary flex items-center gap-2"
        >
          <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? '生成中...' : '生成话术'}</span>
        </button>
        
        <button
          onClick={clearSelection}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>清空选择</span>
        </button>
      </div>
      
      {!canGenerate && (
        <div className="bg-primary-50 border-2 border-dashed border-primary-200 rounded-2xl p-12 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="font-serif font-semibold text-lg text-ink mb-2">
            请先选择触达人群和目的
          </h3>
          <p className="text-gray-500 text-sm">
            系统将根据您的选择，自动生成温和提醒、药师专业、家属协助三个版本的合规话术
          </p>
          <p className="text-gray-400 text-xs mt-3">
            💡 也可以点击右上角"我的方案"加载已保存的草稿
          </p>
        </div>
      )}
      
      {isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-14 bg-gray-200" />
              <div className="p-5 bg-white border-2 border-t-0 border-gray-200">
                <div className="h-48 bg-gray-100 rounded-xl mb-4" />
                <div className="h-24 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showScripts && generatedScripts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif font-semibold text-lg text-ink animate-fade-in-up">
            生成的话术版本
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {generatedScripts.map((script, index) => (
              <ScriptCard
                key={script.id}
                script={script}
                index={index}
                isSelected={selectedVersion === script.version}
                onSelect={setSelectedVersion}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
