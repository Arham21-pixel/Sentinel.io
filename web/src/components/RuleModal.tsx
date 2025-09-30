import React, { useState, useEffect } from 'react';
import { X, Shield, Globe, Clock, Users, Zap, Save, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

type Rule = { id: string; name: string; expression: string; effect: 'allow' | 'block'; priority: number; enabled: boolean };

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule?: Rule | null;
  onSave: (ruleData: any) => void;
  onDelete?: (ruleId: string) => void;
  isAdding: boolean;
}

export const RuleModal: React.FC<RuleModalProps> = ({
  isOpen,
  onClose,
  rule,
  onSave,
  onDelete,
  isAdding
}) => {
  const [formData, setFormData] = useState({
    name: '',
    effect: 'block' as 'allow' | 'block',
    priority: 50,
    category: 'general',
    expression: '',
    description: '',
    timeRestriction: false,
    startTime: '09:00',
    endTime: '17:00',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    userSpecific: false,
    targetUsers: [] as string[]
  });

  const [previewResult, setPreviewResult] = useState<{ decision: string; reason: string } | null>(null);
  const [testUrl, setTestUrl] = useState('');

  const categories = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'social-media', name: 'Social Media', icon: Users },
    { id: 'gaming', name: 'Gaming', icon: Zap },
    { id: 'educational', name: 'Educational', icon: CheckCircle },
    { id: 'entertainment', name: 'Entertainment', icon: XCircle },
    { id: 'shopping', name: 'Shopping', icon: Globe },
  ];

  const ruleTemplates = [
    { name: 'Block Gaming Sites', expression: 'url.contains("game") || url.contains("gaming")', effect: 'block', category: 'gaming' },
    { name: 'Allow Educational Sites', expression: 'url.contains("edu") || url.contains("khan") || url.contains("coursera")', effect: 'allow', category: 'educational' },
    { name: 'Block Social Media', expression: 'url.contains("facebook") || url.contains("instagram") || url.contains("tiktok")', effect: 'block', category: 'social-media' },
    { name: 'Time-based Restriction', expression: 'time.hour >= 9 && time.hour <= 17', effect: 'allow', category: 'general' },
    { name: 'Block Adult Content', expression: 'url.contains("adult") || url.contains("porn")', effect: 'block', category: 'general' },
  ];

  useEffect(() => {
    if (rule && !isAdding) {
      setFormData({
        name: rule.name,
        effect: rule.effect,
        priority: rule.priority,
        category: 'general',
        expression: rule.expression,
        description: '',
        timeRestriction: false,
        startTime: '09:00',
        endTime: '17:00',
        weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        userSpecific: false,
        targetUsers: []
      });
    } else {
      setFormData({
        name: '',
        effect: 'block',
        priority: 50,
        category: 'general',
        expression: '',
        description: '',
        timeRestriction: false,
        startTime: '09:00',
        endTime: '17:00',
        weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        userSpecific: false,
        targetUsers: []
      });
    }
  }, [rule, isAdding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTemplateSelect = (template: any) => {
    setFormData({
      ...formData,
      name: template.name,
      expression: template.expression,
      effect: template.effect,
      category: template.category
    });
  };

  const testRule = () => {
    if (!testUrl || !formData.expression) return;
    
    // Simple rule testing logic
    const url = testUrl.toLowerCase();
    let matches = false;
    
    try {
      // Basic expression evaluation
      if (formData.expression.includes('url.contains')) {
        const searchTerms = formData.expression.match(/"([^"]+)"/g);
        if (searchTerms) {
          matches = searchTerms.some(term => url.includes(term.replace(/"/g, '')));
        }
      }
      
      setPreviewResult({
        decision: matches ? formData.effect : (formData.effect === 'allow' ? 'block' : 'allow'),
        reason: matches ? `Rule matches: ${formData.name}` : 'No rule match, using default policy'
      });
    } catch (error) {
      setPreviewResult({
        decision: 'error',
        reason: 'Invalid rule expression'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isAdding ? 'Create Parental Rule' : `Edit ${rule?.name}`}
                </h2>
                <p className="text-sm text-slate-400">
                  {isAdding ? 'Set up a new content filtering rule' : 'Modify existing parental control rule'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Rule Configuration
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Rule Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="e.g., Block Gaming Sites"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Action</label>
                      <select
                        value={formData.effect}
                        onChange={(e) => setFormData({ ...formData, effect: e.target.value as any })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="block">🚫 Block Access</option>
                        <option value="allow">✅ Allow Access</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Priority (1-100)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Rule Expression */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    Rule Expression
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Expression</label>
                    <textarea
                      value={formData.expression}
                      onChange={(e) => setFormData({ ...formData, expression: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-sm"
                      rows={3}
                      placeholder='e.g., url.contains("game") || url.contains("gaming")'
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Use logical expressions to define when this rule applies
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="Brief description of what this rule does"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-700">
                  <div>
                    {!isAdding && onDelete && (
                      <button
                        type="button"
                        onClick={() => {
                          if (rule && confirm(`Are you sure you want to delete "${rule.name}"?`)) {
                            onDelete(rule.id);
                            onClose();
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Rule
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
                    >
                      <Save className="h-4 w-4" />
                      {isAdding ? 'Create Rule' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rule Templates */}
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Quick Templates</h4>
                <div className="space-y-2">
                  {ruleTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left p-3 bg-slate-600/30 hover:bg-slate-600/50 rounded-lg transition-colors"
                    >
                      <div className="text-sm font-medium text-white">{template.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{template.effect === 'allow' ? '✅ Allow' : '🚫 Block'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rule Tester */}
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Test Rule</h4>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500/50 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    placeholder="https://example.com"
                  />
                  <button
                    type="button"
                    onClick={testRule}
                    className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Test Rule
                  </button>
                  
                  {previewResult && (
                    <div className={`p-3 rounded-lg ${
                      previewResult.decision === 'allow' ? 'bg-green-500/10 border border-green-500/20' :
                      previewResult.decision === 'block' ? 'bg-red-500/10 border border-red-500/20' :
                      'bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      <div className={`text-sm font-medium ${
                        previewResult.decision === 'allow' ? 'text-green-400' :
                        previewResult.decision === 'block' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {previewResult.decision === 'allow' ? '✅ ALLOWED' :
                         previewResult.decision === 'block' ? '🚫 BLOCKED' :
                         '⚠️ ERROR'}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{previewResult.reason}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
