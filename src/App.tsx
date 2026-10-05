import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { CustomCursor } from './components/common/CustomCursor';
import { ScrollProgress } from './components/common/ScrollProgress';
import { BackToTop } from './components/common/BackToTop';
import { Navbar } from './components/navigation/Navbar';
import { Hero } from './components/sections/Hero';
import { EngineeringIntro } from './components/sections/EngineeringIntro';
import { FeaturedProjects } from './components/sections/FeaturedProjects';
import { ProjectCaseStudyModal } from './components/sections/ProjectCaseStudyModal';
import { TechnologyExplorer } from './components/sections/TechnologyExplorer';
import { CertificationsGallery } from './components/sections/CertificationsGallery';
import { ResumeSection, ResumeModal } from './components/sections/ResumeSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { EducationSection } from './components/sections/EducationSection';
import { Project } from './types';

// Admin CMS Modules
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminProfile } from './components/admin/AdminProfile';
import { AdminAbout } from './components/admin/AdminAbout';
import { AdminSkills } from './components/admin/AdminSkills';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminExperience } from './components/admin/AdminExperience';
import { AdminEducation } from './components/admin/AdminEducation';
import { AdminCertifications } from './components/admin/AdminCertifications';
import { AdminResume } from './components/admin/AdminResume';
import { AdminMedia } from './components/admin/AdminMedia';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminSettings } from './components/admin/AdminSettings';
import { Loader2 } from 'lucide-react';

