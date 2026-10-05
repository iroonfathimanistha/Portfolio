import {
  Project,
  SkillItem,
  FocusArea,
  Certification,
  Achievement,
  ActivityItem,
  EducationItem,
  ExperienceItem,
  LearningItem,
  ActivityFeedItem,
  BlogPost,
  SiteProfile,
  SectionConfig,
  SocialLink,
  MediaItem,
  JourneyMilestone
} from '../types';

export const initialSocialLinks: SocialLink[] = [
  {
    id: 'soc-github',
    platform: 'github',
    label: 'GitHub',
    url: 'https://github.com/nisthafathima',
    enabled: true,
    displayOrder: 1
  },
  {
    id: 'soc-linkedin',
    platform: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/nisthafathima',
    enabled: true,
    displayOrder: 2
  },
  {
    id: 'soc-medium',
    platform: 'medium',
    label: 'Medium',
    url: 'https://medium.com/@nisthafathima',
    enabled: true,
    displayOrder: 3
  },
  {
    id: 'soc-email',
    platform: 'email',
    label: 'Email',
    url: 'mailto:nisthafathima99@gmail.com',
    enabled: true,
    displayOrder: 4
  }
];

export const initialSectionsConfig: SectionConfig[] = [
  { id: 'sec-hero', key: 'hero', title: 'Hero & Introduction', navLabel: 'Home', enabled: true, displayOrder: 1, showInNav: true },
  { id: 'sec-about', key: 'about', title: 'About & Background', navLabel: 'About', enabled: true, displayOrder: 2, showInNav: true },
  { id: 'sec-projects', key: 'projects', title: 'Featured Projects', navLabel: 'Projects', enabled: true, displayOrder: 3, showInNav: true },
  { id: 'sec-skills', key: 'skills', title: 'Technology Explorer', navLabel: 'Skills', enabled: true, displayOrder: 4, showInNav: true },
  { id: 'sec-experience', key: 'experience', title: 'Engineering Experience', navLabel: 'Experience', enabled: true, displayOrder: 5, showInNav: true },
  { id: 'sec-education', key: 'education', title: 'Academic Education', navLabel: 'Education', enabled: true, displayOrder: 6, showInNav: true },
  { id: 'sec-certifications', key: 'certifications', title: 'Certifications', navLabel: 'Certifications', enabled: true, displayOrder: 7, showInNav: true },
  { id: 'sec-activities', key: 'activities', title: 'Activities & Volunteering', navLabel: 'Activities', enabled: false, displayOrder: 8, showInNav: false },
  { id: 'sec-achievements', key: 'achievements', title: 'Achievements & Honors', navLabel: 'Achievements', enabled: false, displayOrder: 9, showInNav: false },
  { id: 'sec-learning', key: 'currentlyLearning', title: 'Currently Learning Track', navLabel: 'Learning', enabled: false, displayOrder: 10, showInNav: false },
  { id: 'sec-activity', key: 'recentActivity', title: 'Recent Activity Feed', navLabel: 'Activity', enabled: false, displayOrder: 11, showInNav: false },
  { id: 'sec-blog', key: 'blog', title: 'Engineering Notes & Writing', navLabel: 'Writing', enabled: false, displayOrder: 12, showInNav: false },
  { id: 'sec-resume', key: 'resume', title: 'Resume Preview', navLabel: 'Resume', enabled: true, displayOrder: 13, showInNav: true },
  { id: 'sec-contact', key: 'contact', title: 'Contact', navLabel: 'Contact', enabled: true, displayOrder: 14, showInNav: true }
];

