import React from 'react';
import { useData } from '../../context/DataContext';
import { HeartHandshake, ExternalLink } from 'lucide-react';

export const VolunteeringSection: React.FC = () => {
  const { activities, isSectionEnabled } = useData();

  if (!isSectionEnabled('activities')) return null;

  const published = activities.filter(a => a.published);
  if (published.length === 0) return null;

  return (
    <section id="activities" className="py-20 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Leadership & Community
            </span>
            <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
              Community Outreach & Activities
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Workshops, peer tutoring, and fostering diversity in computing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {published.map(item => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    {item.date}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-[var(--text-secondary)] mb-4">
                  {item.organization} {item.role ? `· ${item.role}` : ''}
                </p>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {item.externalUrl && (
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    <span>External Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