function PortfolioApp() {
  const { projects } = useData();
  const { isAuthenticated, isLoading, checkSession } = useAuth();

  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Sync navigation on browser popstate (back/forward) and history push
  useEffect(() => {
    const handleLocationChange = () => {
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash.toLowerCase();

      // Legacy hash #admin redirect to /admin
      if (currentHash === '#admin') {
        window.history.replaceState(null, '', '/admin');
        setPathname('/admin');
        return;
      }

      setPathname(currentPath);

      // Handle direct slug route /projects/:slug
      if (currentPath.startsWith('/projects/')) {
        const slug = currentPath.replace('/projects/', '').trim();
        const found = projects.find(p => p.slug === slug);
        if (found) setSelectedCaseStudy(found);
      } else if (currentPath === '/resume') {
        setResumeModalOpen(true);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [projects]);

  // Handle URL hash smooth scrolling on load/change
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'admin') {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const navOffset = 76;
          const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname]);

  const navigateTo = (newPath: string) => {
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
      setPathname(newPath);
    }
  };

  const handleSelectProjectByTitle = (title: string) => {
    const found = projects.find(
      p =>
        p.title.toLowerCase() === title.toLowerCase() ||
        p.slug.toLowerCase() === title.toLowerCase()
    );
    if (found) {
      setSelectedCaseStudy(found);
      window.history.pushState(null, '', `/projects/${found.slug}`);
    }
  };

  // Determine current experience:
  const isLoginRoute = pathname === '/admin/login';
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  // Determine active admin tab from pathname
  const adminSubpath = pathname.replace(/^\/admin\/?/, '');
  const activeAdminTab: AdminTab =
    adminSubpath === '' ? 'overview' : (adminSubpath as AdminTab);

  // AUTH PROTECTION: If user tries to visit /admin or /admin/* without auth, redirect to /admin/login
  useEffect(() => {
    if (!isLoading && isAdminRoute && !isAuthenticated) {
      window.history.replaceState(null, '', '/admin/login');
      setPathname('/admin/login');
    }
  }, [isAdminRoute, isAuthenticated, isLoading]);

  // If user is on /admin/login and already authenticated, redirect to /admin
  useEffect(() => {
    if (!isLoading && isLoginRoute && isAuthenticated) {
      window.history.replaceState(null, '', '/admin');
      setPathname('/admin');
    }
  }, [isLoginRoute, isAuthenticated, isLoading]);

  // Loading state during session check
  if (isLoading && (isAdminRoute || isLoginRoute)) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Verifying security session...
          </span>
        </div>
      </div>
    );
  }

  // --- EXPERIENCE 1: ADMIN LOGIN SCREEN (/admin/login) ---
  if (isLoginRoute && !isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          navigateTo('/admin');
        }}
        onNavigateHome={() => {
          navigateTo('/');
        }}
      />
    );
  }

  // --- EXPERIENCE 2: ADMIN CMS STUDIO (/admin & /admin/*) ---
  if (isAdminRoute && isAuthenticated) {
    return (
      <AdminLayout
        currentTab={activeAdminTab}
        setCurrentTab={tab => {
          navigateTo(tab === 'overview' ? '/admin' : `/admin/${tab}`);
        }}
        onExitAdmin={() => {
          navigateTo('/');
        }}
      >
        {activeAdminTab === 'overview' && (
          <AdminOverview
            onNavigateTab={tab => navigateTo(tab === 'overview' ? '/admin' : `/admin/${tab}`)}
            onViewPortfolio={() => navigateTo('/')}
          />
        )}
        {activeAdminTab === 'profile' && <AdminProfile />}
        {activeAdminTab === 'about' && <AdminAbout />}
        {activeAdminTab === 'skills' && <AdminSkills />}
        {activeAdminTab === 'projects' && <AdminProjects />}
        {activeAdminTab === 'experience' && <AdminExperience />}
        {activeAdminTab === 'education' && <AdminEducation />}
        {activeAdminTab === 'certifications' && <AdminCertifications />}
        {activeAdminTab === 'resume' && <AdminResume />}
        {activeAdminTab === 'media' && <AdminMedia />}
        {activeAdminTab === 'messages' && <AdminMessages />}
        {activeAdminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // --- EXPERIENCE 3: PUBLIC PORTFOLIO SITE (/) ---
  return (
    <div className="relative min-h-screen transition-colors duration-200">
      {/* Desktop subtle cursor follower */}
      <CustomCursor />

      {/* Global thin emerald scroll progress indicator */}
      <ScrollProgress />

      {/* Sticky Navigation Bar */}
      <Navbar onNavigate={navigateTo} />

      <main className="focus:outline-none">
        {/* 1. Home / Hero (id="home") */}
        <Hero onOpenResume={() => setResumeModalOpen(true)} />

        {/* 2. About / Engineering Philosophy (id="about") */}
        <EngineeringIntro />

        {/* 3. Featured Projects (id="projects") */}
        <FeaturedProjects
          onSelectProject={proj => {
            setSelectedCaseStudy(proj);
            window.history.pushState(null, '', `/projects/${proj.slug}`);
          }}
        />

        {/* 4. Technical Skills (id="skills") */}
        <TechnologyExplorer onSelectProjectByTitle={handleSelectProjectByTitle} />

        {/* 5. Engineering Experience (id="experience") */}
        <ExperienceSection />

        {/* 6. Academic Education (id="education") */}
        <EducationSection />

        {/* 7. Verified Certifications (id="certifications") */}
        <CertificationsGallery />

        {/* 8. Professional Resume Preview (id="resume") */}
        <ResumeSection />

        {/* 9. Contact Section (id="contact") */}
        <ContactSection />

        {/* Simplified Footer */}
        <Footer />

        {/* Floating Back to Top control */}
        <BackToTop />
      </main>

      {/* Global Interactive Modals */}
      <ProjectCaseStudyModal
        project={selectedCaseStudy}
        isOpen={Boolean(selectedCaseStudy)}
        onClose={() => {
          setSelectedCaseStudy(null);
          if (window.location.pathname.startsWith('/projects/')) {
            window.history.pushState(null, '', '/');
          }
        }}
      />

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => {
          setResumeModalOpen(false);
          if (window.location.pathname === '/resume') {
            window.history.pushState(null, '', '/');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <PortfolioApp />
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
