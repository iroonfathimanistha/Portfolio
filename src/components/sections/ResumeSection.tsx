import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FileText, Download, Printer, GraduationCap, X } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { profile, projects, education, experience, skills } = useData();
  const { resume } = profile;

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const publishedEdu = education.filter(e => e.published);
  const publishedExp = experience.filter(e => e.published);
  const publishedProjects = projects.filter(p => p.published);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-doc-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-12 my-auto max-h-[95vh] overflow-y-auto print-container text-left relative animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Floating Controls for Screen View */}
        <div className="no-print sticky -top-6 -right-6 sm:-top-8 sm:-right-8 flex items-center justify-end gap-3 pb-4 mb-4 border-b border-slate-200 bg-white/95 backdrop-blur-md z-20">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={onClose}
            aria-label="Close resume viewer"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resume Header */}
        <header className="border-b-2 border-slate-900 pb-6 mb-8">
          <h1 id="resume-doc-title" className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {profile.name}
          </h1>
          <p className="text-base font-semibold text-emerald-700 mt-1">
            {resume.professionalTitle || profile.role}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-3 font-mono">
            <span>{profile.email}</span>
            {profile.showLocation && (
              <>
                <span>·</span>
                <span>{profile.location}</span>
              </>
            )}
            <span>·</span>
            <a href="https://github.com/nisthafathima" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
              GitHub
            </a>
            <span>·</span>
            <a href="https://linkedin.com/in/nisthafathima" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
              LinkedIn
            </a>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mb-8">
          <h2 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-2">
            Engineering Profile
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {resume.summary || profile.shortIntro}
          </p>
        </section>

        {/* Education */}
        {publishedEdu.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-3 border-b border-slate-200 pb-1">
              Education
            </h2>
            {publishedEdu.map(edu => (
              <div key={edu.id} className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {edu.university}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-semibold mb-1">
                  {edu.degree} · <span className="text-emerald-800 font-medium">{edu.faculty}</span>
                </div>
                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-800">Relevant Coursework: </span>
                    {edu.coursework.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Professional Experience */}
        {publishedExp.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-4 border-b border-slate-200 pb-1">
              Experience & Engineering Practice
            </h2>
            <div className="space-y-6">
              {publishedExp.map(exp => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {exp.role} <span className="font-normal text-slate-500">at {exp.organization}</span>
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mb-2 leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                      {exp.responsibilities.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Projects */}
        {publishedProjects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-4 border-b border-slate-200 pb-1">
              Selected Software Case Studies
            </h2>
            <div className="space-y-4">
              {publishedProjects.slice(0, 3).map(proj => (
                <div key={proj.id} className="text-xs">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <h3 className="font-bold text-slate-900">
                      {proj.title} <span className="text-slate-500 font-normal">| {proj.subtitle}</span>
                    </h3>
                    <span className="font-mono text-slate-500">{proj.technologies.slice(0, 3).join(', ')}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Summary */}
        <section>
          <h2 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-3 border-b border-slate-200 pb-1">
            Technical Competencies
          </h2>
          <div className="text-xs text-slate-700 space-y-1.5 font-mono">
            <p>
              <strong className="text-slate-900">Verified Skills: </strong>
              {skills.map(s => s.name).join(', ')}.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export const ResumeSection: React.FC = () => {
  const { profile, isSectionEnabled, education } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const { resume } = profile;

  if (!isSectionEnabled('resume')) return null;

  const topEdu = education[0];

  return (
    <section id="resume" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Curriculum Vitae
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Professional Resume Preview
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white dark:text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>View Full Document</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-emerald-500/40 font-medium text-xs transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>

        {/* Concise Professional Preview */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                Candidate
              </span>
              <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                {profile.name}
              </h3>
              <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
                {resume.professionalTitle || profile.role}
              </p>
            </div>

            {topEdu && (
              <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  <span>{topEdu.university}</span>
                </div>
                <p className="text-[var(--text-secondary)] pl-6">
                  {topEdu.degree} ({topEdu.startDate} — {topEdu.endDate})
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6 text-left">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Executive Profile Summary
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {resume.summary || profile.shortIntro}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
              <span>Status: {profile.availability}</span>
              {resume.lastUpdated && <span>Updated: {resume.lastUpdated}</span>}
            </div>
          </div>
        </div>
      </div>

      <ResumeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};
