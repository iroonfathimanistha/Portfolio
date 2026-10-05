import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import {
  X,
  ExternalLink,
  Github,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface ProjectCaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  const [isDiagramFullscreen, setIsDiagramFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDiagramFullscreen) {
          setIsDiagramFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isDiagramFullscreen, onClose]);

  if (!isOpen || !project) return null;

  const caseStudy = project.caseStudy || {};

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl text-[var(--text-primary)] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              PROJECT {project.number}
            </span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
              {project.category}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono hidden sm:inline">
              ● {project.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.liveUrl && project.liveUrl.trim() !== '' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-400 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && project.githubUrl.trim() !== '' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-colors"
                title="View GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              aria-label="Close case study"
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 md:p-10 overflow-y-auto space-y-12">
          {/* Top Title & Large Image */}
          <div>
            <h1
              id="case-study-title"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3"
            >
              {project.title}
            </h1>
            <p className="text-lg sm:text-xl text-emerald-600 dark:text-emerald-400 font-medium mb-4">
              {project.subtitle}
            </p>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-3xl mb-4">
              {project.description}
            </p>

            {/* Detailed Description (if provided) */}
            {project.longDescription && project.longDescription !== project.description && (
              <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm leading-relaxed max-w-3xl mb-6">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold block mb-1">
                  Detailed Overview
                </span>
                <p>{project.longDescription}</p>
              </div>
            )}

            {/* My Role (if provided) */}
            {caseStudy.role && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] mb-6">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">My Role:</span>
                <span>{caseStudy.role}</span>
              </div>
            )}

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Project Image */}
            <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] relative aspect-video shadow-xl">
              <img
                src={project.image}
                alt={`${project.title} Showcase`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Problem & Solution */}
          {(caseStudy.problem || caseStudy.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[var(--border-subtle)]">
              {caseStudy.problem && (
                <div className="p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 mb-3 text-rose-500 font-mono text-xs uppercase tracking-wider font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    Problem Statement
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {caseStudy.problem}
                  </p>
                </div>
              )}

              {caseStudy.solution && (
                <div className="p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Engineering Solution
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {caseStudy.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Engineering Approach */}
          {caseStudy.engineeringApproach && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                Architectural Strategy
              </span>
              <h2 className="text-2xl font-bold font-display text-[var(--text-primary)]">
                Engineering Approach
              </h2>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                {caseStudy.engineeringApproach}
              </p>
            </div>
          )}

          {/* Architecture Visualization */}
          {caseStudy.architectureDiagram && (
            <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                    System Blueprint
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[var(--text-primary)]">
                    System Architecture
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
                    title="Zoom in diagram"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
                    title="Zoom out diagram"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsDiagramFullscreen(true)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
                    title="Fullscreen diagram"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {caseStudy.architectureDetails && (
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {caseStudy.architectureDetails}
                </p>
              )}

              <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-2 relative flex items-center justify-center">
                <div
                  className="transition-transform duration-200 origin-center max-w-full"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={caseStudy.architectureDiagram}
                    alt="System Architecture Diagram"
                    referrerPolicy="no-referrer"
                    className="rounded-lg max-h-[380px] w-auto object-contain mx-auto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Key Features */}
          {caseStudy.keyFeatures && caseStudy.keyFeatures.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                Core Capabilities
              </span>
              <h2 className="text-2xl font-bold font-display text-[var(--text-primary)]">
                Key Engineering Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseStudy.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex flex-col gap-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                        {feat.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-3.5">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Implementation & Challenges */}
          {(caseStudy.implementation || caseStudy.challenges) && (
            <div className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
              {caseStudy.implementation && (
                <div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                    Execution
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-2">
                    Implementation Details
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
                    {caseStudy.implementation}
                  </p>
                </div>
              )}

              {caseStudy.challenges && (
                <div className="p-5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Technical Challenges
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {caseStudy.challenges}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Lessons Learned & Next Steps */}
          {(caseStudy.lessonsLearned || caseStudy.futureImprovements) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[var(--border-subtle)]">
              {caseStudy.lessonsLearned && (
                <div className="p-5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-emerald-500" />
                    Engineering Takeaways
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {caseStudy.lessonsLearned}
                  </p>
                </div>
              )}

              {caseStudy.futureImprovements && (
                <div className="p-5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    Future Roadmap
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {caseStudy.futureImprovements}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Architecture Lightbox */}
      {isDiagramFullscreen && caseStudy.architectureDiagram && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[150] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsDiagramFullscreen(false)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => setIsDiagramFullscreen(false)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs font-semibold flex items-center gap-2 hover:bg-white/20"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Fullscreen (ESC)</span>
            </button>
          </div>
          <div
            className="max-w-6xl max-h-[85vh] overflow-auto p-4"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={caseStudy.architectureDiagram}
              alt="System Architecture Diagram Fullscreen"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
