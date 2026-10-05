import React from 'react';
import { useData } from '../../context/DataContext';
import { AdminTab } from './AdminLayout';
import {
  FolderGit2,
  Award,
  FileCode2,
  Mail,
  GraduationCap,
  Briefcase,
  Clock,
  ArrowRight
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onViewPortfolio: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { projects, skills, experience, education, certifications, messages, profile } = useData();

  // Real counts from database/context
  const summaryMetrics = [
    { label: 'Projects', count: projects.length, tab: 'projects' as AdminTab, icon: FolderGit2 },
    { label: 'Skills', count: skills.length, tab: 'skills' as AdminTab, icon: FileCode2 },
    { label: 'Experience', count: experience.length, tab: 'experience' as AdminTab, icon: Briefcase },
    { label: 'Education', count: education.length, tab: 'education' as AdminTab, icon: GraduationCap },
    { label: 'Certifications', count: certifications.length, tab: 'certifications' as AdminTab, icon: Award },
    { label: 'Messages', count: messages.length, tab: 'messages' as AdminTab, icon: Mail }
  ];

  // Real recent content changes derived from actual data
  const recentChanges: { title: string; category: string; time: string; tab: AdminTab }[] = [];

  if (projects.length > 0) {
    const latestProject = projects[0];
    recentChanges.push({
      title: `Project: "${latestProject.title}" (${latestProject.status})`,
      category: 'Projects',
      time: latestProject.year || '2026',
      tab: 'projects'
    });
  }

  if (certifications.length > 0) {
    const latestCert = certifications[0];
    recentChanges.push({
      title: `Certification: "${latestCert.title}"`,
      category: 'Certifications',
      time: latestCert.issueDate || 'October 2026',
      tab: 'certifications'
    });
  }

  if (profile.resume?.lastUpdated) {
    recentChanges.push({
      title: 'Resume Document updated',
      category: 'Resume',
      time: profile.resume.lastUpdated,
      tab: 'resume'
    });
  }

  if (profile.profilePhoto) {
    recentChanges.push({
      title: 'Profile photo uploaded',
      category: 'Profile',
      time: 'Current asset',
      tab: 'profile'
    });
  }

  if (messages.length > 0) {
    const latestMsg = messages[messages.length - 1];
    recentChanges.push({
      title: `Inquiry from ${latestMsg.name}: "${latestMsg.subject}"`,
      category: 'Messages',
      time: latestMsg.receivedAt ? new Date(latestMsg.receivedAt).toLocaleDateString() : 'Recent',
      tab: 'messages'
    });
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title & Introduction */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Portfolio CMS
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage the content displayed on your public portfolio.
        </p>
      </div>

      {/* Clean Content Summary Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            Content Counts
          </span>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
            Real Database Records
          </span>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {summaryMetrics.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                onClick={() => onNavigateTab(item.tab)}
                className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg font-bold text-[var(--text-primary)]">
                    {item.count}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Content Changes */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            Recent Content Changes
          </h2>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {recentChanges.map((change, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateTab(change.tab)}
              className="px-6 py-3.5 flex items-center justify-between hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {change.title}
                  </p>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {change.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {change.time}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
