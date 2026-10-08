import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SkillItem } from '../../types';
import { useToast } from '../common/Toast';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  Edit2,
  Trash2,
  FileCode2,
  ExternalLink,
  Save,
  X,
  CheckCircle,
  EyeOff,
  Star,
  Search
} from 'lucide-react';

const SKILL_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend',
  'Databases',
  'Cloud',
  'DevOps',
  'Testing',
  'Tools'
] as const;

export const AdminSkills: React.FC = () => {
  const { skills, saveSkill, deleteSkill } = useData();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<SkillItem | null>(null);

  const filteredSkills = skills.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'All' || s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchSearch && matchCat;
  });

  const handleCreateNew = () => {
    const newSkill: SkillItem = {
      id: 'skill-' + Date.now(),
      name: '',
      category: 'Languages' as any,
      description: '',
      officialUrl: '',
      icon: '',
      relatedProjects: [],
      relatedSkills: [],
      level: 'Core Focus',
      featured: false,
      enabled: true,
      displayOrder: skills.length + 1
    };
    setEditingSkill(newSkill);
  };

  const handleSave = async () => {
    if (!editingSkill) return;
    if (!editingSkill.name.trim()) {
      toast('Skill Name is required.', 'error');
      return;
    }
    const skillName = editingSkill.name.trim();
    const ok = await saveSkill({
      ...editingSkill,
      name: skillName,
      description: editingSkill.description?.trim() || '',
      officialUrl: editingSkill.officialUrl?.trim() || ''
    });
    setEditingSkill(null);
    if (ok) {
      toast(`Skill "${skillName}" saved and synced to database!`, 'success');
    } else {
      toast(`Notice: Skill "${skillName}" saved locally. Verify database connection.`, 'info');
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    const ok = await deleteSkill(skillToDelete.id);
    const deletedName = skillToDelete.name;
    setSkillToDelete(null);
    if (ok) {
      toast(`Skill "${deletedName}" removed and synced.`, 'info');
    } else {
      toast(`Skill removed locally.`, 'info');
    }
  };

  const handleToggleEnabled = (skill: SkillItem) => {
    const updated = { ...skill, enabled: skill.enabled === false ? true : false };
    saveSkill(updated);
    toast(
      updated.enabled ? `"${skill.name}" enabled publicly.` : `"${skill.name}" disabled (hidden).`,
      'info'
    );
  };

  const handleToggleFeatured = (skill: SkillItem) => {
    const updated = { ...skill, featured: !skill.featured };
    saveSkill(updated);
    toast(
      updated.featured ? `"${skill.name}" marked as featured.` : `"${skill.name}" unfeatured.`,
      'info'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Skills & Technologies Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your technology stack across categories. No fake proficiency percentages or skill bars.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technology</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technologies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-emerald-500 text-white dark:text-slate-950 font-semibold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)]'
            }`}
          >
            All
          </button>
          {SKILL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white dark:text-slate-950 font-semibold'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] text-[var(--text-secondary)] uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Technology</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Documentation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredSkills.map(skill => {
                const isEnabled = skill.enabled !== false;
                return (
                  <tr
                    key={skill.id}
                    className="hover:bg-[var(--bg-surface-elevated)]/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs shrink-0">
                          {skill.icon || skill.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-[var(--text-primary)] block">
                            {skill.name}
                          </span>
                          {skill.description && (
                            <span className="text-[11px] text-[var(--text-muted)] line-clamp-1 max-w-xs">
                              {skill.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                        {skill.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {skill.officialUrl ? (
                        <a
                          href={skill.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <span>Docs</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[var(--text-muted)] font-mono text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleEnabled(skill)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                            isEnabled
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                          }`}
                          title="Click to toggle visibility"
                        >
                          {isEnabled ? <CheckCircle className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(skill)}
                          className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                            skill.featured
                              ? 'text-amber-400 hover:text-amber-500'
                              : 'text-[var(--text-muted)] hover:text-amber-400'
                          }`}
                          title={skill.featured ? 'Featured skill' : 'Click to feature'}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingSkill({ ...skill })}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                          title="Edit Technology"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSkillToDelete(skill)}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                          title="Delete Technology"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingSkill && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
              <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-emerald-500" />
                <span>{editingSkill.id.startsWith('skill-') ? 'Edit Technology' : 'Add Technology'}</span>
              </h3>
              <button
                onClick={() => setEditingSkill(null)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                  Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. TypeScript, ASP.NET Core, PostgreSQL"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                    Category *
                  </label>
                  <select
                    value={editingSkill.category}
                    onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                  >
                    {SKILL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingSkill.displayOrder || 1}
                    onChange={e => setEditingSkill({ ...editingSkill, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingSkill.description}
                  onChange={e => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  placeholder="Brief context of how and where you use this technology..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                  Official Documentation URL
                </label>
                <input
                  type="url"
                  value={editingSkill.officialUrl || ''}
                  onChange={e => setEditingSkill({ ...editingSkill, officialUrl: e.target.value })}
                  placeholder="https://react.dev"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.enabled !== false}
                    onChange={e => setEditingSkill({ ...editingSkill, enabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
                  />
                  <span className="font-semibold text-[var(--text-primary)]">Publicly Visible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingSkill.featured)}
                    onChange={e => setEditingSkill({ ...editingSkill, featured: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
                  />
                  <span className="font-semibold text-[var(--text-primary)]">Featured Skill</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Technology</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(skillToDelete)}
        title="Remove Technology?"
        message={`Are you sure you want to remove "${skillToDelete?.name}"?`}
        confirmLabel="Remove Technology"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setSkillToDelete(null)}
      />
    </div>
  );
};
