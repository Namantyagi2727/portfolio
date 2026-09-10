export const personalInfo = {
  name: "Naman Tyagi",
  title: "AI/ML Engineer",
  roles: [
    "AI/ML Engineer",
    "Full-Stack Developer",
    "Cloud Architect",
    "Big Data Engineer",
  ],
  email: "namantyagi2727@gmail.com",
  phone: "+1 (929) 605-9520",
  location: "Brooklyn, NY",
  github: "https://github.com/Namantyagi2727",
  linkedin: "https://www.linkedin.com/in/naman-tyagi-nt2727",
  scholar: "https://scholar.google.com/citations?hl=en&user=JNOaY9YAAAAJ",
  bio: "AI/ML engineer with an MS in Computer Science from NYU Tandon building production LLM applications, RAG pipelines, and agentic AI systems. Published researcher with IEEE (2024), Wiley (2025), Cambridge Scholars Publishing (2025), and Human Behavior and Emerging Technologies (2026). 6+ internships across AI, cloud, and enterprise software — I bring ideas from research to production.",
};

export const awayFromKeyboard =
  "F1 on race weekends, badminton and tennis, the gym, chess, always hunting for a new restaurant, and planning the next trip.";

export type Experience = {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  tags: string[];
};

export const experiences: Experience[] = [
  {
    title: "Computer Vision Research",
    company: "NYU FAMS Lab",
    period: "Sep 2026 – Present",
    location: "Brooklyn, NY",
    description: [
      "Contributing to a real-time detection pipeline over a continuous endoscopic camera feed, as part of a Vertically Integrated Project.",
      "Developing and validating detection in a simulated renal environment — water and calcium-based model kidney stones — before any real-tissue application.",
    ],
    tags: ["Computer Vision", "PyTorch", "OpenCV"],
  },
  {
    title: "Software Engineer — Faculty Operations Platform",
    company: "NYU — Office of Faculty Affairs",
    period: "Jan 2026 – Aug 2026",
    location: "New York, NY",
    description: [
      "Leading system design for a cloud-integrated digital platform compatible with NYU Box, AWS S3, and Azure Blob Storage, serving 500+ faculty with automated records management, workflow orchestration, and an AI-powered FAQ chatbot.",
      "Deploying workflow automation pipelines using cloud-based orchestration (AWS, Azure Logic Apps) to digitize manual form processes with routing, compliance checks, and approval chain tracking.",
    ],
    tags: ["Full-Stack", "Cloud", "AWS", "Azure", "AI", "Workflow Automation", "Records Management"],
  },
  {
    title: "AI & Power BI Intern",
    company: "Mast-Jägermeister US, Inc.",
    period: "Jun 2025 – Aug 2025",
    location: "White Plains, NY",
    description: [
      "Designed and deployed a fully offline RAG-based AI chatbot using LangChain, vector embeddings, and semantic retrieval workflows, enabling secure knowledge access across 1,000+ enterprise documents for 50+ field team members.",
      "Built automated document ingestion and semantic indexing pipelines, reducing information retrieval time by ~70% compared to manual search.",
      "Enhanced NLP query interpretation in Power BI Q&A using custom semantic models; integrated Azure AI and Python NLP frameworks into production.",
    ],
    tags: ["AI", "RAG", "LangChain", "Power BI", "NLP", "Azure AI", "Python"],
  },
  {
    title: "AI Research Intern",
    company: "University of Essex",
    period: "Sep 2023 – Aug 2024",
    location: "Remote",
    description: [
      "Conducted NLP and sentiment analysis research for early BDD detection, achieving 12% F1-score improvement through transformer fine-tuning on ~10K annotated clinical text samples.",
      "Automated end-to-end text preprocessing, feature extraction, and model evaluation workflows, reducing experiment iteration time by ~40%.",
      "Published findings in IEEE Xplore (2024) via CNN-based sign language recognition project.",
    ],
    tags: ["NLP", "Transformers", "CNN", "Research", "IEEE Published"],
  },
  {
    title: "Global Technical Support Engineer",
    company: "Ciena",
    period: "Jan 2024 – Jun 2024",
    location: "Gurugram, India",
    description: [
      "Performed data-driven diagnostics on optical networks for 15+ global telecom clients (99.5% uptime SLAs); authored automation scripts reducing case resolution time by ~25%.",
      "Managed 50+ monthly escalations with cross-functional coordination across global support teams.",
    ],
    tags: ["Networking", "Automation", "Data Analysis"],
  },
  {
    title: "Salesforce Developer & Administrator",
    company: "Internship",
    period: "May 2023 – Dec 2023",
    location: "Remote",
    description: [
      "Automated CRM workflows with Flow Builder, reducing manual workload by 40% across 50+ users; built Lightning components, backend validation rules, and analytics dashboards.",
      "Developed Apex triggers to extend platform functionality and managed permission sets and data integrity.",
    ],
    tags: ["Salesforce", "Apex", "Lightning", "CRM", "Automation"],
  },
  {
    title: "Frontend Developer",
    company: "Ulavi Technologies PTE. Ltd",
    period: "Jan 2023 – Apr 2023",
    location: "Singapore (Remote)",
    description: [
      "Designed responsive frontends for travel platforms, improving user experience and performance by 15%.",
      "Collaborated in iterative feature rollout using Agile and version control best practices.",
    ],
    tags: ["Frontend", "JavaScript", "Responsive Design", "Agile"],
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  highlight?: string;
};

export const projects: Project[] = [
  {
    title: "RAGBase: Enterprise Document Q&A System",
    description:
      "Open-source offline RAG chatbot with semantic document search using FAISS vector indexing and LangChain retrieval chains, supporting PDF/DOCX ingestion across 1,000+ documents with sub-2-second latency. Modular pipeline with configurable embedding models, chunking strategies, and reranking.",
    tags: ["RAG", "LangChain", "FAISS", "Hugging Face", "Python", "Streamlit"],
    github: "https://github.com/Namantyagi2727/ragbase",
    highlight: "1,000+ docs · sub-2s retrieval",
  },
  {
    title: "ChainGuard",
    description:
      "LLM-based auditing tool detecting smart contract vulnerabilities (reentrancy, overflow, access control) with 85%+ accuracy across 100+ test contracts. Fine-tuned transformers for structured audit report generation.",
    tags: ["Solidity", "Ethereum", "Web3", "Security", "Python", "LLMs"],
    github: "https://github.com/Namantyagi2727/BlockGuard",
    highlight: "85%+ accuracy · 100+ test contracts",
  },
  {
    title: "Immune Cell Population Analysis",
    description:
      "Take-home assessment for Teiko — analysis pipeline and interactive dashboard for a clinical-trial immune cell population dataset. Converts per-sample cell counts to relative frequencies across 5 immune cell populations, statistically compares treatment responders vs. non-responders with FDR-corrected significance testing, and breaks down baseline cohorts by project, sex, and response. Reproducible SQLite-backed pipeline with a 15-test suite and a live dashboard.",
    tags: ["Take-Home Assessment", "Python", "Pandas", "SQLite", "Streamlit", "Statistics", "Bioinformatics"],
    github: "https://github.com/Namantyagi2727/teiko-cell-population-analysis",
    demo: "https://teiko-cell-population-analysis-dashboard.streamlit.app/",
    highlight: "656 samples analyzed",
  },
  {
    title: "ConTicx",
    description:
      "Take-home assessment for Juspay — a concert ticket booking prototype with a real payment integration against Hyperswitch's Unified Checkout sandbox. Server-side amount computation that never trusts client-submitted prices, Redis-backed atomic inventory holds with lazy expiry, and webhook-safe payment-intent cancellation to prevent overselling seats during the 10-minute checkout hold.",
    tags: ["Take-Home Assessment", "Next.js", "TypeScript", "Redis", "Payments", "Hyperswitch"],
    github: "https://github.com/Namantyagi2727/ConTicx",
    demo: "https://conticx.vercel.app",
    highlight: "Atomic oversell protection",
  },
  {
    title: "Sign Language Recognition",
    description:
      "CNN-based gesture-to-text translation system improving accessibility for the hearing-impaired. Enhanced spatial feature learning with skeleton-plotted image augmentation. Published in IEEE Xplore 2024.",
    tags: ["CNN", "Computer Vision", "Python", "OpenCV", "IEEE Published"],
    highlight: "IEEE Published 2024",
  },
  {
    title: "MindMend",
    description:
      "LLM-driven conversational therapy agent using GPT-4, NLP, and sentiment analysis. Analyzes emotional state during live interactions and implements sentiment scoring + trend tracking.",
    tags: ["LLMs", "GPT-4", "NLP", "Sentiment Analysis", "Python", "Streamlit"],
  },
  {
    title: "Photo Search & Recognition",
    description:
      "Automated face/object detection pipeline using AWS Rekognition with intelligent metadata tagging. Enables semantic queries for image search via REST APIs and event-driven inference.",
    tags: ["AWS Rekognition", "Lambda", "OpenSearch", "REST API", "Computer Vision"],
    github: "https://github.com/Namantyagi2727/Photo-Search-Project",
  },
  {
    title: "SmartScholar",
    description:
      "LLM-powered research paper summarizer and Q&A system. Ingests academic PDFs, generates structured summaries, and enables natural language querying over paper content via RAG.",
    tags: ["LLMs", "RAG", "NLP", "Python", "Streamlit"],
  },
  {
    title: "Smart Door Lock System",
    description:
      "Serverless IoT security system built on AWS. Uses Lambda, DynamoDB, API Gateway, and S3 for a fully managed, scalable smart lock with remote access control.",
    tags: ["AWS Lambda", "IoT", "DynamoDB", "API Gateway", "Serverless"],
  },
  {
    title: "DecentraStore",
    description:
      "Cloud + blockchain hybrid file storage and verification system. Files stored on cloud with cryptographic proofs anchored on Ethereum for tamper-proof verification.",
    tags: ["Blockchain", "Ethereum", "Cloud", "Solidity", "AWS"],
  },
  {
    title: "DiningBot on AWS",
    description:
      "Serverless dining recommendation chatbot built on AWS. Uses Lex for natural language understanding, Lambda for business logic, and DynamoDB to serve personalized restaurant suggestions.",
    tags: ["AWS Lex", "Lambda", "DynamoDB", "Serverless", "Chatbot"],
    github: "https://github.com/Namantyagi2727/DiningBot-on-AWS",
  },
];

export type Education = {
  degree: string;
  school: string;
  period: string;
  location: string;
  gpa?: string;
  courses?: string[];
  details?: string;
};

export const education: Education[] = [
  {
    degree: "Master of Science — Computer Science",
    school: "NYU Tandon School of Engineering",
    period: "Aug 2024 – May 2026",
    location: "Brooklyn, NY",
    courses: [
      "Machine Learning",
      "Big Data",
      "Computer Vision",
      "Design & Analysis of Algorithms",
      "Principles of Database Systems",
      "Application Security",
      "Visualization for Machine Learning",
      "Intro to Blockchain & DLT",
      "Cloud Computing",
      "Cyber Resiliency Management — AI Governance",
    ],
  },
  {
    degree: "B.Tech — Computer Science & Engineering (Hons. in AI & ML)",
    school: "Amity University Noida",
    period: "Jul 2020 – Jun 2024",
    location: "Noida, India",
    details: "First Division with Distinction · Exchange programs at Birkbeck University London & Adelphi University NY",
    courses: [
      "Introduction to AI & Machine Learning",
      "Deep Learning & Neural Networks",
      "Fundamentals of Machine Learning",
      "Artificial Intelligence",
      "Advances in Artificial Intelligence",
      "Applied Artificial Intelligence",
      "Data Mining & Business Intelligence",
      "Python for Data Science",
      "Cloud Computing Practitioner",
      "Data Structures using C",
      "Analysis & Design of Algorithms",
      "Object Oriented Programming (C++)",
      "Database Management Systems",
      "Cyber Security",
      "Software Engineering",
      "Theory of Computation",
    ],
  },
];

export type Publication = {
  type: "book" | "journal" | "conference";
  title: string;
  publisher: string;
  date: string;
  description: string;
  url?: string;
  highlight?: string;
  authors?: string;
  doi?: string;
};

export const publications: Publication[] = [
  {
    type: "journal",
    title: "A Pilot Study of a Gamified CBT-Based Digital Approach for Body Image Distress and Appearance-Related Concerns",
    publisher: "Human Behavior and Emerging Technologies (Wiley/Hindawi)",
    date: "Published July 2026",
    description:
      "Co-developed a pilot-scale serious game integrating CBT techniques with AI-driven analysis to support body image distress and appearance-related concerns. The AI model interpreting user input reached 97.15% accuracy on held-out test data, outperforming a BERT-based baseline, with preliminary results pointing to gamified digital interventions as a scalable, accessible complement to traditional CBT.",
    url: "https://doi.org/10.1155/hbe2/8902875",
    highlight: "97.15% Model Accuracy",
    authors: "Anushka Singh (Amity) · Naman Tyagi (Amity) · Fahad Eqbal (Amity) · Dolly Sharma (Amity) · Aikaterini Bourazeri (Essex, Corresponding Author)",
    doi: "10.1155/hbe2/8902875",
  },
  {
    type: "book",
    title: "Decentralized Smart Cities: Enhancing Urban Living Through IoT, Metaverse, and Blockchain Integration",
    publisher: "Cambridge Scholars Publishing — Next Generation Healthcare: Deep Learning and Blockchain for Precision Clinical Decision-Making",
    date: "December 23, 2025",
    description:
      "Authored chapter investigating the collaborative integration of Blockchain, the Metaverse, and IoT toward decentralized smart urban ecosystems. Explores resource optimization, citizen experience, security, and sustainability — with focus on data privacy via blockchain and real-time urban service management via IoT.",
    url: "https://www.cambridgescholars.com/product/978-1-0364-6498-1/",
    highlight: "Cambridge Scholars Publishing",
    authors: "Naman Tyagi (NYU) · Anushka Singh (Johns Hopkins) · Fahad Eqbal Hashmi · Dolly Sharma (Amity)",
  },
  {
    type: "book",
    title: "Case Study on Ethical AI-Based Decision-Making in E-Commerce Industrial Sector: Insights on McDonald's and Deliveroo",
    publisher: "Wiley — Ethical Decision-Making Using Artificial Intelligence: Challenges, Solutions and Applications (Chapter 12)",
    date: "July 11, 2025",
    description:
      "Explored real-world implementation of AutoML principles at McDonald's, which optimizes food menus based on user preferences, and Deliveroo, which improved delivery times and service quality through AutoML. Examined AutoML's impact on business workflows alongside the ethical considerations organizations should weigh when adopting it.",
    url: "https://doi.org/10.1002/9781394275311.ch12",
    authors: "Anushka Singh · Naman Tyagi · Dolly Sharma",
    doi: "10.1002/9781394275311.ch12",
  },
  {
    type: "conference",
    title: "Impact of Colour Image and Skeleton Plotting on Sign Language Recognition Using Convolutional Neural Networks (CNN)",
    publisher: "IEEE Xplore — 2024 14th International Conference on Cloud Computing, Data Science & Engineering (Confluence)",
    date: "January 2024",
    description:
      "Introduced a CNN-based model for American Sign Language recognition achieving ~99% accuracy using color + skeleton-mapped image datasets. Demonstrated significant impact of preprocessing strategy on model accuracy across varied backgrounds.",
    url: "https://ieeexplore.ieee.org/document/10463239",
    highlight: "8 Citations · 183 Views",
    authors: "Anushka Singh · Fahad Eqbal Hashmi · Naman Tyagi · Anant Kumar Jayswal",
    doi: "10.1109/Confluence60223.2024.10463239",
  },
];

export type Certification = {
  name: string;
  issuer: string;
  category: string;
};

export const certifications: Certification[] = [
  { name: "Google Cybersecurity Program Certificate", issuer: "Google", category: "Security" },
  { name: "Big Data & Machine Learning Fundamentals", issuer: "Google Cloud / Coursera", category: "Cloud" },
  { name: "AWS Cloud Completion Badge", issuer: "Amazon Web Services", category: "Cloud" },
  { name: "GCP Cloud Completion Badge", issuer: "Google Cloud", category: "Cloud" },
  { name: "Azure Cloud Completion Badge", issuer: "Microsoft Azure", category: "Cloud" },
  { name: "Salesforce Administrator & Developer", issuer: "Salesforce", category: "Platform" },
];

export type Metric = {
  value: string;
  label: string;
};

export type Figure = {
  id: string; // "FIG. 01"
  caption: string;
  kind: "screenshot" | "diagram" | "placeholder";
  src?: string; // present when kind is "screenshot"
};

export type CaseStudy = {
  slug: string;
  caseNumber: string; // "001"
  category: string; // "AI Infrastructure"
  year: string;
  title: string;
  problem: string; // one-sentence problem statement
  description: string;
  metrics?: Metric[]; // absent when nothing is verified yet (e.g. ongoing research)
  stack: string[];
  figures?: Figure[];
  links: { label: string; href: string; external?: boolean }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "prism",
    caseNumber: "001",
    category: "AI Infrastructure",
    year: "2026",
    title: "Prism",
    problem:
      "Teams that scale past calling a provider directly from the app run into unpredictable cost, no visibility into failures, PII/prompt-injection exposure, and no resilience when a provider degrades — usually all at once.",
    description:
      "Prism is a self-hosted LLM gateway and control plane that sits between applications and providers — OpenAI, Anthropic, self-hosted Ollama. A one-line base_url swap, no other code changes. It adds cost visibility, automatic failover through a hand-rolled circuit breaker, PII and prompt-injection guardrails, exact-match caching, and full observability, backed by Postgres with pgvector, Redis, and Prometheus/Grafana/Jaeger.",
    metrics: [
      {
        value: "245–259 req/s",
        label: "combined throughput · 0% unintended errors — main load test",
      },
      {
        value: "p50 ~25ms / p95 ~80ms",
        label: "gateway overhead isolated from provider latency — 10 concurrent users",
      },
      {
        value: "p50 ~130 / p95 ~250 / p99 ~340ms",
        label: "gateway overhead at 50 concurrent users — the <50ms p95 target holds at low concurrency and is exceeded here, which is what a load test is for",
      },
      {
        value: "0.00%",
        label: "fast-model failure rate during a simulated total Ollama outage — 1 stray timeout in 31,488 requests",
      },
      {
        value: "~20% / ~9.9%",
        label: "cache hit rate / guardrail block rate — matches the load test's 10% PII-triggering traffic mix",
      },
    ],
    stack: [
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "Prometheus",
      "Grafana",
      "Jaeger",
      "Ollama",
      "Docker Compose",
    ],
    figures: [
      {
        id: "FIG. 01",
        caption: "Request flow — auth, guardrails, cache, provider routing with fallback",
        kind: "diagram",
      },
      {
        id: "FIG. 02",
        caption: "Infrastructure topology — docker-compose services and the host-run Ollama process",
        kind: "diagram",
      },
      {
        id: "FIG. 03",
        caption: "Admin dashboard — Overview tab",
        kind: "screenshot",
        src: "/case-studies/prism/dashboard-overview.png",
      },
      {
        id: "FIG. 04",
        caption: "Admin dashboard — Cost & Teams tab",
        kind: "screenshot",
        src: "/case-studies/prism/dashboard-cost.png",
      },
      {
        id: "FIG. 05",
        caption: "Admin dashboard — Performance tab",
        kind: "screenshot",
        src: "/case-studies/prism/dashboard-performance.png",
      },
      {
        id: "FIG. 06",
        caption: "Admin dashboard — Safety tab",
        kind: "screenshot",
        src: "/case-studies/prism/dashboard-safety.png",
      },
      {
        id: "FIG. 07",
        caption: "Grafana operational dashboard",
        kind: "screenshot",
        src: "/case-studies/prism/grafana.png",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Namantyagi2727/prism", external: true },
      { label: "Project page", href: "https://namantyagi2727.github.io/prism/", external: true },
    ],
  },
  {
    slug: "medical-cv",
    caseNumber: "002",
    category: "Applied Research",
    year: "2026",
    title: "Endoscopic Stone Detection",
    problem:
      "Endoscopic procedures produce a continuous camera feed with no automated way to flag stone material in real time — detection still depends entirely on the surgeon's eye.",
    description:
      "Ongoing computer vision research at NYU's FAMS Lab, contributing to a real-time detection pipeline over a continuous endoscopic camera feed inside a simulated renal environment — water and calcium-based model kidney stones standing in for real tissue and stone material during development, as part of the lab's Vertically Integrated Project.",
    stack: ["PyTorch", "OpenCV", "Computer Vision"],
    figures: [
      { id: "FIG. 08A", caption: "Raw endoscopic feed", kind: "placeholder" },
      { id: "FIG. 08B", caption: "Detection overlay", kind: "placeholder" },
      { id: "FIG. 08C", caption: "Segmentation mask", kind: "placeholder" },
    ],
    links: [],
  },
  {
    slug: "faculty-ops",
    caseNumber: "003",
    category: "Software Systems",
    year: "2026",
    title: "Faculty Operations Platform",
    problem:
      "500+ NYU faculty ran records management, workflow routing, and approvals through manual, form-based processes with no shared system of record.",
    description:
      "A cloud-integrated Django platform replacing manual faculty-affairs paperwork with structured workflows, approval-chain tracking, and an AI-powered FAQ chatbot — compatible with NYU Box, AWS S3, and Azure Blob Storage. Twelve Django apps split by domain, covering the core platform, workflow engine, approvals, notifications, document storage, audit trail, chatbot, workload tracking, data export, tenure and promotion, faculty records, and access management.",
    metrics: [
      { value: "12", label: "Django apps, split by domain — see module map" },
      { value: "306", label: "automated tests" },
      { value: "29", label: "test files" },
    ],
    stack: ["Django", "PostgreSQL", "AWS S3", "Azure Blob Storage", "Azure Logic Apps"],
    figures: [
      { id: "FIG. 09", caption: "Module map — the 12 Django apps that make up the platform", kind: "diagram" },
    ],
    links: [],
  },
  {
    slug: "airspace",
    caseNumber: "004",
    category: "Data Systems",
    year: "2026",
    title: "Airspace Congestion Monitoring",
    problem:
      "Airspace congestion has to be understood while it's happening, not after the fact — which means ingesting live flight telemetry and scoring risk in-stream, not in a nightly batch job.",
    description:
      "A streaming pipeline that ingests flight telemetry from the OpenSky API (plus historical replay) into three Kafka topics — flight-stream, flight-metrics, flight-aggregates — processes it in Spark Structured Streaming for risk scoring, anomaly detection, and spatial grid aggregation over 30-second tumbling / 10-second sliding windows, and fans results out to InfluxDB for real-time queries, MongoDB for historical lookups, and HDFS for batch archival, visualized in a live Streamlit dashboard.",
    metrics: [
      {
        value: "475,000+ records",
        label:
          "generated historical dataset modeling realistic OpenSky-shaped traffic, used for testing at volume — live ingestion pulls the real OpenSky API",
      },
      {
        value: "30s / 10s",
        label: "tumbling window / sliding interval — Spark Structured Streaming risk scoring and anomaly detection",
      },
    ],
    stack: ["Apache Spark", "Kafka", "InfluxDB", "MongoDB", "HDFS", "Streamlit", "Python"],
    figures: [
      { id: "FIG. 10", caption: "Stream processing architecture — OpenSky ingestion to Streamlit", kind: "diagram" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Namantyagi2727/airspace-congestion-monitoring", external: true },
    ],
  },
];

export const hero = {
  metaTop: ["N / 2026", "BROOKLYN, NEW YORK"],
  statement: ["I build AI systems", "that operate on", "real-world data."],
  supporting:
    "Software engineer working across AI infrastructure, computer vision, and data-intensive systems.",
  metaSecondary: ["MS Computer Science · NYU Tandon", "New York"],
  now: {
    label: "NOW",
    title: "Computer Vision Research",
    detail: "NYU FAMS Lab",
  },
  recently: {
    label: "RECENTLY",
    title: "Built Prism",
    detail: "LLM Gateway & Control Plane",
  },
};