export const initialProfile: SiteProfile = {
  name: 'Nistha Fathima',
  role: 'Software Engineering Undergraduate',
  supportingTitle: 'Full-Stack Systems & Web Architecture',
  tagline: 'Building software with engineering fundamentals.',
  shortIntro: 'Undergraduate software engineer dedicated to building resilient distributed systems, high-integrity full-stack applications, and performant web products with strict architectural discipline.',
  aboutText: 'I approach software not merely as code, but as a deliberate discipline of problem definition, structural modeling, and engineering fundamentals. Currently completing my software engineering undergraduate studies, I combine rigor in data persistence, concurrent systems, and modern TypeScript architectures with an appreciation for crisp, human-centered product ergonomics.',
  careerDirection: 'Seeking Software Engineering Internship & Graduate Engineering opportunities where I can apply strong fundamentals in typed systems, scalable database design, and end-to-end web architectures.',
  location: 'Colombo, Sri Lanka',
  showLocation: true,
  email: 'nisthafathima99@gmail.com',
  availability: 'Available for Software Engineering Internships & Grad Roles (2026–2027)',
  profilePhoto: '/src/assets/images/hero_profile_portrait_1791050565075.jpg',
  alternateProfilePhoto: '',
  engineeringInterests: [
    'Software Engineering',
    'Full-Stack Development',
    'Backend Development',
    'Relational Databases',
    'Distributed Systems',
    'Software Testing & Verification'
  ],
  engineeringPrinciples: [
    'Build with architectural clarity',
    'Test with deterministic verification',
    'Learn from first principles',
    'Improve continuously through feedback'
  ],
  socialLinks: initialSocialLinks,
  resume: {
    professionalTitle: 'Software Engineer | Full-Stack & Systems Undergraduate',
    summary: 'Detail-oriented Software Engineering Undergraduate with foundational strengths in typed full-stack architectures, relational database optimization, and API design. Proven track record executing production-caliber case studies including workforce governance platforms and localized logistics engines.',
    lastUpdated: 'October 2026'
  }
};

