import { useState } from 'react';
import { Save, FolderOpen, Edit3, Trash2, Copy, Check, X, FileText } from 'lucide-react';
import { useScriptStore } from '@/store/useScriptStore';
import type { DraftScheme } from '@/types';
import { audienceGroups, contactPurposes } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface DraftManagerProps {
  showSaveButton?: boolean;
}

export function DraftManager({ showSaveButton = true }: DraftManagerProps) {
  const {
    draftSchemes,
    saveDraftScheme,
    loadDraftScheme,
    deleteDraftScheme,
    duplicateDraftScheme,
    selectedAudience,
    selectedPurpose
  } = useScriptStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newSchemeName, setNewSchemeName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  const canSave = selectedAudience && selectedPurpose;

  const handleSave = () => {
    if (!newSchemeName.trim()) return;
    const scheme = saveDraftScheme(newSchemeName.trim());
    setLastSavedId(scheme.id);
    setNewSchemeName('');
    setShowSaveModal(false);
    setTimeout(() => setLastSavedId(null), 2000);
  };

  const handleLoad = (scheme: DraftScheme) => {
    loadDraftScheme(scheme.id);
    setIsOpen(false);
  };

  const handleDuplicate = (scheme: DraftScheme) => {
    duplicateDraftScheme(scheme.id, `${scheme.name} (副本)`);
  };

  const handleStartEdit = (scheme: DraftScheme) => {
    setEditingId(scheme.id);
    setEditingName(scheme.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      const { updateDraftScheme } = useScriptStore.getState();
      updateDraftScheme(editingId, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  const getAudienceName = (id: DraftScheme['audienceId']) =>
    id ? audienceGroups.find(a => a.id === id)?.name || '未设置' : '未设置';

  const getPurposeName = (id: DraftScheme['purposeId']) =>
    id ? contactPurposes.find(p => p.id === id)?.name || '未设置' : '未设置';

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {showSaveButton && (
          <button
            onClick={() => {
              if (canSave) {
                const now = new Date();
                const defaultName = `${getAudienceName(selectedAudience)}-${getPurposeName(selectedPurpose)}-${now.getMonth() + 1}${now.getDate()}`;
                setNewSchemeName(defaultName);
                setShowSaveModal(true);
              }
            }}
            disabled={!canSave}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
              canSave
                ? 'bg-accent-500 text-white hover:bg-accent-600 shadow-card hover:shadow-card-hover hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            {lastSavedId ? (
              <>
                <Check className="w-4 h-4" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存方案
              </>
            )}
          </button>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-white border-2 border-primary-200 text-primary-600 hover:border-primary-400 hover:bg-primary-50 transition-all"
        >
          <FolderOpen className="w-4 h-4" />
          我的方案
          {draftSchemes.length > 0 && (
            <span className="bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full">
              {draftSchemes.length}
            </span>
          )}
        </button>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-serif font-semibold text-lg text-ink">保存触达方案</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">方案名称</label>
                <input
                  type="text"
                  value={newSchemeName}
                  onChange={(e) => setNewSchemeName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="请输入方案名称"
                  className="input-field"
                  autoFocus
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <p className="text-xs text-gray-500">方案内容预览</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">触达人群</span>
                    <p className="font-medium text-ink">{getAudienceName(selectedAudience)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">触达目的</span>
                    <p className="font-medium text-ink">{getPurposeName(selectedPurpose)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 btn-secondary py-2.5"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!newSchemeName.trim()}
                className="flex-1 btn-primary py-2.5 disabled:opacity-50"
              >
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-ink">我的触达方案</h3>
                  <p className="text-xs text-gray-500">共 {draftSchemes.length} 个方案草稿</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
              {draftSchemes.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <FolderOpen className="w-16 h-16 mb-3 opacity-30" />
                  <p className="text-sm">暂无保存的方案</p>
                  <p className="text-xs mt-1">生成话术后可点击"保存方案"创建草稿</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...draftSchemes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((scheme) => (
                    <div
                      key={scheme.id}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all group',
                        lastSavedId === scheme.id
                          ? 'border-gentle-300 bg-gentle-50'
                          : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-card'
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {editingId === scheme.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                className="flex-1 px-3 py-1.5 text-sm border border-primary-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                autoFocus
                              />
                              <button
                                onClick={handleSaveEdit}
                                className="p-1.5 text-gentle-600 hover:bg-gentle-50 rounded-lg"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <h4 className="font-semibold text-ink truncate group-hover:text-primary-600 transition-colors">
                              {scheme.name}
                            </h4>
                          )}

                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-xs px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full">
                              {getAudienceName(scheme.audienceId)}
                            </span>
                            <span className="text-xs px-2.5 py-1 bg-accent-50 text-accent-600 rounded-full">
                              {getPurposeName(scheme.purposeId)}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 mt-2">
                            更新于 {formatDate(scheme.updatedAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleStartEdit(scheme)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="重命名"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(scheme)}
                            className="p-2 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                            title="复制"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDraftScheme(scheme.id)}
                            className="p-2 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleLoad(scheme)}
                            className="ml-1 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            使用
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
