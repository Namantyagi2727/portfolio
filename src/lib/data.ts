export const personalInfo = {
  name: "Naman Tyagi",
  // Matches the LinkedIn headline: broad software engineering first, with
  // applied AI, LLM systems, computer vision, and cloud as the focus areas.
  title: "Software Engineer",
  headline: "Software Engineer | Applied AI & Machine Learning | LLM Systems, Computer Vision & Cloud",
  roles: ["Software Engineer", "Applied AI / ML", "LLM Systems", "Computer Vision", "Cloud"],
  email: "namantyagi2727@gmail.com",
  phone: "+1 (929) 605-9520",
  location: "Brooklyn, NY",
  github: "https://github.com/Namantyagi2727",
  linkedin: "https://www.linkedin.com/in/naman-tyagi-nt2727",
  scholar: "https://scholar.google.com/citations?hl=en&user=JNOaY9YAAAAJ",
  bio: "Software engineer and NYU Tandon MS Computer Science graduate (May 2026) working across applied AI and machine learning, LLM systems, computer vision, and cloud. Experience spans Django and FastAPI services, RAG applications, data pipelines, and real-time computer vision research; publications include a journal article, an IEEE conference paper, and two book chapters.",
  // Shorter, warmer opening for the About section specifically — same
  // verified facts as `bio` above (used for SEO/OG metadata elsewhere),
  // condensed rather than reworded into anything new.
  shortBio:
    "I'm a software engineer working across applied AI, LLM systems, computer vision, and cloud — from Django and FastAPI services and RAG applications to real-time computer vision research. I completed my MS in Computer Science at NYU Tandon in May 2026.",
  photo: undefined as string | undefined,
};

export const awayFromKeyboard =
  "Badminton and tennis, chess, always hunting for a new restaurant, and planning the next trip.";

export type Experience = {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  tags: string[];
  // Internal case-study route that goes deeper on this role, when one exists.
  caseStudy?: { href: string; label: string };
};

export const experiences: Experience[] = [
  {
    title: "Computer Vision Researcher",
    company: "FAMS Lab, NYU Tandon",
    period: "Sep 2025 – Present",
    location: "Brooklyn, NY",
    description: [
      "Ongoing academic research at the Flexible AI-Enabled Mechatronic Systems Lab: developing a real-time pipeline that detects and localizes kidney stones in microscopic-camera video, covering image/video preprocessing, model development and evaluation, and live-stream inference.",
      "Earlier lab work on endoscopic image analysis: YOLOv5 object detection, U-Net segmentation, and visualization in 3D Slicer.",
      "Involved through NYU's Vertically Integrated Projects program since Fall 2025; Volunteer Research Assistant since September 2026.",
    ],
    tags: ["Computer Vision", "PyTorch", "OpenCV", "YOLOv5", "U-Net", "3D Slicer"],
    caseStudy: { href: "/work/medical-cv", label: "Research notes" },
  },
  {
    title: "Software Engineer",
    company: "NYU Office of Faculty Affairs",
    period: "Jan 2026 – Aug 2026",
    location: "New York, NY",
    description: [
      "Developed Django REST Framework APIs and PostgreSQL-backed workflows on a team-built platform supporting faculty operations for 500+ faculty.",
      "Automated administrative workflows with Celery Beat scheduling, including approval and escalation logic.",
      "Built an Excel data importer validated against 20 test cases, and wrote integration tests that surfaced 3 pre-release defects.",
      "Developed AI-powered document classification across AWS S3 and Azure Blob Storage, reducing manual record lookup time by an estimated 60%.",
      "Built a LangChain/FAISS RAG chatbot for natural-language search of faculty policy information.",
    ],
    tags: ["Django REST Framework", "PostgreSQL", "Celery", "LangChain", "FAISS", "AWS S3", "Azure Blob Storage"],
    caseStudy: { href: "/work/faculty-ops", label: "Platform case study" },
  },
  {
    // Official designation: "AI and Power BI Intern". This is the
    // public-facing functional title, matching LinkedIn.
    title: "Software Engineer Intern (AI & Power BI)",
    company: "Mast-Jägermeister US, Inc.",
    period: "Jun 2025 – Aug 2025",
    location: "White Plains, NY",
    description: [
      "Developed an Azure-connected RAG application with LangChain and FAISS, letting 50+ internal staff search 1,000+ enterprise documents and reducing information retrieval time by approximately 70%.",
      "Automated document ingestion, embedding generation, and semantic indexing to keep the knowledge base current.",
      "Built Power BI Q&A semantic models supporting natural-language queries and self-service analytics.",
    ],
    tags: ["RAG", "LangChain", "FAISS", "Azure", "Power BI", "Python"],
  },
  {
    title: "Artificial Intelligence Researcher (Part-time)",
    company: "University of Essex",
    period: "Sep 2023 – Aug 2024",
    location: "Remote, UK",
    description: [
      "Transformer-based NLP research on early detection of body dysmorphic disorder: text classification, named entity recognition, and topic analysis over ~10,000 annotated samples.",
      "Findings were published in Human Behavior and Emerging Technologies (2026).",
    ],
    tags: ["NLP", "Transformers", "Text Classification", "NER", "Research"],
  },
  {
    title: "Global Technical Support Engineer",
    company: "Ciena",
    period: "Jan 2024 – Jun 2024",
    location: "Gurugram, India",
    description: [
      "Troubleshot optical and packet-network issues for global enterprise and telecom customers using logs, packet captures, and CLI diagnostics, handling 50+ escalations a month across 15+ clients.",
      "Wrote automation scripts and technical documentation that cut case resolution time by approximately 25%.",
    ],
    tags: ["Networking", "Troubleshooting", "Automation", "Technical Documentation"],
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
      "Built a responsive travel website from UI/UX designs in HTML, CSS, and JavaScript, with cross-browser testing.",
      "Collaborated in iterative feature rollout using Agile and version control best practices.",
    ],
    tags: ["Frontend", "JavaScript", "Responsive Design", "Agile"],
  },
];