export const initialFocusAreas: FocusArea[] = [
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    tagline: 'Reliability, clean boundaries & disciplined testing',
    description: 'Applying solid architectural principles, continuous refactoring, and deterministic testing to ensure systems remain maintainable across years of domain evolution.',
    relatedTechnologies: ['TypeScript', 'Design Patterns', 'Testing & Verification', 'Git & GitHub', 'Clean Architecture'],
    relatedProjectSlugs: ['labourlink', 'bitego']
  },
  {
    id: 'full-stack-dev',
    title: 'Full-Stack Development',
    tagline: 'End-to-end data flow with type-safe contracts',
    description: 'Crafting responsive user interfaces paired with resilient server APIs. Prioritizing instant feedback loops, zero layout shifts, and relational schema integrity.',
    relatedTechnologies: ['React', 'TypeScript', 'Node.js & Express', 'PostgreSQL', 'Tailwind CSS'],
    relatedProjectSlugs: ['labourlink', 'bitego', 'pulsecare']
  },
  {
    id: 'ai-ml',
    title: 'Applied AI & ML',
    tagline: 'Grounded intelligence, pipeline integration & evaluation',
    description: 'Integrating machine learning models into practical software workflows with structured output guarantees, evaluation harnesses, and domain-grounded retrieval.',
    relatedTechnologies: ['Python', 'FastAPI', 'Relational Modeling'],
    relatedProjectSlugs: ['pulsecare']
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & Systems',
    tagline: 'Containerized deployments & reproducible environments',
    description: 'Designing automated build pipelines, containerized environments, and cloud infrastructure with observability, minimal blast radiuses, and zero-downtime rollouts.',
    relatedTechnologies: ['Docker', 'Linux / Bash', 'PostgreSQL', 'CI/CD Pipelines'],
    relatedProjectSlugs: ['labourlink', 'bitego']
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    slug: 'labourlink',
    number: '01',
    title: 'LabourLink',
    subtitle: 'Migrant Workers Management & Compliance System',
    category: 'Full-Stack',
    year: '2026',
    description: 'A web-based migrant worker management system designed to automate contract validation, remittance tracking, and regulatory welfare compliance.',
    longDescription: 'Comprehensive platform bridging agencies, employers, and government welfare units with deterministic audit logs and encrypted records.',
    image: '/src/assets/images/project_labourlink_ui_1791050578809.jpg',
    liveUrl: 'https://labourlink-demo.app',
    githubUrl: 'https://github.com/nisthafathima/labourlink',
    documentationUrl: 'https://github.com/nisthafathima/labourlink#readme',
    technologies: ['React', 'TypeScript', 'ASP.NET Core', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
    status: 'In Production',
    featured: true,
    published: true,
    isDetailed: true,
    caseStudy: {
      problem: 'Migrant worker deployment agencies struggle with decentralized documentation, non-standardized biometric logs, and delayed compliance reports. Manual record handling led to a 34% rate of verification bottlenecks and high audit overhead.',
      solution: 'LabourLink unifies employer registry, identity verification, medical clearance pipelines, and grievance management into a single audit-logged dashboard with strict data encryption.',
      engineeringApproach: 'Applied domain-driven design (DDD) with clean hexagonal layering. Separated identity validation services from grievance dispute state machines, enforcing immutable audit logs for all cross-border personnel actions.',
      architectureDiagram: '/src/assets/images/architecture_system_diagram_1791050615669.jpg',
      architectureDetails: 'Clients interface via a high-performance React SPA communicating through an API Gateway to decoupled ASP.NET Core services. Persistence uses PostgreSQL with row-level security policies, paired with an asynchronous job queue for document watermarking.',
      keyFeatures: [
        { title: 'Automated Compliance Pipeline', desc: 'Validates government-mandated pre-departure clearances with automated document expiry watchers.' },
        { title: 'Role-Based Audited Portals', desc: 'Distinct authorization trees for regulatory inspectors, employer sponsors, and legal welfare officers.' },
        { title: 'Secure Identity Ledger', desc: 'HMAC-signed audit entries tracking state transitions across contractual onboarding.' },
        { title: 'Real-time Shift & Dispatch Telemetry', desc: 'Geofenced reporting interfaces providing field supervisors with live staffing metrics.' }
      ],
      implementation: 'Built with React 19 and TypeScript on the client, leveraging optimistic mutation rollbacks and modular form state management. The backend is written in ASP.NET Core with Entity Framework Core, structured with CQRS commands and queries.',
      challenges: 'Handling inconsistent multi-lingual input and flaky network environments in remote deployment camps. Solved by implementing an offline-first indexed client buffer with deterministic sync reconciliation.',
      lessonsLearned: 'Strict type contracts between frontend and backend schemas eliminate 90% of runtime data corruption. Early investment in schema migration rollback scripts saved countless dev hours.',
      futureImprovements: 'Implementing automated visa OCR document classification and localized SMS status notifications for non-smartphone users.'
    }
  },
  {
    id: 'proj-2',
    slug: 'bitego',
    number: '02',
    title: 'BiteGo',
    subtitle: 'Campus Food Delivery & Micro-Logistics Engine',
    category: 'Web',
    year: '2026',
    description: 'A localized peer-to-peer campus food ordering platform optimizing delivery batching, kitchen preparation queues, and route-efficient dormitory drop-offs.',
    longDescription: 'Event-driven coordination engine ensuring zero food cold-drops across 14 campus residential halls.',
    image: '/src/assets/images/project_bitego_ui_1791050591976.jpg',
    liveUrl: '',
    githubUrl: 'https://github.com/nisthafathima/bitego',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    status: 'Shipped',
    featured: true,
    published: true,
    isDetailed: true,
    caseStudy: {
      problem: 'University cafeterias face intense 20-minute order surges during lecture breaks, resulting in queue pileups, food spoilage, and delayed student schedules.',
      solution: 'BiteGo introduces dynamic order batching and pre-scheduled pickup slots tailored specifically to university timetable intervals and campus walking corridors.',
      engineeringApproach: 'Designed an event-driven queue dispatcher that batches student orders heading to the same residential wing within 5-minute departure windows.',
      architectureDiagram: '/src/assets/images/architecture_system_diagram_1791050615669.jpg',
      architectureDetails: 'Vite React client connects via persistent WebSocket channels to an Express backend. Node workers process batching windows using an in-memory priority queue synchronized with PostgreSQL.',
      keyFeatures: [
        { title: 'Time-Window Slot Reservation', desc: 'Locks in preparation intervals coordinated with university bell schedules.' },
        { title: 'Wing-Based Delivery Aggregation', desc: 'Clusters multiple orders into single courier runs across campus quads.' },
        { title: 'Real-Time Preparation Status', desc: 'Live kitchen telemetry pushing updates without battery-draining client polling.' }
      ],
      implementation: 'Engineered using custom React state reducers for high-speed cart operations, Tailwind CSS for zero-runtime styling, and WebSockets for real-time dispatch state broadcasting.',
      challenges: 'Handling concurrent contention for limited kitchen prep slots when hundreds of students placed orders simultaneously at the 12:00 PM bell. Resolved using PostgreSQL advisory locks.',
      lessonsLearned: 'WebSockets require proactive heartbeat pings and reconnect jitter to handle campus Wi-Fi zone handoffs gracefully.',
      futureImprovements: 'Integrating push notifications and offline progressive web app caching for poor basement network coverage.'
    }
  },
  {
    id: 'proj-3',
    slug: 'pulsecare',
    number: '03',
    title: 'PulseCare',
    subtitle: 'Clinical Triage & Health Records Platform',
    category: 'Full-Stack',
    year: '2025',
    description: 'An ergonomic health records management platform empowering triage nurses to rapidly capture vital signs, flag clinical risk scores, and organize patient handovers.',
    image: '/src/assets/images/project_pulsecare_ui_1791050604023.jpg',
    liveUrl: '', // Intentionally empty to test requirement: when Live Demo is empty, DO NOT show Live Demo publicly!
    githubUrl: 'https://github.com/nisthafathima/pulsecare',
    technologies: ['React', 'TypeScript', 'Python', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Active Prototype',
    featured: true,
    published: true,
    isDetailed: true,
    caseStudy: {
      problem: 'High-stress clinical triage workflows suffer from clunky legacy software interfaces that demand dozens of clicks per vital entry, slowing emergency assessments.',
      solution: 'PulseCare offers keyboard-first rapid vital data entry, instant automated National Early Warning Score (NEWS2) calculation, and color-blind safe priority categorization.',
      engineeringApproach: 'Constructed with accessibility and speed as first-order constraints. Minimized input steps through predictive keyboard traversal and strict validation rules.',
      keyFeatures: [
        { title: 'Rapid Keyboard Vital Input', desc: 'Enables triage staff to log complete vital panels in under 18 seconds.' },
        { title: 'Deterministic Risk Scoring', desc: 'Automated scoring engine with transparent calculation audit trails.' }
      ],
      implementation: 'Frontend built with React and strict TypeScript; backend microservice in Python FastAPI using async relational drivers with PostgreSQL.',
      challenges: 'Guaranteeing deterministic arithmetic across floating point physiological metrics and ensuring compliance with clinical accessibility standards.',
      lessonsLearned: 'Direct feedback loops with actual medical practitioners transformed our interface from a generic form to a rapid, life-critical tool.',
      futureImprovements: 'Adding HL7/FHIR interoperability export formats and Bluetooth LE pulse oximeter integration.'
    }
  },
  {
    id: 'proj-4',
    slug: 'university-coursework',
    number: '04',
    title: 'University Database Engine',
    subtitle: 'Relational Schema & Concurrency Controller',
    category: 'Systems',
    year: '2025',
    description: 'An academic relational storage engine implementing strict transaction isolation, WAL recovery logging, and B-Tree indexing benchmarks.',
    image: '/src/assets/images/architecture_system_diagram_1791050615669.jpg',
    liveUrl: '',
    githubUrl: '',
    technologies: ['Java', 'SQL', 'Algorithms'],
    status: 'Completed',
    featured: false,
    published: true,
    isDetailed: true,
    caseStudy: {
      problem: 'Concurrency bottlenecks and dirty read anomalies during simultaneous multi-threaded table updates.',
      solution: 'Constructed an ACID-compliant two-phase locking transaction manager with deadlock graph detection.',
      challenges: 'Managing page buffer cache eviction policies under intense memory pressure.',
      lessonsLearned: 'Strict adherence to transaction protocols prevents irreversible storage corruption.'
    }
  }
];

export const initialSkills: SkillItem[] = [
  {
    id: 'skill-react',
    name: 'React',
    category: 'Frontend',
    description: 'Declarative component architecture, custom hooks, concurrent rendering, and performance optimization.',
    officialUrl: 'https://react.dev',
    relatedProjects: ['LabourLink', 'BiteGo', 'PulseCare'],
    relatedSkills: ['TypeScript', 'Tailwind CSS'],
    level: 'Core Focus',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    category: 'Frontend',
    description: 'Strict type safety, generic utility types, discriminant unions, and end-to-end schema validation.',
    officialUrl: 'https://www.typescriptlang.org',
    relatedProjects: ['LabourLink', 'BiteGo', 'PulseCare'],
    relatedSkills: ['React', 'Node.js & Express', 'ASP.NET Core'],
    level: 'Core Focus',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend',
    description: 'Utility-first styling, design token systems, responsive fluid layouts, and dark mode theming.',
    officialUrl: 'https://tailwindcss.com',
    relatedProjects: ['LabourLink', 'BiteGo', 'PulseCare'],
    relatedSkills: ['React'],
    level: 'Core Focus',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-aspnet',
    name: 'ASP.NET Core',
    category: 'Backend',
    description: 'C# enterprise API development, Entity Framework Core, dependency injection, and clean architecture.',
    officialUrl: 'https://dotnet.microsoft.com',
    relatedProjects: ['LabourLink'],
    relatedSkills: ['PostgreSQL', 'Docker'],
    level: 'Proficient',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-nodejs',
    name: 'Node.js & Express',
    category: 'Backend',
    description: 'Asynchronous event loops, RESTful microservices, WebSocket channels, and middleware pipelines.',
    officialUrl: 'https://nodejs.org',
    relatedProjects: ['BiteGo'],
    relatedSkills: ['TypeScript', 'PostgreSQL'],
    level: 'Core Focus',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-python',
    name: 'Python',
    category: 'Backend',
    description: 'FastAPI REST services, algorithm prototyping, data analysis, and machine learning pipelines.',
    officialUrl: 'https://www.python.org',
    relatedProjects: ['PulseCare'],
    relatedSkills: ['PostgreSQL'],
    level: 'Proficient',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-postgresql',
    name: 'PostgreSQL',
    category: 'Databases & Systems',
    description: 'Relational data modeling, indexing strategies, ACID transactions, complex joins, and query optimization.',
    officialUrl: 'https://www.postgresql.org',
    relatedProjects: ['LabourLink', 'BiteGo', 'PulseCare'],
    relatedSkills: ['ASP.NET Core', 'Node.js & Express'],
    level: 'Core Focus',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-docker',
    name: 'Docker',
    category: 'Cloud & DevOps',
    description: 'Containerization, multi-stage Dockerfiles, compose stacks, and reproducible development runtimes.',
    officialUrl: 'https://www.docker.com',
    relatedProjects: ['LabourLink'],
    relatedSkills: ['PostgreSQL'],
    level: 'Proficient',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-git',
    name: 'Git & GitHub',
    category: 'Practices & Architecture',
    description: 'Feature branching workflows, pull request reviews, rebase hygiene, and CI/CD automation.',
    officialUrl: 'https://git-scm.com',
    relatedProjects: ['LabourLink', 'BiteGo', 'PulseCare'],
    relatedSkills: ['Clean Architecture'],
    level: 'Core Focus',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-clean-arch',
    name: 'Clean Architecture',
    category: 'Practices & Architecture',
    description: 'Hexagonal layering, inversion of control, domain models, and decoupled persistence boundaries.',
    relatedProjects: ['LabourLink'],
    relatedSkills: ['ASP.NET Core', 'TypeScript'],
    level: 'Core Focus',
    enabled: true,
    featured: true
  },
  {
    id: 'skill-testing',
    name: 'Testing & Verification',
    category: 'Practices & Architecture',
    description: 'Unit testing, integration testing, boundary analysis, and deterministic regression suites.',
    relatedProjects: ['LabourLink', 'BiteGo', 'PulseCare'],
    relatedSkills: ['TypeScript', 'React'],
    level: 'Proficient',
    enabled: true,
    featured: true
  }
];

export const initialEducation: EducationItem[] = [
  {
    id: 'edu-1',
    university: 'Faculty of Computing & Information Technology',
    faculty: 'School of Software Systems',
    department: 'Software Engineering Department',
    degree: 'BSc (Hons) in Software Engineering',
    startDate: '2023',
    endDate: 'Present (Expected 2027)',
    description: 'Undergraduate engineering curriculum emphasizing discrete mathematics, concurrent algorithms, distributed systems, relational modeling, and verified compiler fundamentals. Cumulative GPA: 3.86/4.00 (Dean\'s Honor List for 3 consecutive academic years).',
    coursework: [
      'Data Structures & Algorithms',
      'Relational Database Systems (SQL)',
      'Operating Systems & Concurrent Programming',
      'Object-Oriented Design & Patterns',
      'Software Testing & Verification',
      'Web Architecture & API Security'
    ],
    achievements: [
      'Dean\'s Honor List for Academic Excellence (2024, 2025, 2026)',
      'Peer Academic Mentor for Algorithms & Object-Oriented Programming',
      'Lead student representative for Faculty Computing Colloquium'
    ],
    published: true,
    displayOrder: 1
  }
];

export const initialExperience: ExperienceItem[] = [
  {
    id: 'exp-1',
    organization: 'Apex CodeCraft Lab',
    role: 'Software Engineering Trainee',
    type: 'Internship',
    startDate: 'Jun 2025',
    endDate: 'Nov 2025',
    description: 'Collaborated on production backend APIs, executed database indexing improvements, and built reusable component libraries across distributed agile sprints.',
    responsibilities: [
      'Engineered core backend endpoints in ASP.NET Core & PostgreSQL, reducing p95 response latencies from 240ms to 78ms.',
      'Constructed accessible, typed React interfaces with strict compile-time invariants and comprehensive component tests.',
      'Implemented role-based authorization hierarchies and JWT token renewal patterns.'
    ],
    technologies: ['ASP.NET Core', 'PostgreSQL', 'React', 'TypeScript', 'Docker'],
    achievements: ['Awarded top performance review among summer cohort trainees'],
    published: true,
    displayOrder: 1
  },
  {
    id: 'exp-2',
    organization: 'University Peer Tutoring Circle',
    role: 'Peer Academic Mentor (Algorithms & OOP)',
    type: 'University Role',
    startDate: 'Feb 2024',
    endDate: 'Present',
    description: 'Conducting weekly technical mentoring sessions for 45+ junior software engineering undergraduates, demystifying graph traversals, dynamic programming, and structured clean code patterns.',
    responsibilities: [
      'Authored structured interactive labs in Python and Java focusing on clean architecture and unit testing.',
      'Mentored students through algorithmic problem formulation and debugging sessions.'
    ],
    technologies: ['Python', 'Java', 'Data Structures', 'Algorithms'],
    published: true,
    displayOrder: 2
  }
];

export const initialCertifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'PostgreSQL Advanced Schema Design & Optimization',
    organization: 'PostgreSQL Professional Institute',
    issueDate: 'August 2026',
    credentialId: 'PG-ADV-904821',
    verificationUrl: 'https://verify.postgresql.org/cert/904821',
    description: 'Advanced credential in query planner tuning, partial B-Tree indexing, execution plan analysis, and high-concurrency ACID transactions.',
    skills: ['PostgreSQL', 'SQL', 'Query Optimization', 'ACID Transactions'],
    published: true,
    featured: true
  },
  {
    id: 'cert-2',
    title: 'Clean Architecture & Domain-Driven Design in .NET',
    organization: 'Microsoft Tech Community Learning',
    issueDate: 'May 2026',
    credentialId: 'MS-DDD-472091',
    verificationUrl: 'https://learn.microsoft.com/credentials/cert/472091',
    description: 'Covers hexagonal architectural boundaries, CQRS command pipelines, Entity Framework Core query projections, and decoupled persistence abstractions.',
    skills: ['ASP.NET Core', 'Clean Architecture', 'CQRS', 'C#'],
    published: true,
    featured: true
  },
  {
    id: 'cert-3',
    title: 'Modern React & TypeScript Software Patterns',
    organization: 'Frontend Masters Certification',
    issueDate: 'January 2026',
    credentialId: 'FM-RTS-318492',
    verificationUrl: 'https://frontendmasters.com/certificates/318492',
    description: 'Deep dive into discriminant union state machines, concurrent rendering ergonomics, and end-to-end type safety.',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    published: true,
    featured: false
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Technical Workshop Lead & Instructor',
    organization: 'Girls in Tech Community Chapter',
    role: 'Workshop Lead',
    type: 'Volunteering',
    date: '2025 — Present',
    description: 'Facilitating hands-on coding bootcamps introducing high school students and incoming university women to web development fundamentals and computational thinking.',
    externalUrl: 'https://girlsintech.org',
    published: true,
    featured: true
  },
  {
    id: 'act-2',
    title: 'National HackSprint 2026 Finalist',
    organization: 'National Tech Innovation Council',
    role: 'Team Lead & Backend Architect',
    type: 'Hackathon',
    date: 'July 2026',
    description: 'Architected a high-availability disaster emergency logistics routing prototype during a 36-hour sprint.',
    externalUrl: 'https://hacksprint.org',
    published: true,
    featured: true
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Dean\'s Honor List for Academic Excellence',
    category: 'Academic Honor',
    organization: 'Faculty of Computing & Information Technology',
    date: '2024, 2025, 2026',
    description: 'Awarded for maintaining a cumulative GPA of 3.86/4.00 across all core software engineering courses.',
    featured: true,
    published: true
  },
  {
    id: 'ach-2',
    title: 'Top 3 Finalist — National HackSprint 2026',
    category: 'Competitive Engineering',
    organization: 'National Tech Innovation Council',
    date: 'July 2026',
    description: 'Placed 3rd nationally among 120+ teams for designing an offline-capable emergency logistics dispatcher.',
    evidenceUrl: 'https://hacksprint.org/finalists-2026',
    featured: true,
    published: true
  }
];

