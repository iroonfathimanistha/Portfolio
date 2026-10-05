import React, { useState, useRef } from 'react';
import { ArrowDown, FileText, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const { profile } = useData();
  const { prefersReducedMotion } = useTheme();

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || window.innerWidth < 1024) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const navOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center pt-28 lg:pt-32 pb-16 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT COLUMN: Large Typography & Information Hierarchy */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {/* Small Eyebrow: Software Engineering Undergraduate */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Software Engineering Undergraduate
            </span>
          </div>

          {/* Main Heading: Building software with engineering fundamentals. */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.08] mb-6 text-balance">
            Building software with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
              engineering fundamentals
            </span>
            .
          </h1>

          {/* Short Professional Introduction */}
          <div className="space-y-3 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-8">
            <p>
              {profile.shortIntro ||
                'Undergraduate software engineer dedicated to building resilient distributed systems, high-integrity full-stack applications, and performant web products with strict architectural discipline.'}
            </p>
            <p className="text-xs sm:text-sm font-mono text-[var(--text-muted)] flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Focus:</span>
              <span>Software Engineering</span>
              <span>·</span>
              <span>Full-Stack Development</span>
              <span>·</span>
              <span>Backend Systems</span>
              <span>·</span>
              <span>AI/ML Learning</span>
            </p>
          </div>

          {/* Hero CTAs: View Projects, View Resume, Contact Me */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              onClick={e => handleNavClick(e, 'projects')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0 -translate-y-0.5 transition-all duration-200"
            >
              <span>View Projects</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold text-sm hover:border-emerald-500/50 hover:bg-[var(--bg-surface-elevated)] transition-all duration-200 shadow-sm"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>View Resume</span>
            </button>

            <a
              href="#contact"
              onClick={e => handleNavClick(e, 'contact')}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-[var(--text-secondary)] hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-sm transition-colors group"
            >
              <Send className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
              <span>Contact Me</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Profile Portrait (Clean & Focused) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative">
          <div className="relative w-full max-w-xs sm:max-w-sm aspect-square">
            {/* Subtle background glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 bg-emerald-500/10 rounded-3xl blur-2xl transition-opacity duration-300 pointer-events-none"
              style={{ opacity: isHovered ? 0.35 : 0.15 }}
            />

            {/* Profile Image Frame */}
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl transition-all duration-300 group"
              style={{
                transform: !prefersReducedMotion
                  ? `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) scale(${isHovered ? 1.02 : 1})`
                  : undefined,
                boxShadow: isHovered ? '0 20px 40px -15px rgba(16, 185, 129, 0.2)' : undefined
              }}
            >
              <img
                src={profile.profilePhoto || '/src/assets/images/hero_profile_portrait_1791050565075.jpg'}
                alt={`${profile.name} — Software Engineering Undergraduate`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

              {/* Small Professional Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-xs font-mono">
                <p className="font-bold text-sm text-white font-display">
                  {profile.name}
                </p>
                <p className="text-emerald-400 text-[11px]">
                  Software Engineering Undergraduate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