// Featured projects shown in the Selected Work gallery next to Prism (which
// has its own full case study under `caseStudies`). Every claim here is
// taken from the project's own README/BENCHMARKS file — benchmark numbers
// carry their test conditions in the label, never on their own.
export type FeaturedProject = {
  slug: "ragbase" | "conticx" | "immune";
  title: string;
  category: string;
  date: string;
  context?: string; // how/why it was built, e.g. a take-home assessment
  summary: string;
  // Cover diagram stages, in order — the project's real architecture as
  // described in its README, not decoration.
  pipeline: string[];
  metrics: Metric[];
  stack: string[];
  github: string;
  demo?: string;
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "ragbase",
    title: "RAGBase",
    category: "Applied AI",
    date: "Apr 2026 · updated Sep 2026",
    summary:
      "Fully local document Q&A: ingests PDFs, Word files, spreadsheets, and images (with OCR), retrieves with hybrid FAISS semantic and TF-IDF keyword search, reranks with a cross-encoder, and answers through a local Ollama model, with source citations on every answer.",
    pipeline: [
      "PDF · DOCX · XLSX · CSV · images",
      "OCR + chunking",
      "FAISS + TF-IDF hybrid search",
      "Cross-encoder rerank",
      "Local LLM (Ollama)",
      "Answer + citations",
    ],
    metrics: [
      {
        value: "~17 ms median",
        label:
          "hybrid retrieval + reranking over a generated 1,200-file / 4,750-chunk corpus — local benchmark on one machine; the OCR path wasn't part of it",
      },
      {
        value: "~0.4 s median",
        label: "end-to-end answer including local llama3.2 generation, same local benchmark",
      },
    ],
    stack: ["Python", "LangChain", "FAISS", "TF-IDF", "Hugging Face", "Ollama", "Streamlit"],
    github: "https://github.com/Namantyagi2727/ragbase",
  },
  {
    slug: "conticx",
    title: "ConTicx",
    category: "Full-Stack",
    date: "Aug 2026",
    context: "Built for a Juspay take-home",
    summary:
      "Event discovery and ticket booking with 10-minute Redis inventory holds, server-side pricing the client can't override, and checkout, webhooks, and refunds integrated against Hyperswitch's sandbox — test payments only, not live commercial processing.",
    pipeline: [
      "Pick event + tier",
      "Server-side pricing",
      "Atomic Redis hold (10 min)",
      "Hyperswitch checkout (sandbox)",
      "Webhook + status reconcile",
      "Ticket · refund",
    ],
    metrics: [
      {
        value: "15 → 10",
        label: "concurrent requests vs. tickets left in the spike test — exactly 10 orders succeed, no oversell",
      },
      {
        value: "10 min",
        label: "inventory hold per order, expired lazily with payment-intent cancellation first",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Redis", "Hyperswitch", "Vercel"],
    github: "https://github.com/Namantyagi2727/ConTicx",
    demo: "https://conticx.vercel.app",
  },
  {
    slug: "immune",
    title: "Immune Cell Population Analysis",
    category: "Data & Analysis",
    date: "Aug 2026",
    context: "Built for a Teiko take-home",
    summary:
      "A reproducible pipeline and dashboard for the cell-count dataset supplied with the assignment (framed as a clinical-trial scenario): a normalized SQLite schema, per-sample relative frequencies across five immune-cell populations, and responder vs. non-responder statistics reported with effect sizes.",
    pipeline: [
      "cell-count.csv",
      "Normalized SQLite schema",
      "Relative frequencies",
      "Mann-Whitney U + BH-FDR",
      "Streamlit dashboard",
    ],
    metrics: [
      {
        value: "15 tests",
        label: "pytest suite run by GitHub Actions CI on every push and pull request",
      },
      {
        value: "0 of 5",
        label: "populations significant after FDR correction — reported as a null result, with effect sizes",
      },
    ],
    stack: ["Python", "SQLite", "pandas", "Streamlit", "pytest", "GitHub Actions"],
    github: "https://github.com/Namantyagi2727/teiko-cell-population-analysis",
    demo: "https://teiko-cell-population-analysis-dashboard.streamlit.app/",
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  caseStudy?: string; // internal route, e.g. "/work/airspace"
  highlight?: string;
};

// Compact index under the featured gallery. OtherProjects always shows the
// entries with a public repo, demo, or case study; the rest stay collapsed
// behind "Show more" rather than being removed.
export const projects: Project[] = [
  {
    title: "Airspace Congestion Monitoring",
    description:
      "Real-time flight-congestion pipeline: Kafka ingestion and Spark Structured Streaming risk scoring over live OpenSky data and a ~475,000-record generated historical dataset, with InfluxDB, MongoDB, and a Streamlit dashboard.",
    tags: ["Kafka", "Spark Structured Streaming", "InfluxDB", "MongoDB", "Streamlit", "Python"],
    github: "https://github.com/Namantyagi2727/airspace-congestion-monitoring",
    caseStudy: "/work/airspace",
    highlight: "May 2025",
  },
  {
    title: "BlockGuard",
    description:
      "Streamlit tool that runs Slither static analysis on Solidity contracts, ranks findings by severity, and summarizes each in plain language with a local FLAN-T5 model; a second tab forecasts next-block Ethereum base fees with a small PyTorch GRU.",
    tags: ["Solidity", "Slither", "Python", "PyTorch", "Hugging Face Transformers", "Streamlit"],
    github: "https://github.com/Namantyagi2727/BlockGuard",
  },
  {
    title: "Photo Search & Recognition",
    description:
      "Serverless photo search on AWS: S3 uploads trigger a Lambda that labels images with Rekognition and indexes them in OpenSearch; natural-language queries are parsed with Lex and served through API Gateway, with infrastructure in CloudFormation.",
    tags: ["AWS Lambda", "Rekognition", "OpenSearch", "Lex", "API Gateway", "CloudFormation"],
    github: "https://github.com/Namantyagi2727/Photo-Search-Project",
  },
  {
    title: "Sign Language Recognition",
    description:
      "CNN-based gesture-to-text translation system improving accessibility for the hearing-impaired. Enhanced spatial feature learning with skeleton-plotted image augmentation. Published in IEEE Xplore 2024.",
    tags: ["CNN", "Computer Vision", "Python", "OpenCV", "IEEE Published"],
    highlight: "IEEE Published 2024",
  },
  {
    title: "DiningBot on AWS",
    description:
      "Serverless dining-concierge chatbot on AWS: Lex for conversation, Lambda for business logic, and restaurant data scraped from Yelp into DynamoDB and Elasticsearch, served through API Gateway.",
    tags: ["AWS Lex", "Lambda", "DynamoDB", "Elasticsearch", "Serverless", "Chatbot"],
    github: "https://github.com/Namantyagi2727/DiningBot-on-AWS",
  },
  {
    title: "MindMend",
    description:
      "LLM-driven conversational therapy agent using GPT-4, NLP, and sentiment analysis. Analyzes emotional state during live interactions and implements sentiment scoring + trend tracking.",
    tags: ["LLMs", "GPT-4", "NLP", "Sentiment Analysis", "Python", "Streamlit"],
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
  highlighted?: boolean;
};

// 1 journal article, 1 IEEE conference paper, 2 book chapters — four
// publications, not "four research papers". Research.tsx groups papers
// and book chapters separately; keep `type` accurate. Ordered newest first
// within each group.
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
    highlighted: true,
  },
  {
    type: "conference",
    title: "Impact of Colour Image and Skeleton Plotting on Sign Language Recognition Using Convolutional Neural Networks (CNN)",
    publisher: "IEEE Xplore — 2024 14th International Conference on Cloud Computing, Data Science & Engineering (Confluence)",
    date: "January 2024",
    description:
      "Introduced a CNN-based model for American Sign Language recognition trained on color and skeleton-plotted image datasets, examining how preprocessing strategy affects recognition across varied backgrounds.",
    url: "https://ieeexplore.ieee.org/document/10463239",
    highlight: "8 citations",
    authors: "Anushka Singh · Fahad Eqbal Hashmi · Naman Tyagi · Anant Kumar Jayswal",
    doi: "10.1109/Confluence60223.2024.10463239",
  },
  {
    type: "book",
    title: "Decentralized Smart Cities: Enhancing Urban Living Through IoT, Metaverse, and Blockchain Integration",
    publisher: "Cambridge Scholars Publishing — Next Generation Healthcare: Deep Learning and Blockchain for Precision Clinical Decision-Making",
    date: "December 23, 2025",
    description:
      "Co-authored chapter investigating the collaborative integration of Blockchain, the Metaverse, and IoT toward decentralized smart urban ecosystems. Explores resource optimization, citizen experience, security, and sustainability — with focus on data privacy via blockchain and real-time urban service management via IoT.",
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
];

export type Certification = {
  name: string;
  issuer: string;
  // "certificate" = a completed certificate program; "course" = an individual
  // course or vendor training. Neither is a professional AWS/Azure/GCP cloud
  // certification, and the site never labels them as one.
  kind: "certificate" | "course";
};

// The Google Cybersecurity Certificate's component courses (e.g. "Play It
// Safe", "Connect and Protect") are covered by the certificate itself rather
// than listed separately.
export const certifications: Certification[] = [
  { name: "Google Cybersecurity Certificate", issuer: "Google", kind: "certificate" },
  { name: "Google Cloud Big Data and Machine Learning Fundamentals", issuer: "Google Cloud", kind: "course" },
  { name: "Introduction to Digital Transformation with Google Cloud", issuer: "Google Cloud", kind: "course" },
  { name: "Crash Course on Python", issuer: "Google", kind: "course" },
  { name: "Optical Communications — Associate", issuer: "Ciena Technology Program", kind: "course" },
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
  // For team-built work: what Naman personally did, so platform-level
  // totals never read as individual accomplishments.
  contributions?: string[];
  stack: string[];
  figures?: Figure[];
  links: { label: string; href: string; external?: boolean }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "prism",
    caseNumber: "001",
    category: "AI Infrastructure",
    year: "Jul 2026",
    title: "Prism",
    problem:
      "Teams that scale past calling a provider directly from the app run into unpredictable cost, no visibility into failures, PII/prompt-injection exposure, and no resilience when a provider degrades — usually all at once.",
    description:
      "Prism is a self-hosted, multi-provider LLM gateway that sits between applications and providers — OpenAI, Anthropic, self-hosted Ollama — behind one OpenAI-compatible endpoint: a one-line base_url swap, no other code changes. It adds request cost tracking, automatic provider failover through a hand-rolled circuit breaker, PII and prompt-injection guardrails, exact-match Redis caching, and observability through Prometheus, Grafana, and OpenTelemetry tracing. It runs locally under Docker Compose and was load-tested on one machine against local Ollama and mock OpenAI/Anthropic providers — it is not a production deployment.",
    // All figures come from local Locust runs on one machine (single uvicorn
    // process) with mixed Ollama + mock-provider traffic — keep that
    // qualifier attached; they are not production or universal numbers.
    metrics: [
      {
        value: "245–259 req/s",
        label: "combined throughput in a local load test (one machine, mixed Ollama + mock-provider traffic) · 0% unintended errors",
      },
      {
        value: "p50 ~25ms / p95 ~80ms",
        label: "gateway overhead isolated from provider latency — 10 concurrent users, same local setup",
      },
      {
        value: "p50 ~130 / p95 ~250 / p99 ~340ms",
        label: "gateway overhead at 50 concurrent users — the <50ms p95 target holds at low concurrency and is exceeded here, which is what a load test is for",
      },
      {
        value: "0.00%",
        label: "fast-model failure rate with local Ollama made unreachable — traffic failed over to mock providers; 1 stray timeout in 31,488 requests",
      },
      {
        value: "~20% / ~9.9%",
        label: "cache hit rate / guardrail block rate — matches the load test's 10% PII-triggering traffic mix",
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Docker Compose",
      "Prometheus",
      "Grafana",
      "OpenTelemetry",
      "Jaeger",
      "Ollama",
    ],
    figures: [
      {
        id: "FIG. 01",
        caption: "Complete request flow — auth, guardrails, cache, provider routing with fallback",
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
    year: "2025 – present",
    title: "Real-Time Kidney-Stone Detection",
    problem:
      "Kidney-stone material has to be spotted and localized in continuous microscopic-camera video as it streams — a real-time detection problem, not an offline image-classification one.",
    description:
      "Ongoing academic computer vision research at NYU Tandon's Flexible AI-Enabled Mechatronic Systems (FAMS) Lab. The current work develops a real-time pipeline that detects and localizes kidney stones in microscopic-camera video: preparing and preprocessing image/video data, developing and evaluating detection models, and running inference on a live stream. Earlier work in the lab covered endoscopic image analysis with YOLOv5 object detection, U-Net segmentation, and visualization in 3D Slicer. Involvement began through NYU's Vertically Integrated Projects program in Fall 2025; Volunteer Research Assistant since September 2026.",
    stack: ["PyTorch", "OpenCV", "YOLOv5", "U-Net", "3D Slicer"],
    figures: [
      {
        id: "FIG. 08",
        caption: "Conceptual computer vision pipeline — illustrative only; not the lab's experimental setup, hardware, or data.",
        kind: "diagram",
      },
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
      "NYU's Office of Faculty Affairs ran records, workflow routing, and approvals for 500+ faculty through manual, form-based processes.",
    description:
      "A team-built Django REST Framework and PostgreSQL platform that moves faculty-affairs paperwork into structured workflows with approval tracking, scheduled automation, and document storage across AWS S3 and Azure Blob Storage. I worked on it as a Software Engineer from January to August 2026 alongside other engineers — this page covers my contributions, not the whole platform.",
    // Only individually attributable figures. Platform-level totals (app and
    // test counts) belong to the whole team and are deliberately not shown.
    metrics: [
      { value: "20", label: "test cases validating the Excel importer I built" },
      { value: "3", label: "pre-release defects surfaced by integration tests I wrote" },
      { value: "~60% (est.)", label: "estimated reduction in manual record lookup time from AI document classification" },
    ],
    contributions: [
      "Django REST Framework APIs and PostgreSQL-backed workflows supporting faculty operations.",
      "Celery Beat scheduling for administrative workflows, including approval and escalation logic.",
      "An Excel data importer, plus end-to-end integration tests for the workflow paths.",
      "AI-powered document classification across AWS S3 and Azure Blob Storage.",
      "A LangChain/FAISS RAG chatbot for natural-language search of faculty policy information.",
    ],
    stack: ["Django REST Framework", "PostgreSQL", "Celery Beat", "LangChain", "FAISS", "AWS S3", "Azure Blob Storage"],
    figures: [
      {
        id: "FIG. 09A",
        caption:
          "Simplified workflow excerpt — one generic example path with a revision loop. Internal operational details (specific rules, thresholds, approval chains, form fields) are omitted; this illustrates the shape of coordinated workflow handling, not the platform's actual internal logic.",
        kind: "diagram",
      },
      {
        id: "FIG. 09B",
        caption:
          "Functional index of the platform's main Django apps, grouped by function for presentation — a team-built codebase; not a dependency graph or a map of individual ownership.",
        kind: "diagram",
      },
    ],
    links: [],
  },
  {
    slug: "airspace",
    caseNumber: "004",
    category: "Data Systems",
    year: "May 2025",
    title: "Airspace Congestion Monitoring",
    problem:
      "Airspace congestion has to be understood while it's happening, not after the fact — which means ingesting live flight telemetry and scoring risk in-stream, not in a nightly batch job.",
    description:
      "A streaming pipeline that ingests flight telemetry from the OpenSky API (plus historical replay) into three Kafka topics — flight-stream, flight-metrics, flight-aggregates — processes it in Spark Structured Streaming for risk scoring, anomaly detection, and spatial grid aggregation over 30-second windows sliding every 10 seconds, and fans results out to InfluxDB for real-time queries, MongoDB for historical lookups, and HDFS for batch archival, visualized in a live Streamlit dashboard.",
    metrics: [
      {
        value: "475,000+ records",
        label:
          "generated historical dataset modeling realistic OpenSky-shaped traffic, used for testing at volume — live ingestion pulls the real OpenSky API",
      },
      {
        value: "30s / 10s",
        label: "window length / slide interval — Spark Structured Streaming risk scoring and anomaly detection",
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
  // One combined metadata line — previously split across a separate
  // metaTop block and a metaSecondary block below the headline, with
  // "New York" repeated even though Brooklyn already establishes it.
  meta: ["N / 2026", "Brooklyn, NY", "MS Computer Science · NYU Tandon, 2026"],
  // Each line renders whitespace-nowrap at up to 9vw — keep every line at
  // 16 characters or fewer so it still fits a 390px-wide phone.
  statement: ["I build software", "and AI systems", "that operate on", "real-world data."],
  supporting:
    "Software engineer working across applied AI and machine learning, LLM systems, computer vision, and cloud.",
  globeCities: [
    { label: "Brooklyn, NY", lat: 40.6782, lng: -73.9442 },
    { label: "London", lat: 51.5074, lng: -0.1278 },
    { label: "New Delhi", lat: 28.6139, lng: 77.209 },
  ],
  now: {
    label: "NOW",
    title: "Computer vision research",
    detail: "FAMS Lab, NYU Tandon",
  },
  recently: {
    label: "RECENTLY",
    title: "Built Prism",
    detail: "multi-provider LLM gateway",
  },
};

export type DeskState = {
  id: "at-work" | "tea" | "race-weekend" | "gaming" | "training";
  label: string;
  caption: string;
  image: string;
  mobileImage?: string;
  alt: string;
};

// Temporary placeholder art: cropped directly from the approved concept
// image while no image-generation tool was available in this environment.
// Good enough to review the interaction/layout, not the final asset pass —
// see the desk-scene integration notes before treating these as finished.
export const deskScene: DeskState[] = [
  {
    id: "at-work",
    label: "At work",
    caption: "Most days start here — laptop open, systems taking shape.",
    image: "/images/desk/at-work.jpg",
    mobileImage: "/images/desk/at-work-mobile.jpg",
    alt: "A laptop showing an abstract data-systems diagram, next to a notebook, a tea mug, a model race car, a game controller, and a dumbbell on a desk.",
  },
  {
    id: "tea",
    label: "Tea",
    caption: "A short reset between builds.",
    image: "/images/desk/tea.jpg",
    alt: "A ceramic teapot and mug with tea leaves, steam rising, on a warm terracotta surface.",
  },
  {
    id: "race-weekend",
    label: "Race weekend",
    caption: "Catching F1 on race weekends, calendar permitting.",
    image: "/images/desk/race-weekend.jpg",
    alt: "A detailed open-wheel model race car with front and rear wings, on a racing-green surface with a track curve.",
  },
  {
    id: "gaming",
    label: "Gaming",
    caption: "Winding down, controller in hand.",
    image: "/images/desk/gaming.jpg",
    alt: "A game controller resting on a deep blue surface.",
  },
  {
    id: "training",
    label: "Training",
    caption: "Training keeps the rest of the week sustainable.",
    image: "/images/desk/training.jpg",
    alt: "A dumbbell and a folded towel on an ochre surface.",
  },
];