export const initialLearningItems: LearningItem[] = [
  {
    id: 'learn-1',
    title: 'Distributed Consensus & Raft Protocol',
    type: 'Engineering Concept',
    description: 'Studying leader election invariants, log compaction, and building a mini Raft state machine in TypeScript.',
    status: 'In Progress',
    startedDate: 'August 2026',
    relatedProject: 'Independent Systems Lab',
    enabled: true,
    displayOrder: 1
  },
  {
    id: 'learn-2',
    title: 'Rust Memory Model & Concurrency Primitives',
    type: 'Technology',
    description: 'Exploring ownership lifetimes, thread synchronization, Arc/Mutex patterns, and zero-cost abstractions.',
    status: 'Deep Dive',
    startedDate: 'July 2026',
    relatedProject: 'Systems Programming',
    enabled: true,
    displayOrder: 2
  }
];

export const initialActivityFeed: ActivityFeedItem[] = [
  {
    id: 'feed-1',
    action: 'Portfolio Experience & Case Studies Updated',
    date: 'October 2026',
    type: 'portfolio',
    details: 'Completed comprehensive case study documentation for LabourLink and BiteGo.'
  },
  {
    id: 'feed-2',
    action: 'PostgreSQL Schema Design Certification Earned',
    date: 'August 2026',
    type: 'certification',
    details: 'Completed advanced qualification in indexing and transaction isolation.'
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'engineering-case-for-type-safe-contracts',
    title: 'The Engineering Case for End-to-End Type Contracts in Multi-Tier Web Systems',
    summary: 'Why runtime boundaries fail without compile-time invariant checking, and how shared TypeScript models bridge client-server communication with zero ambiguity.',
    content: `When systems scale past individual feature prototypes, the most frequent source of latent production bugs is not algorithmic failure, but data contract drift.\n\n### The Single-Source-of-Truth Pattern\n\nBy establishing strict discriminant union types and runtime schema validators, both layers negotiate invariants deterministically.\n\n\`\`\`typescript\nexport interface UserEntitlementPayload {\n  readonly userId: string;\n  readonly role: 'Administrator' | 'Supervisor' | 'Auditor';\n}\n\`\`\`\n\nEngineering software means reducing surprise. Strict typing is our strongest tool to keep surprise at zero.`,
    publishedAt: 'October 2, 2026',
    readingTime: '5 min read',
    tags: ['Architecture', 'TypeScript', 'Clean Code'],
    featured: true,
    published: true
  }
];

