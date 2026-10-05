import React from 'react';
import { useData } from '../../context/DataContext';
import { Layers, Database, ShieldCheck, Cpu, Cloud, Terminal } from 'lucide-react';

const TECHNICAL_PILLARS = [
  { label: 'Full-Stack Architecture', icon: Layers, note: 'End-to-end type contracts' },
  { label: 'Backend Engineering', icon: Terminal, note: 'Clean CQRS & REST services' },
  { label: 'Relational Databases', icon: Database, note: 'ACID & query optimization' },
  { label: 'Software Verification', icon: ShieldCheck, note: 'Deterministic test suites' },
  { label: 'Cloud & Containers', icon: Cloud, note: 'Docker & reproducible runtimes' },
  { label: 'Applied AI / ML', icon: Cpu, note: 'Grounded retrieval pipelines' }
];

export const EngineeringIntro: React.FC = () => {
  const { profile } = useData();

  return (
    <section id="about" className="py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-3 block">
              Philosophy & Foundation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight text-balance">
              Building software with engineering fundamentals.
            </h2>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4 text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
            <p>
              {profile.aboutText}
            </p>
            {profile.careerDirection && (
              <p className="text-sm text-[var(--text-muted)] italic border-l-2 border-emerald-500/40 pl-3">
                "{profile.careerDirection}"
              </p>
            )}
            <div className="flex items-center gap-6 pt-2 text-xs font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Undergraduate SE
              </span>
              <span>·</span>
              <span>Dean's List Honoree</span>
              <span>·</span>
              <span>Deterministic Architectures</span>
            </div>
          </div>
        </div>

        {/* Dynamic Core Principles & Interests from CMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-[var(--border-subtle)]">
          {/* Engineering Interests */}
          {profile.engineeringInterests && profile.engineeringInterests.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
                Engineering Focus & Interests
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.engineeringInterests.map(interest => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Core Principles */}
          {profile.engineeringPrinciples && profile.engineeringPrinciples.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
                Engineering Principles
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.engineeringPrinciples.map((principle, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2 text-xs font-medium text-[var(--text-primary)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="line-clamp-1">{principle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
