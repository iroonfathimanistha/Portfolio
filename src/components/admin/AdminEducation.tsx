import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { EducationItem } from '../../types';
import { useToast } from '../common/Toast';
import { ConfirmModal } from '../common/ConfirmModal';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, CheckCircle, FileQuestion, X, Save } from 'lucide-react';

export const AdminEducation: React.FC = () => {
  const { education, saveEducation, deleteEducation, lastSyncError } = useData();
  const { toast } = useToast();

  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [eduToDelete, setEduToDelete] = useState<EducationItem | null>(null);

  const handleCreateNew = () => {
    const newEdu: EducationItem = {
      id: 'edu-' + Date.now(),
      university: 'Faculty of Computing',
      faculty: 'School of Software Systems',
      department: 'Software Engineering Department',
      degree: 'BSc (Hons) in Software Engineering',
      startDate: '2023',
      endDate: '2027',
      description: 'Undergraduate software engineering degree.',
      coursework: ['Data Structures', 'Database Systems', 'Algorithms'],
      achievements: [],
      published: true,
      displayOrder: education.length + 1
    };
    setEditingEdu(newEdu);
  };

  const handleSave = async () => {
    if (!editingEdu) return;
    if (!editingEdu.university || !editingEdu.degree) {
      toast('University and Degree are required.', 'error');
      return;
    }
    const degree = editingEdu.degree;
    const ok = await saveEducation(editingEdu);
    if (ok) {
      setEditingEdu(null);
      toast(`Education record "${degree}" saved to PostgreSQL database!`, 'success');
    } else {
      toast(lastSyncError || `Failed to save education record.`, 'error');
    }
  };

  const handleDelete = async () => {
    if (!eduToDelete) return;
    const degree = eduToDelete.degree;
    const ok = await deleteEducation(eduToDelete.id);
    if (ok) {
      setEduToDelete(null);
      toast(`Education record "${degree}" deleted from PostgreSQL database.`, 'info');
    } else {
      toast(lastSyncError || `Failed to delete education record.`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Academic Education Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your degrees, academic institutions, and verified university honors.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      <div className="space-y-4">
        {education.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">{item.degree}</h4>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.university} · <span className="text-[var(--text-muted)] font-normal">{item.faculty}</span>
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
                onClick={() => setEditingEdu({ ...item })}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEduToDelete(item)}
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
      {editingEdu && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-6 text-xs text-[var(--text-primary)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="font-bold text-sm">Edit Education Record</h3>
              <button onClick={() => setEditingEdu(null)} className="p-1 text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Degree Title *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree}
                  onChange={e => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">University *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.university}
                  onChange={e => setEditingEdu({ ...editingEdu, university: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Faculty / School</label>
                  <input
                    type="text"
                    value={editingEdu.faculty}
                    onChange={e => setEditingEdu({ ...editingEdu, faculty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Department</label>
                  <input
                    type="text"
                    value={editingEdu.department || ''}
                    onChange={e => setEditingEdu({ ...editingEdu, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Start Year</label>
                  <input
                    type="text"
                    value={editingEdu.startDate}
                    onChange={e => setEditingEdu({ ...editingEdu, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">End Year / Expected</label>
                  <input
                    type="text"
                    value={editingEdu.endDate}
                    onChange={e => setEditingEdu({ ...editingEdu, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Description / Honors</label>
                <textarea
                  rows={3}
                  value={editingEdu.description}
                  onChange={e => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                  Relevant Coursework (comma separated)
                </label>
                <input
                  type="text"
                  value={editingEdu.coursework.join(', ')}
                  onChange={e =>
                    setEditingEdu({
                      ...editingEdu,
                      coursework: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edu-pub"
                  checked={editingEdu.published}
                  onChange={e => setEditingEdu({ ...editingEdu, published: e.target.checked })}
                  className="rounded text-emerald-500"
                />
                <label htmlFor="edu-pub" className="text-xs font-semibold cursor-pointer">
                  Publish on public portfolio
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setEditingEdu(null)}
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

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(eduToDelete)}
        title="Delete Education Record?"
        message={`Delete "${eduToDelete?.degree}" from education history?`}
        confirmLabel="Delete Record"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setEduToDelete(null)}
      />
    </div>
  );
};