export const initialMediaItems: MediaItem[] = [
  {
    id: 'med-hero-1',
    filename: 'hero_profile_portrait.jpg',
    url: '/src/assets/images/hero_profile_portrait_1791050565075.jpg',
    type: 'profile',
    mimeType: 'image/jpeg',
    size: '142 KB',
    uploadDate: '2026-10-01',
    usedBy: 'Primary Profile Photo'
  },
  {
    id: 'med-proj-1',
    filename: 'project_labourlink_ui.jpg',
    url: '/src/assets/images/project_labourlink_ui_1791050578809.jpg',
    type: 'project',
    mimeType: 'image/jpeg',
    size: '215 KB',
    uploadDate: '2026-10-01',
    usedBy: 'LabourLink Cover'
  },
  {
    id: 'med-proj-2',
    filename: 'project_bitego_ui.jpg',
    url: '/src/assets/images/project_bitego_ui_1791050591976.jpg',
    type: 'project',
    mimeType: 'image/jpeg',
    size: '198 KB',
    uploadDate: '2026-10-01',
    usedBy: 'BiteGo Cover'
  },
  {
    id: 'med-proj-3',
    filename: 'project_pulsecare_ui.jpg',
    url: '/src/assets/images/project_pulsecare_ui_1791050604023.jpg',
    type: 'project',
    mimeType: 'image/jpeg',
    size: '184 KB',
    uploadDate: '2026-10-01',
    usedBy: 'PulseCare Cover'
  },
  {
    id: 'med-diag-1',
    filename: 'architecture_system_diagram.jpg',
    url: '/src/assets/images/architecture_system_diagram_1791050615669.jpg',
    type: 'project',
    mimeType: 'image/jpeg',
    size: '228 KB',
    uploadDate: '2026-10-01',
    usedBy: 'Architecture Case Studies'
  }
];

