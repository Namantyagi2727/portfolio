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
  bio: "I'm an AI/ML engineer and MS CS student at NYU Tandon, passionate about building intelligent systems that solve real-world problems. With hands-on experience across LLMs, cloud infrastructure, big data pipelines, and full-stack development, I bring ideas from research to production. Published author with Cambridge Scholars Publishing and IEEE, with 6+ internships spanning AI, cloud, and enterprise software.",
};

export type Skill = {
  category: string;
  items: string[];
};

export const skills: Skill[] = [
  {
    category: "AI / ML",
    items: [
      "Python",
      "LLMs",
      "NLP",
      "CNNs",
      "Transformers",
      "TensorFlow",
      "PyTorch",
      "Keras",
      "Hugging Face",
      "Sentiment Analysis",
      "Computer Vision",
      "RAG",
    ],
  },
  {
    category: "Cloud",
    items: [
      "AWS",
      "Azure",
      "GCP",
      "Lambda",
      "S3",
      "DynamoDB",
      "API Gateway",
      "EC2",
      "AWS Rekognition",
      "Azure ML",
      "Azure AI Services",
    ],
  },
  {
    category: "Big Data",
    items: [
      "Apache Spark",
      "Kafka",
      "ETL Pipelines",
      "InfluxDB",
      "Time-Series",
      "MongoDB",
      "PostgreSQL",
      "OpenSearch",
    ],
  },
  {
    category: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "Java", "C/C++", "SQL", "Solidity"],
  },
  {
    category: "Tools & Platforms",
    items: [
      "Docker",
      "Git",
      "Power BI",
      "Streamlit",
      "Salesforce",
      "OpenCV",
      "NumPy",
      "Pandas",
      "Agile/Kanban",
    ],
  },
  {
    category: "Blockchain",
    items: ["Solidity", "Smart Contracts", "Ethereum", "MetaMask", "Web3", "DLT"],
  },
];

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
    title: "Lead Software Developer",
    company: "NYU — Office of Faculty Affairs",
    period: "Jan 2026 – Present",
    location: "New York, NY",
    description: [
      "Leading development of records management and dashboarding systems for faculty administration.",
      "Building full-stack solutions that streamline workflows for the NYU Faculty Affairs office.",
    ],
    tags: ["Full-Stack", "Dashboarding", "Records Management"],
  },
  {
    title: "AI & Power BI Intern",
    company: "Mast-Jägermeister US, Inc.",
    period: "Jun 2025 – Aug 2025",
    location: "White Plains, NY",
    description: [
      "Built a fully offline AI chatbot using embeddings + RAG workflows for secure internal knowledge access.",
      "Automated document ingestion and semantic search pipelines, improving retrieval efficiency for TSMs and RSMs.",
      "Enhanced NLP query understanding in Power BI Q&A, improving insight accuracy and user experience.",
    ],
    tags: ["AI", "RAG", "Power BI", "NLP", "Azure AI", "Python"],
  },
  {
    title: "AI Research Intern",
    company: "University of Essex",
    period: "Sep 2023 – Aug 2024",
    location: "Remote",
    description: [
      "Conducted NLP and sentiment analysis research supporting early detection of Body Dysmorphic Disorder.",
      "Fine-tuned Transformer-based models for contextual classification and precision-recall balance.",
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
      "Performed data-driven diagnostics on optical network systems, ensuring minimal downtime for global telecom clients.",
      "Authored internal automation scripts and technical solutions that improved case resolution efficiency.",
    ],
    tags: ["Networking", "Automation", "Data Analysis"],
  },
  {
    title: "Salesforce Developer & Administrator",
    company: "Internship",
    period: "May 2023 – Dec 2023",
    location: "Remote",
    description: [
      "Automated processes with Flow Builder, reducing manual workload by 40%.",
      "Developed Apex triggers and Lightning components to extend platform functionality.",
      "Managed permission sets and data integrity across 50+ active users.",
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
    title: "Airspace Congestion Monitoring System",
    description:
      "Real-time big data pipeline processing 475K+ flight records using Apache Spark and Kafka. Visualizes airspace congestion patterns with live streaming analytics and alerting.",
    tags: ["Apache Spark", "Kafka", "Python", "Big Data", "ETL"],
    github: "https://github.com/Namantyagi2727/airspace-congestion-monitoring",
    highlight: "475K+ flight records",
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
    title: "ChainGuard",
    description:
      "Smart contract security analysis tool that scans Solidity code for vulnerabilities including reentrancy attacks, integer overflows, and access control issues using LLM-powered ranking.",
    tags: ["Solidity", "Ethereum", "Web3", "Security", "Python", "LLMs"],
    github: "https://github.com/Namantyagi2727/BlockGuard",
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
  {
    title: "Student Performance Visualization",
    description:
      "Data visualization dashboard analyzing student performance metrics. Uncovers trends across grades, subjects, and demographics using interactive charts and statistical insights.",
    tags: ["Python", "Data Visualization", "Pandas", "Matplotlib", "EDA"],
    github: "https://github.com/Namantyagi2727/Student-Performance-Visualization",
  },
  {
    title: "Todo App",
    description:
      "A clean, responsive task management application with CRUD operations, local persistence, and a minimal UI.",
    tags: ["JavaScript", "HTML", "CSS", "LocalStorage"],
    github: "https://github.com/Namantyagi2727/Todo-App",
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
    period: "Aug 2024 – Present",
    location: "Brooklyn, NY",
    gpa: "3.74 / 4.0",
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
    gpa: "8.54 / 10 · First Division with Distinction",
    details: "Exchange programs at Birkbeck University London & Adelphi University NY",
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
};

export const publications: Publication[] = [
  {
    type: "book",
    title: "Next Generation Healthcare: Deep Learning and Blockchain for Precision Clinical Decision-Making",
    publisher: "Cambridge Scholars Publishing",
    date: "December 2025",
    description:
      "Contributing author to an academic volume exploring the intersection of deep learning, blockchain, and precision medicine for next-generation clinical decision-making systems.",
    url: "https://www.cambridgescholars.com/product/978-1-0364-6498-1/",
    highlight: "Cambridge Scholars Publishing",
  },
  {
    type: "conference",
    title: "Sign Language Recognition Using CNN",
    publisher: "IEEE Xplore",
    date: "2024",
    description:
      "Published research on a CNN-based gesture-to-text translation system with skeleton-plotted image augmentation for improved spatial feature learning. Demonstrated strong generalization across varied backgrounds.",
    highlight: "IEEE Xplore 2024",
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
