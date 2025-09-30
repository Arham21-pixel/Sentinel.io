import React, { useState, useEffect } from 'react';
import { X, User, Shield, Baby, Crown, Save, Trash2, Eye, EyeOff, Clock, Globe, Smartphone } from 'lucide-react';

type User = { id: string; name: string; role: 'child' | 'parent' | 'admin' };

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSave: (userData: any) => void;
  onDelete?: (userId: string) => void;
  isAdding: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  onDelete,
  isAdding
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'child' as 'child' | 'parent' | 'admin',
    screenTime: '2',
    bedtime: '21:00',
    allowedSites: ['educational.com', 'homework-help.org'],
    blockedCategories: ['gaming', 'social-media'],
    deviceLimits: {
      phone: true,
      tablet: true,
      computer: false
    }
  });

  useEffect(() => {
    if (user && !isAdding) {
      setFormData({
        name: user.name,
        role: user.role,
        screenTime: '2',
        bedtime: '21:00',
        allowedSites: ['educational.com', 'homework-help.org'],
        blockedCategories: ['gaming', 'social-media'],
        deviceLimits: {
          phone: true,
          tablet: true,
          computer: false
        }
      });
    } else {
      setFormData({
        name: '',
        role: 'child',
        screenTime: '2',
        bedtime: '21:00',
        allowedSites: ['educational.com'],
        blockedCategories: ['gaming'],
        deviceLimits: {
          phone: true,
          tablet: true,
          computer: false
        }
      });
    }
  }, [user, isAdding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isAdding ? 'Add Family Member' : `Edit ${user?.name}`}
                </h2>
                <p className="text-sm text-slate-400">
                  {isAdding ? 'Create a new family member profile' : 'Modify family member settings'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="child">👶 Child</option>
                  <option value="parent">👨‍👩‍👧‍👦 Parent</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Screen Time Controls */}
          {formData.role === 'child' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Screen Time Controls
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Daily Screen Time (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.screenTime}
                    onChange={(e) => setFormData({ ...formData, screenTime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bedtime</label>
                  <input
                    type="time"
                    value={formData.bedtime}
                    onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Device Access */}
          {formData.role === 'child' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-400" />
                Device Access
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(formData.deviceLimits).map(([device, allowed]) => (
                  <label key={device} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={allowed}
                      onChange={(e) => setFormData({
                        ...formData,
                        deviceLimits: { ...formData.deviceLimits, [device]: e.target.checked }
                      })}
                      className="w-4 h-4 text-green-500 bg-slate-600 border-slate-500 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-slate-300 capitalize">{device}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Content Filters */}
          {formData.role === 'child' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-400" />
                Content Filters
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Blocked Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {['gaming', 'social-media', 'entertainment', 'shopping', 'news'].map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          const isBlocked = formData.blockedCategories.includes(category);
                          setFormData({
                            ...formData,
                            blockedCategories: isBlocked
                              ? formData.blockedCategories.filter(c => c !== category)
                              : [...formData.blockedCategories, category]
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          formData.blockedCategories.includes(category)
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700'
                        }`}
                      >
                        {category.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <div>
              {!isAdding && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
                      onDelete(user.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete User
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
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                <Save className="h-4 w-4" />
                {isAdding ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