export const initialMessages = [
  {
    id: 'msg-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techhire.co',
    subject: 'Summer 2027 Software Engineering Internship Inquiry',
    message: 'Hello Nistha, I reviewed your LabourLink case study and was very impressed with your architectural discipline and CQRS breakdown. We would love to discuss our upcoming software engineering internship opportunities.',
    receivedAt: '2026-10-01 09:30',
    read: true
  }
];

export const initialJourney: JourneyMilestone[] = [
  {
    id: 'journey-1',
    date: '2023',
    title: 'Software Engineering Undergraduate',
    organization: 'Sabaragamuwa University of Sri Lanka',
    type: 'University',
    description: 'Enrolled in BSc (Hons) in Software Engineering, establishing rigorous foundations in discrete mathematics, data structures, algorithms, and typed systems.',
    published: true,
    displayOrder: 1
  },
  {
    id: 'journey-2',
    date: '2024',
    title: 'Software Development & Architecture',
    organization: 'Academic & Applied Projects',
    type: 'Experience',
    description: 'Specialized in object-oriented system design, relational database schemas, query optimization, and test-driven development methodologies.',
    published: true,
    displayOrder: 2
  },
  {
    id: 'journey-3',
    date: '2025',
    title: 'BiteGo',
    organization: 'Software Engineering Project',
    type: 'Projects',
    description: 'Engineered a scalable campus food ordering and delivery system with real-time state coordination, cart synchronization, and order lifecycle management.',
    relatedProject: 'BiteGo',
    published: true,
    displayOrder: 3
  },
  {
    id: 'journey-4',
    date: '2026',
    title: 'LabourLink',
    organization: 'Full-Stack Engineering Project',
    type: 'Projects',
    description: 'Designed and deployed an enterprise-grade migrant worker platform featuring secure biometric verification, role-based audit logs, and clean service architecture.',
    relatedProject: 'LabourLink',
    published: true,
    displayOrder: 4
  }
];

