import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  ShieldCheck,
  LogOut,
  Globe,
  Share2,
  Database,
  Save,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { profile, updateProfile, resetAllData, deleteAllDemoData } = useData();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [siteTitle, setSiteTitle] = useState(profile.name + ' — Portfolio');
  const [siteDescription, setSiteDescription] = useState(profile.tagline || 'Software Engineering Portfolio');

  const [confirmDeleteDemo, setConfirmDeleteDemo] = useState(false);
  const [confirmFactoryReset, setConfirmFactoryReset] = useState(false);

  const handleSaveWebsite = () => {
    updateProfile({ tagline: siteDescription });
    toast('Website settings updated successfully!', 'success');
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  const handleDeleteDemoConfirm = () => {
    deleteAllDemoData();
    setConfirmDeleteDemo(false);
    toast('All demo records have been cleared!', 'success');
  };

  const handleResetConfirm = () => {
    resetAllData();
    setConfirmFactoryReset(false);
    toast('Application reset to factory seed data!', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
          CMS & Application Settings
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Configure site metadata, theme preferences, social connections, and admin security session.
        </p>
      </div>

      {/* 1. Website Settings */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Globe className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            1. Website Configuration
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Public Site Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={e => setSiteTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Default Description (Tagline)
            </label>
            <input
              type="text"
              value={siteDescription}
              onChange={e => setSiteDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-2 font-semibold">
              Theme Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  toast('Light theme activated', 'info');
                }}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold">Light Theme</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  toast('Dark theme activated', 'info');
                }}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold">Dark Theme</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  toast('System theme activated', 'info');
                }}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Laptop className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold">System Match</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveWebsite}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Website Settings</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Social Connections Summary */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Share2 className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            2. Social Profiles
          </h2>
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          Configured social touchpoints currently mapped to your public portfolio:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {(profile.socialLinks || []).map(link => (
            <div
              key={link.id}
              className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-[var(--text-primary)] block">
                  {link.label}
                </span>
                <span className="font-mono text-[11px] text-[var(--text-muted)] line-clamp-1">
                  {link.url}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  link.enabled
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-500/10 text-slate-500'
                }`}
              >
                {link.enabled ? 'Enabled' : 'Hidden'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Security & Active Session */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            3. Security & Admin Authentication
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block mb-0.5">
              Active Security Session
            </span>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              Logged in as: {user?.username || 'admin'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Protected by HTTP-only cookie and bearer session verification.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session / Logout</span>
          </button>
        </div>
      </section>

      {/* 4. Data Hygiene */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Database className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            4. Data Management & Reset
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setConfirmDeleteDemo(true)}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-[var(--border-subtle)] hover:border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Demo Data</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmFactoryReset(true)}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Reset to Factory Seed Data</span>
          </button>
        </div>
      </section>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmDeleteDemo}
        title="Clear Demo Data?"
        message="This will remove demo records while preserving your core profile identity."
        confirmLabel="Clear Demo Data"
        isDestructive={true}
        onConfirm={handleDeleteDemoConfirm}
        onCancel={() => setConfirmDeleteDemo(false)}
      />

      <ConfirmModal
        isOpen={confirmFactoryReset}
        title="Reset All Content?"
        message="This will restore all portfolio content to factory seed defaults. Any unpublished edits will be replaced."
        confirmLabel="Reset to Factory"
        isDestructive={true}
        onConfirm={handleResetConfirm}
        onCancel={() => setConfirmFactoryReset(false)}
      />
    </div>
  );
};
