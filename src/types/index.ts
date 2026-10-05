export type ProjectCategory = 'All' | 'Full-Stack' | 'Web' | 'AI' | 'Cloud' | 'Systems' | 'Mobile';

export interface ProjectCaseStudy {
  problem?: string;
  solution?: string;
  engineeringApproach?: string;
  architectureDiagram?: string;
  architectureDetails?: string;
  keyFeatures?: { title: string; desc: string }[];
  implementation?: string;
  challenges?: string;
  lessonsLearned?: string;
  futureImprovements?: string;
  role?: string;
  team?: string;
}

export interface Project {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'Full-Stack' | 'Web' | 'AI' | 'Cloud' | 'Systems' | 'Mobile';
  description: string; // short description (required)
  longDescription?: string; // optional
  additionalNote?: string; // optional note (e.g. University coursework project)
  year?: string;
  image: string; // cover image
  screenshots?: string[];
  liveUrl?: string; // optional
  githubUrl?: string; // optional
  documentationUrl?: string; // optional
  technologies: string[];
  status: 'In Production' | 'Active Prototype' | 'Shipped' | 'Completed';
  featured: boolean;
  published: boolean;
  isDetailed?: boolean; // whether full engineering case study is available
  caseStudy?: ProjectCaseStudy;
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Databases & Systems' | 'Cloud & DevOps' | 'Practices & Architecture';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  icon?: string;
  officialUrl?: string;
  relatedProjects: string[]; // Project titles or IDs
  relatedSkills: string[];
  level: 'Core Focus' | 'Proficient' | 'Working Knowledge';
  enabled?: boolean;
  featured?: boolean;
  displayOrder?: number;
}

export interface FocusArea {
  id: string;
  title: string;
  tagline: string;
  description: string;
  relatedTechnologies: string[];
  relatedProjectSlugs: string[];
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'medium' | 'email' | 'twitter' | 'other';
  label: string;
  url: string;
  icon?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface SectionConfig {
  id: string;
  key: string;
  title: string;
  description?: string;
  navLabel: string;
  enabled: boolean;
  displayOrder: number;
  showInNav: boolean;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: 'profile' | 'project' | 'screenshot' | 'certificate' | 'achievement' | 'activity' | 'resume';
  mimeType: string;
  size: string;
  uploadDate: string;
  usedBy: string;
}

export interface EducationItem {
  id: string;
  university: string;
  faculty: string;
  department?: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  coursework: string[];
  achievements: string[];
  image?: string;
  published: boolean;
  displayOrder: number;
}

export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  type: 'Internship' | 'Employment' | 'Freelance' | 'Research' | 'University Role' | 'Project Role';
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
  published: boolean;
  displayOrder?: number;
}

export interface JourneyMilestone {
  id: string;
  date: string;
  title: string;
  organization: string;
  type: 'University' | 'Experience' | 'Projects' | 'Community';
  description: string;
  technologies?: string[];
  achievements?: string[];
  relatedProject?: string;
  relatedEducation?: string;
  relatedSkill?: string;
  image?: string;
  externalUrl?: string;
  displayOrder?: number;
  published?: boolean;
}

export interface Certification {
  id: string;
  title: string;
  organization: string; // issuer
  issuer?: string; // optional alias
  issueDate: string;
  date?: string; // optional alias
  expiryDate?: string;
  credentialId: string;
  verificationUrl: string;
  description?: string;
  image?: string;
  pdfUrl?: string;
  skills: string[];
  published: boolean;
  featured: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  organization: string;
  date: string;
  description: string;
  evidenceUrl?: string;
  image?: string;
  featured: boolean;
  published: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  organization: string;
  role: string;
  type: 'Volunteering' | 'Hackathon' | 'Workshop' | 'Conference' | 'Competition' | 'Club' | 'Society' | 'Technical Event';
  date: string;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
  image?: string;
  externalUrl?: string;
  published: boolean;
  featured: boolean;
}

export interface LearningItem {
  id: string;
  title: string;
  type?: 'Technology' | 'Course' | 'AI/ML Topic' | 'Engineering Concept' | 'Certification Preparation';
  description: string;
  status: 'In Progress' | 'Deep Dive' | 'Synthesizing' | 'Completed';
  startedDate: string;
  relatedProject?: string;
  relatedCourse?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface ActivityFeedItem {
  id: string;
  action: string;
  date: string;
  type: 'project' | 'certification' | 'writing' | 'milestone' | 'portfolio';
  details?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
  published: boolean; // Published vs Draft
  draft?: boolean;
  coverImage?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  read: boolean;
}

export interface SiteProfile {
  name: string;
  role: string;
  supportingTitle: string;
  tagline: string;
  shortIntro: string;
  aboutText: string;
  careerDirection: string;
  location: string;
  showLocation: boolean;
  email: string;
  availability: string;
  profilePhoto: string;
  alternateProfilePhoto: string;
  engineeringInterests: string[];
  engineeringPrinciples?: string[];
  socialLinks: SocialLink[];
  resume: {
    professionalTitle: string;
    summary: string;
    resumePdfUrl?: string;
    published?: boolean;
    lastUpdated?: string;
  };
}
