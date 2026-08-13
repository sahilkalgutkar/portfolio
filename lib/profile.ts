export type ExperienceEntry = {
  role: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
  tech: string[];
};

export type EducationEntry = {
  degree: string;
  school: string;
  start: string;
  end: string;
};

export const profile = {
  name: "Sahil Kalgutkar",
  title: "Software Engineer",
  location: "Boston, MA",
  email: "sahilkal717@gmail.com",
  github: "https://github.com/sahilkalgutkar",
  linkedin: "https://linkedin.com/in/kalgutkarsahil",
  photo: "/images/avatar.jpg",
  resume: "/Sahil-Kalgutkar-Resume.pdf",
};

// Directly countable from the data below — not invented.
export const stats: { value: string; label: string }[] = [
  { value: "5+", label: "Years Experience" },
  { value: "4", label: "Engineering Roles" },
  { value: "3", label: "Certifications" },
  { value: "2", label: "Degrees Earned" },
];

export type CoreSkill = {
  name: string;
  tier: "Expert" | "Advanced" | "Proficient";
  years: string;
};

// Tiers are self-assessed, derived from how many roles/projects each
// technology shows up in below (see `experience` and lib/projects.ts) —
// not a precise measurement, just a relative signal like any resume's
// skills section.
export const coreSkills: CoreSkill[] = [
  { name: "Java", tier: "Expert", years: "5+ yrs" },
  { name: "Python", tier: "Expert", years: "5+ yrs" },
  { name: "AWS", tier: "Expert", years: "4+ yrs" },
  { name: "Spring Boot", tier: "Advanced", years: "3+ yrs" },
  { name: "Kubernetes", tier: "Advanced", years: "3+ yrs" },
  { name: "Docker", tier: "Advanced", years: "3+ yrs" },
  { name: "PostgreSQL", tier: "Advanced", years: "3+ yrs" },
  { name: "React / TypeScript", tier: "Advanced", years: "2+ yrs" },
  { name: "Go", tier: "Proficient", years: "1+ yr" },
  { name: "PyTorch", tier: "Proficient", years: "<1 yr" },
];

const TIER_FILL: Record<CoreSkill["tier"], number> = {
  Expert: 95,
  Advanced: 80,
  Proficient: 60,
};

export function tierFill(tier: CoreSkill["tier"]): number {
  return TIER_FILL[tier];
}

export const summary: string[] = [
  "Software engineer with 5+ years designing, building, and testing scalable, cloud-native backend services and platform tools used by internal teams and end customers.",
  "I own features end-to-end — clarifying ambiguous requirements, designing solutions, implementing, testing, and operating in production — while partnering with Product, Compliance, and cross-functional stakeholders.",
  "Track record of migrating legacy systems into resilient microservices, conducting code reviews, and driving automated test coverage, coding standards, and operational best practices across teams.",
  "Hands-on with AWS and modern cloud-native tooling — Kubernetes, Docker, Kafka — across microservices and distributed systems delivered to production customers.",
];

