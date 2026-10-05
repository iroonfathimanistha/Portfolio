import React, { useState } from 'react';
import {
  User,
  FolderGit2,
  FileCode2,
  GraduationCap,
  Briefcase,
  Award,
  Image as ImageIcon,
  Mail,
  Settings,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Sun,
  Moon,
  FileText,
  LogOut,
  Info,
  LayoutDashboard
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export type AdminTab =
  | 'overview'
  | 'profile'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'resume'
  | 'media'
  | 'messages'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

const TAB_TITLES: Record<AdminTab, string> = {
  overview: 'Overview',
  profile: 'Profile',
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
  resume: 'Resume',
  media: 'Media',
  messages: 'Messages',
  settings: 'Settings'
};

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onExitAdmin,
  children
}) => {
  const { messages } = useData();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  const contentNavItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'about', label: 'About', icon: Info },
    { id: 'skills', label: 'Skills', icon: FileCode2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'resume', label: 'Resume', icon: FileText }
  ];

  const systemNavItems: {
    id: AdminTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'media', label: 'Media', icon: ImageIcon },
    {
      id: 'messages',
      label: 'Messages',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabClick = (tabId: AdminTab) => {
    setCurrentTab(tabId);
    setMobileDrawerOpen(false);
    const newPath = tabId === 'overview' ? '/admin' : `/admin/${tabId}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  const currentTabLabel = TAB_TITLES[currentTab] || 'Overview';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col antialiased transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="h-14 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(prev => !prev)}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] lg:hidden hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
            aria-label="Toggle admin menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clean Breadcrumb: Portfolio CMS / [Tab Name] */}
          <div className="flex items-center gap-2 font-display text-sm">
            <span className="font-bold text-[var(--text-primary)]">Portfolio CMS</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{currentTabLabel}</span>
          </div>
        </div>

        {/* Right Header: Theme, View Portfolio, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View Public Portfolio"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">View Portfolio</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Logout of CMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar: Exactly matches Section 3 & 21 */}
        <aside className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex-col justify-between hidden lg:flex shrink-0 p-4">
          <div className="space-y-6 overflow-y-auto">
            {/* PORTFOLIO CMS / Overview */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold px-3 mb-2">
                Portfolio CMS
              </div>
              <button
                onClick={() => handleTabClick('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  currentTab === 'overview'
                    ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>
            </div>

            {/* CONTENT */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold px-3 mb-2">
                Content
              </div>
              <nav className="space-y-1">
                {contentNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* SYSTEM */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold px-3 mb-2">
                System
              </div>
              <nav className="space-y-1">
                {systemNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Actions: View Portfolio & Logout */}
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-1">
            <button
              onClick={onExitAdmin}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-emerald-500" />
              <span>View Portfolio</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile / Tablet Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="fixed top-0 bottom-0 left-0 w-72 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-4 flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="font-display font-bold text-sm text-[var(--text-primary)]">
                      Portfolio CMS
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold px-3 mb-2">
                    Portfolio CMS
                  </div>
                  <button
                    onClick={() => handleTabClick('overview')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      currentTab === 'overview'
                        ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview</span>
                  </button>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold px-3 mb-2">
                    Content
                  </div>
                  <nav className="space-y-1">
                    {contentNavItems.map(item => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold px-3 mb-2">
                    System
                  </div>
                  <nav className="space-y-1">
                    {systemNavItems.map(item => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-1">
                <button
                  onClick={onExitAdmin}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-500" />
                  <span>View Portfolio</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
