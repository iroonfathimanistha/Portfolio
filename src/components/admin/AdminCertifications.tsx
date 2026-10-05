import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Certification } from '../../types';
import { useToast } from '../common/Toast';
import { ConfirmModal } from '../common/ConfirmModal';
import { ImageUploader } from './ImageUploader';
import { Plus, Edit2, Trash2, Award, Calendar, ExternalLink, ShieldCheck, X, Save } from 'lucide-react';

export const AdminCertifications: React.FC = () => {
  const { certifications, skills, saveCertification, deleteCertification } = useData();
  const { toast } = useToast();

  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);

  const handleCreateNew = () => {
    const newCert: Certification = {
      id: 'cert-' + Date.now(),
      title: 'New Professional Credential',
      organization: 'Issuing Organization',
      issueDate: 'October 2026',
      credentialId: 'CERT-' + Math.floor(Math.random() * 900000 + 100000),
      verificationUrl: 'https://verify.example.org',
      description: 'Validation of advanced software engineering competency.',
      skills: ['PostgreSQL', 'Architecture'],
      published: true,
      featured: true
    };
    setEditingCert(newCert);
  };

  const handleSave = () => {
    if (!editingCert) return;
    if (!editingCert.title || !editingCert.organization) {
      toast('Title and Organization are required.', 'error');
      return;
    }
    saveCertification(editingCert);
    setEditingCert(null);
    toast(`Certification "${editingCert.title}" saved!`, 'success');
  };

  const handleDelete = () => {
    if (!certToDelete) return;
    deleteCertification(certToDelete.id);
    setCertToDelete(null);
    toast('Certification deleted.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Verified Certifications Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage professional credentials, verification links, and associated skills.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="space-y-4">
        {certifications.map(cert => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">{cert.title}</h4>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {cert.organization} · <span className="font-mono text-[var(--text-muted)] font-normal">{cert.credentialId}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cert.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setEditingCert({ ...cert })}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCertToDelete(cert)}
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
      {editingCert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-6 text-xs text-[var(--text-primary)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="font-bold text-sm">Edit Certification</h3>
              <button onClick={() => setEditingCert(null)} className="p-1 text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Credential Title *</label>
                <input
                  type="text"
                  required
                  value={editingCert.title}
                  onChange={e => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Issuing Authority *</label>
                <input
                  type="text"
                  required
                  value={editingCert.organization}
                  onChange={e => setEditingCert({ ...editingCert, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Date Earned</label>
                  <input
                    type="text"
                    value={editingCert.issueDate}
                    onChange={e => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={editingCert.credentialId}
                    onChange={e => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Verification Registry URL</label>
                <input
                  type="url"
                  value={editingCert.verificationUrl}
                  onChange={e => setEditingCert({ ...editingCert, verificationUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCert.description || ''}
                  onChange={e => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                  Skills Covered (comma separated)
                </label>
                <input
                  type="text"
                  value={editingCert.skills.join(', ')}
                  onChange={e =>
                    setEditingCert({
                      ...editingCert,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCert.published}
                    onChange={e => setEditingCert({ ...editingCert, published: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span>Published publicly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCert.featured}
                    onChange={e => setEditingCert({ ...editingCert, featured: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-bold"
              >
                Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(certToDelete)}
        title="Delete Certificate?"
        message={`Delete "${certToDelete?.title}"?`}
        confirmLabel="Delete Certificate"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setCertToDelete(null)}
      />
    </div>
  );
};
