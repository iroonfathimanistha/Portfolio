import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Certification } from '../../types';
import { Award, ExternalLink, X, ShieldCheck, Calendar, Hash } from 'lucide-react';

export const CertificationsGallery: React.FC = () => {
  const { certifications, isSectionEnabled } = useData();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  useEffect(() => {
    if (!selectedCert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedCert]);

  if (!isSectionEnabled('certifications')) return null;

  const publishedCerts = certifications.filter(c => c.published);
  if (publishedCerts.length === 0) return null;

  return (
    <section id="certifications" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Accreditation & Standards
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Verified Certifications
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Rigorous verified credentials in database architecture, software design, and typed systems.
          </p>
        </div>

        {/* Visual Credential Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCerts.map(cert => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="cursor-pointer p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5 leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono text-[var(--text-secondary)] mb-3">
                  {cert.organization}
                </p>

                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cert.skills.map(s => (
                      <span
                        key={s}
                        className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] px-2 py-0.5 rounded border border-[var(--border-subtle)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                <span>{cert.issueDate}</span>
                <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  View Credential →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Modal */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-2xl text-[var(--text-primary)] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    Verified Credential
                  </span>
                  <h3 id="cert-modal-title" className="text-xl font-bold font-display text-[var(--text-primary)]">
                    {selectedCert.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                aria-label="Close modal"
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
                <span className="text-[var(--text-muted)]">Issuing Authority:</span>
                <span className="text-[var(--text-primary)] font-semibold">{selectedCert.organization}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date Earned:
                </span>
                <span className="text-[var(--text-primary)] font-semibold">{selectedCert.issueDate}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> Credential ID:
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedCert.credentialId}</span>
              </div>

              {selectedCert.description && (
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)]/60 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedCert.description}
                </div>
              )}

              {selectedCert.skills && selectedCert.skills.length > 0 && (
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)]/40 border border-[var(--border-subtle)]">
                  <span className="text-xs font-mono text-[var(--text-muted)] uppercase block mb-2">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Close (ESC)
              </button>

              {selectedCert.verificationUrl && (
                <a
                  href={selectedCert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-400 flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>Verify on Registry</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
