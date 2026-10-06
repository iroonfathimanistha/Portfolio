import React from 'react';
import { useData } from '../../context/DataContext';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { profile } = useData();

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'medium':
        return (
          <span className="font-serif font-black text-sm leading-none w-4 h-4 flex items-center justify-center">
            M
          </span>
        );
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Only take enabled and configured social links with non-empty URLs
  const activeSocials = (profile.socialLinks || [])
    .filter(s => s.enabled && s.url && s.url.trim() !== '')
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 text-[var(--text-secondary)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col items-center text-center space-y-5">
        {/* Name */}
        <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
          {profile.name}
        </h3>

        {/* Title */}
        <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
          {profile.role || 'Software Engineering Undergraduate'}
        </p>

        {/* Narrative */}
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
          {profile.tagline || 'Building software with engineering fundamentals.'}
        </p>

        {/* Social Links (only configured & enabled: GitHub, LinkedIn, Medium, Email) */}
        {activeSocials.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3">
            {activeSocials.map(soc => (
              <a
                key={soc.id}
                href={soc.url}
                target={soc.platform === 'email' ? undefined : '_blank'}
                rel={soc.platform === 'email' ? undefined : 'noopener noreferrer'}
                aria-label={soc.label}
                className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
              >
                <span className="text-[var(--text-muted)] group-hover:text-emerald-500 transition-colors">
                  {getSocialIcon(soc.platform)}
                </span>
                <span>{soc.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="pt-4 text-xs font-mono text-[var(--text-muted)]">
          © 2026 Nistha Fathima. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