export const skillGroups: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Java", "Python", "Go", "C#", "JavaScript", "TypeScript"] },
  {
    label: "Frameworks & Platform",
    items: [
      "Spring Boot",
      "Django",
      "Flask",
      "Node.js",
      "NestJS",
      "React",
      ".NET Core",
      "Kubernetes",
      "Docker",
      "Kafka",
      "RabbitMQ",
      "ELK Stack",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    label: "Software Development",
    items: [
      "OOP",
      "RESTful API Design",
      "gRPC",
      "Microservices Architecture",
      "Data Modeling",
      "Design Patterns",
      "ORM",
      "SOA",
      "Strangler Fig Pattern",
      "Event-Driven Architecture",
    ],
  },
  { label: "Databases", items: ["SQL", "NoSQL", "PostgreSQL", "MySQL", "MongoDB", "Cassandra", "DynamoDB", "Redis"] },
  {
    label: "Cloud & DevOps",
    items: [
      "AWS (EC2, EKS, RDS, S3, Lambda)",
      "Azure",
      "GCP",
      "CI/CD",
      "IaC",
      "GitOps",
      "Observability",
      "Containerization",
      "Orchestration",
    ],
  },
  {
    label: "AI / Data Tooling",
    items: ["Elasticsearch", "PyTorch", "Hugging Face Transformers", "Pandas", "NumPy", "Data Pipeline Design"],
  },
  { label: "Collaboration", items: ["Jira", "Confluence", "Git", "GitHub", "GitLab", "Bitbucket", "Agile/Scrum"] },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineer",
    company: "Ascensus",
    start: "Mar 2024",
    end: "Present",
    bullets: [
      "Architect and build distributed, cloud-native backend services for the Identity & Trust Platform, clarifying ambiguous requirements and partnering with product stakeholders to define the technical roadmap.",
      "Design the data models and scalable APIs serving as the single system of record for customers, entities, and users across the platform.",
      "Lead migration of identity and customer-lifecycle logic from legacy systems into resilient, observable, platform-first microservices.",
      "Build core platform capabilities including a unified entitlements layer and shared compliance-context components.",
      "Partner with Product, Compliance, and engineering teams to standardize integration patterns and service contracts, communicating design decisions to both technical and non-technical stakeholders.",
      "Conduct code reviews and mentor junior engineers, driving test coverage and operational best practices across the team.",
    ],
    tech: ["Java", "Spring Boot", "Python", "REST", "gRPC", "AWS", "Kafka", "Kubernetes", "Docker", "PostgreSQL", "JUnit", "Jenkins"],
  },
  {
    role: "Software Engineer Intern, AI/ML",
    company: "Guidepoint",
    start: "Oct 2023",
    end: "Jan 2024",
    bullets: [
      "Built an AI-based matching system (PyTorch, CUDA) to improve client–advisor pairings, applying Hugging Face Transformers for NLP — improving match relevance 25% and reaching 90% accuracy.",
      "Built large-scale data preprocessing pipelines (Pandas, NumPy) to prepare high-quality training data for model development, cutting processing time 30%.",
      "Used Elasticsearch (built on Apache Lucene) for large-scale data indexing and retrieval to support real-time matching.",
      "Containerized and deployed services with Docker and Kubernetes in a distributed environment, improving scalability 50%.",
      "Built CI/CD pipelines (Bitbucket) for continuous integration and delivery.",
    ],
    tech: ["PyTorch", "CUDA", "Hugging Face Transformers", "Elasticsearch", "Pandas", "NumPy", "Docker", "Kubernetes"],
  },
  {
    role: "Software Engineer",
    company: "Wells Fargo",
    start: "Apr 2021",
    end: "Aug 2022",
    bullets: [
      "Designed and built backend services for financial applications successfully delivered to production, focused on high availability and scalable microservices in a regulated enterprise environment.",
      "Implemented REST API endpoints with clear, consistent service contracts for internal and external integrations.",
      "Refactored legacy codebase components into cloud-native architectures, reducing technical debt and improving maintainability.",
      "Built data-processing and security components meeting compliance and security standards.",
      "Championed code reviews and automated testing practices, measuring test coverage and improving diagnostics; mentored junior engineers.",
    ],
    tech: ["Java", "Spring Framework", "Python", "SQL", "Oracle", "AWS", "Docker", "Kubernetes", "Jenkins", "JUnit"],
  },
  {
    role: "Software Engineer, Production Support",
    company: "Infosys",
    start: "Aug 2019",
    end: "Mar 2021",
    bullets: [
      "Diagnosed and resolved production incidents and performance bottlenecks for key business applications, minimizing service disruption.",
      "Partnered with development teams to build permanent fixes for recurring issues and authored troubleshooting/runbook documentation for technical and non-technical audiences.",
      "Conducted root cause analysis and monitored system performance to proactively prevent future incidents.",
      "Supported deployment of application patches and new components; managed support tickets against SLAs.",
    ],
    tech: ["Java", "J2EE", "SQL", "MySQL", "Shell Scripting", "Linux", "Oracle", "Control-M", "Nagios"],
  },
];

export const education: EducationEntry[] = [
  {
    degree: "M.S., Computer Science",
    school: "University of Massachusetts, Boston",
    start: "Sep 2022",
    end: "May 2024",
  },
  {
    degree: "B.E., Computer Engineering",
    school: "University of Mumbai",
    start: "Aug 2017",
    end: "Jun 2021",
  },
];

export const certifications: string[] = [
  "AWS Certified Solutions Architect – Associate",
  "Certified Kubernetes Application Developer (CKAD)",
  "Oracle Certified Professional, Java SE Programmer",
];
