import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../common/Toast';
import { ImageUploader } from './ImageUploader';
import { SocialLink } from '../../types';
import {
  User,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Camera,
  Share2,
  CheckCircle,
  EyeOff
} from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { profile, updateProfile } = useData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ ...profile });
  const [newSocial, setNewSocial] = useState<Partial<SocialLink>>({
    platform: 'github',
    label: '',
    url: '',
    enabled: true
  });
  const [showAddSocial, setShowAddSocial] = useState(false);

  const handleSave = () => {
    updateProfile(formData);
    toast('Profile and identity saved successfully!', 'success');
  };

  const handleUpdateSocial = (id: string, updates: Partial<SocialLink>) => {
    const updated = (formData.socialLinks || []).map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    setFormData({ ...formData, socialLinks: updated });
  };

  const handleDeleteSocial = (id: string) => {
    const updated = (formData.socialLinks || []).filter(s => s.id !== id);
    setFormData({ ...formData, socialLinks: updated });
    toast('Social link removed', 'info');
  };

  const handleAddSocial = () => {
    if (!newSocial.label || !newSocial.url) {
      toast('Please enter both label and URL', 'error');
      return;
    }
    const link: SocialLink = {
      id: 'soc-' + Date.now(),
      platform: (newSocial.platform as any) || 'other',
      label: newSocial.label.trim(),
      url: newSocial.url.trim(),
      enabled: true,
      displayOrder: (formData.socialLinks || []).length + 1
    };
    setFormData({ ...formData, socialLinks: [...(formData.socialLinks || []), link] });
    setNewSocial({ platform: 'github', label: '', url: '', enabled: true });
    setShowAddSocial(false);
    toast('Social link added', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Profile & Public Identity
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your personal identity, contact details, profile photos, and verified social links.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile</span>
        </button>
      </div>

      {/* 1. Personal Information */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <User className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            1. Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Professional Title *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Software Engineering Undergraduate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Short Tagline
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Building software with engineering fundamentals."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[var(--text-secondary)] uppercase font-mono font-semibold">
                Geographic Location
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={formData.showLocation}
                  onChange={e => setFormData({ ...formData, showLocation: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span>Display on public site</span>
              </label>
            </div>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Colombo, Sri Lanka"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Short Introduction (Hero Subtitle)
            </label>
            <textarea
              rows={3}
              value={formData.shortIntro}
              onChange={e => setFormData({ ...formData, shortIntro: e.target.value })}
              placeholder="Undergraduate software engineer dedicated to building resilient distributed systems..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* 2. Profile Photos */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Camera className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            2. Profile Photos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Primary Profile Photo (Hero Portrait)"
            description="The main portrait shown on the public homepage hero section."
            currentImage={formData.profilePhoto}
            onImageChange={url => setFormData({ ...formData, profilePhoto: url })}
            onImageRemove={() => setFormData({ ...formData, profilePhoto: '' })}
            aspectRatio="square"
          />

          <ImageUploader
            label="Alternate Photo / Secondary Asset"
            description="Secondary portrait or alternative personal image asset."
            currentImage={formData.alternateProfilePhoto}
            onImageChange={url => setFormData({ ...formData, alternateProfilePhoto: url })}
            onImageRemove={() => setFormData({ ...formData, alternateProfilePhoto: '' })}
            aspectRatio="square"
          />
        </div>
      </section>

      {/* 3. Social Links (GitHub, LinkedIn, Medium, Email) */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-500" />
            <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
              3. Social Touchpoints
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowAddSocial(!showAddSocial)}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-emerald-500/40 text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add Link</span>
          </button>
        </div>

        {/* Existing Links List */}
        <div className="space-y-3">
          {(formData.socialLinks || []).map(link => (
            <div
              key={link.id}
              className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-0.5">
                    Platform / Label
                  </span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={e => handleUpdateSocial(link.id, { label: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-0.5">
                    Profile URL
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={link.url}
                      onChange={e => handleUpdateSocial(link.id, { url: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                    />
                    {link.url && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[var(--text-muted)] hover:text-emerald-500"
                        title="Test link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleUpdateSocial(link.id, { enabled: !link.enabled })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    link.enabled
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                  }`}
                >
                  {link.enabled ? <CheckCircle className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{link.enabled ? 'Enabled' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteSocial(link.id)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 rounded-lg hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                  title="Delete social link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Social Modal / Popover */}
        {showAddSocial && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-emerald-500/30 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Add Social Touchpoint</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[var(--text-secondary)] font-mono text-[10px] uppercase mb-1">
                  Platform
                </label>
                <select
                  value={newSocial.platform}
                  onChange={e => setNewSocial({ ...newSocial, platform: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="medium">Medium</option>
                  <option value="email">Email</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-mono text-[10px] uppercase mb-1">
                  Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. GitHub"
                  value={newSocial.label}
                  onChange={e => setNewSocial({ ...newSocial, label: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-mono text-[10px] uppercase mb-1">
                  URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newSocial.url}
                  onChange={e => setNewSocial({ ...newSocial, url: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSocial(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSocial}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-semibold"
              >
                Add Link
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
