import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { profile, isSectionEnabled } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Exact header navigation order required:
  // Home, About, Projects, Skills, Experience, Education, Certifications, Resume, Contact
  // About MUST come before Projects.
  const allNavItems = [
    { label: 'Home', id: 'home', href: '/#home', sectionKey: 'hero' },
    { label: 'About', id: 'about', href: '/#about', sectionKey: 'about' },
    { label: 'Projects', id: 'projects', href: '/#projects', sectionKey: 'projects' },
    { label: 'Skills', id: 'skills', href: '/#skills', sectionKey: 'skills' },
    { label: 'Experience', id: 'experience', href: '/#experience', sectionKey: 'experience' },
    { label: 'Education', id: 'education', href: '/#education', sectionKey: 'education' },
    { label: 'Certifications', id: 'certifications', href: '/#certifications', sectionKey: 'certifications' },
    { label: 'Resume', id: 'resume', href: '/resume', sectionKey: 'resume' },
    { label: 'Contact', id: 'contact', href: '/#contact', sectionKey: 'contact' }
  ];

  const navItems = allNavItems.filter(
    item => item.id === 'home' || isSectionEnabled(item.sectionKey)
  );

  // Scroll detection & active section indicator using true DOM order
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // DOM order: home, about, projects, skills, experience, education, certifications, resume, contact
      const sectionOrder = ['home', 'about', 'projects', 'skills', 'experience', 'education', 'certifications', 'resume', 'contact'];
      let current = 'home';

      for (const id of sectionOrder) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            current = id;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile drawer keyboard & scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === 'resume') {
      if (onNavigate) {
        onNavigate('/resume');
      } else {
        window.history.pushState(null, '', '/resume');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      return;
    }

    // Update URL hash without reload
    const targetHash = `#${targetId}`;
    if (window.location.hash !== targetHash) {
      history.pushState(null, '', `/#${targetId}`);
    }

    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
      return;
    }

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const navOffset = 76;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(targetId);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm'
            : 'py-4 lg:py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
          {/* LEFT: Logo / Name */}
          <a
            href="/#home"
            onClick={e => handleNavClick(e, 'home', '/#home')}
            className="flex items-center gap-2.5 group text-left shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs tracking-wider transition-all group-hover:border-emerald-500 shadow-sm">
              NF
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                {profile.name}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[var(--text-secondary)] leading-tight">
                Software Engineering Undergraduate
              </span>
            </div>
          </a>

          {/* CENTER: Home, About, Projects, Skills, Experience, Education, Certifications, Resume, Contact */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5">
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={e => handleNavClick(e, item.id, item.href)}
                  className={`relative text-xs xl:text-sm font-medium transition-colors py-1 hover:text-[var(--text-primary)] whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-500 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: ONE Theme Toggle + Get in Touch + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* ONE Theme Control: Sun in Dark mode, Moon in Light mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center justify-center shadow-sm"
              title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Get in Touch CTA */}
            <a
              href="/#contact"
              onClick={e => handleNavClick(e, 'contact', '/#contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-400 transition-all shadow-sm active:translate-y-0 -translate-y-0.5 cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 text-[var(--text-primary)] hover:text-emerald-500 rounded-lg lg:hidden hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-200"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                    NF
                  </div>
                  <span className="font-display font-bold text-sm text-[var(--text-primary)]">
                    {profile.name}
                  </span>
                </div>
                <button
                  ref={firstFocusableRef}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navItems.map(item => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={e => handleNavClick(e, item.id, item.href)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Bottom CTA */}
            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <a
                href="/#contact"
                onClick={e => handleNavClick(e, 'contact', '/#contact')}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 text-white dark:text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
