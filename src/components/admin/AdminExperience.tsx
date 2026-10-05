import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ExperienceItem } from '../../types';
import { useToast } from '../common/Toast';
import { ConfirmModal } from '../common/ConfirmModal';
import { Plus, Edit2, Trash2, Briefcase, Calendar, CheckCircle2, X } from 'lucide-react';

export const AdminExperience: React.FC = () => {
  const { experience, saveExperience, deleteExperience } = useData();
  const { toast } = useToast();

  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [expToDelete, setExpToDelete] = useState<ExperienceItem | null>(null);

  const handleCreateNew = () => {
    const newExp: ExperienceItem = {
      id: 'exp-' + Date.now(),
      organization: 'Tech Organization',
      role: 'Software Engineering Intern',
      type: 'Internship',
      startDate: 'Jun 2026',
      endDate: 'Present',
      description: 'Engineering role description and responsibilities.',
      responsibilities: ['Developed high-performance endpoints'],
      technologies: ['TypeScript', 'React', 'PostgreSQL'],
      published: true
    };
    setEditingExp(newExp);
  };

  const handleSave = () => {
    if (!editingExp) return;
    if (!editingExp.organization || !editingExp.role) {
      toast('Organization and Role are required.', 'error');
      return;
    }
    saveExperience(editingExp);
    setEditingExp(null);
    toast(`Experience record "${editingExp.role}" saved!`, 'success');
  };

  const handleDelete = () => {
    if (!expToDelete) return;
    deleteExperience(expToDelete.id);
    setExpToDelete(null);
    toast('Experience record deleted.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Engineering Experience Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage internships, employment, research, and mentoring appointments. No fake roles required.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">{item.role}</h4>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.organization} · <span className="font-mono text-[var(--text-muted)] font-normal">{item.type}</span>
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.startDate} — {item.endDate}</span>
                  <span>·</span>
                  <span>{item.published ? 'Visible' : 'Draft'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setEditingExp({ ...item })}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setExpToDelete(item)}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-rose-500 hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingExp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-6 text-xs text-[var(--text-primary)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="font-bold text-sm">Edit Experience Record</h3>
              <button onClick={() => setEditingExp(null)} className="p-1 text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Organization *</label>
                <input
                  type="text"
                  required
                  value={editingExp.organization}
                  onChange={e => setEditingExp({ ...editingExp, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={editingExp.role}
                  onChange={e => setEditingExp({ ...editingExp, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Type</label>
                  <select
                    value={editingExp.type}
                    onChange={e => setEditingExp({ ...editingExp, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Employment">Employment</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Research">Research</option>
                    <option value="University Role">University Role</option>
                    <option value="Project Role">Project Role</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. Jun 2025 — Nov 2025"
                    value={`${editingExp.startDate} — ${editingExp.endDate}`}
                    onChange={e => {
                      const parts = e.target.value.split('—').map(s => s.trim());
                      setEditingExp({
                        ...editingExp,
                        startDate: parts[0] || '',
                        endDate: parts[1] || ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingExp.description}
                  onChange={e => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={editingExp.technologies.join(', ')}
                  onChange={e =>
                    setEditingExp({
                      ...editingExp,
                      technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="exp-pub"
                  checked={editingExp.published}
                  onChange={e => setEditingExp({ ...editingExp, published: e.target.checked })}
                  className="rounded text-emerald-500"
                />
                <label htmlFor="exp-pub" className="text-xs font-semibold cursor-pointer">
                  Publish on public portfolio
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setEditingExp(null)}
                className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-bold"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(expToDelete)}
        title="Delete Experience Record?"
        message={`Delete "${expToDelete?.role}" at "${expToDelete?.organization}"?`}
        confirmLabel="Delete Record"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setExpToDelete(null)}
      />
    </div>
  );
};
