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
  bio: "I'm an AI/ML engineer and MS CS student at NYU Tandon, passionate about building intelligent systems that solve real-world problems. With hands-on experience across LLMs, cloud infrastructure, big data pipelines, and full-stack development, I bring ideas from research to production. IEEE-published researcher with 5+ internships spanning AI, cloud, and enterprise software.",
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
      "Sentiment Analysis",
      "Computer Vision",
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
      "Azure ML",
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
      "Postman",
      "Agile/Kanban",
    ],
  },
  {
    category: "Blockchain",
    items: ["Solidity", "Smart Contracts", "Ethereum", "MetaMask", "Web3"],
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
      "Built AI-powered analytics dashboards using Power BI to surface business insights.",
      "Integrated machine learning models with enterprise BI tooling for predictive reporting.",
    ],
    tags: ["AI", "Power BI", "Analytics", "Python"],
  },
  {
    title: "AI Research Intern",
    company: "University of Essex",
    period: "Sep 2023 – Aug 2024",
    location: "Remote",
    description: [
      "Conducted research on NLP and deep learning models, resulting in an IEEE-published paper.",
      "Developed a CNN-based sign language recognition system achieving high accuracy.",
    ],
    tags: ["NLP", "CNN", "Research", "IEEE Published"],
  },
  {
    title: "Global Technical Support Engineer",
    company: "Ciena",
    period: "Jan 2024 – Jun 2024",
    location: "Gurugram, India",
    description: [
      "Provided L3 technical support for optical networking equipment across global enterprise clients.",
      "Diagnosed and resolved complex network performance issues using data-driven analysis.",
    ],
    tags: ["Networking", "Technical Support", "Data Analysis"],
  },
  {
    title: "Salesforce Developer & Administrator",
    company: "Internship",
    period: "May 2023 – Dec 2023",
    location: "Remote",
    description: [
      "Built custom Salesforce solutions including Apex triggers, Lightning components, and automation flows.",
      "Administered org configurations, data migrations, and user permission management.",
    ],
    tags: ["Salesforce", "Apex", "CRM", "Automation"],
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
      "CNN-based gesture recognition system for real-time sign language translation. Achieved high classification accuracy across multiple sign classes. Published in IEEE 2024.",
    tags: ["CNN", "Computer Vision", "Python", "TensorFlow", "IEEE Published"],
    highlight: "IEEE Published 2024",
  },
  {
    title: "MindMend",
    description:
      "AI-powered therapeutic assistant using LLMs and sentiment analysis to provide personalized mental wellness support. Adapts responses based on user emotional state.",
    tags: ["LLMs", "NLP", "Sentiment Analysis", "Python", "Streamlit"],
  },
  {
    title: "ChainGuard",
    description:
      "Smart contract security analysis tool that scans Solidity code for vulnerabilities including reentrancy attacks, integer overflows, and access control issues.",
    tags: ["Solidity", "Ethereum", "Web3", "Security", "Python"],
  },
  {
    title: "SmartScholar",
    description:
      "LLM-powered research paper summarizer and Q&A system. Ingests academic PDFs, generates structured summaries, and enables natural language querying over paper content.",
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
    title: "Photo Search App",
    description:
      "A responsive photo search application that fetches and displays high-quality images from an external API. Features real-time search, infinite scroll, and a clean gallery layout.",
    tags: ["JavaScript", "REST API", "HTML", "CSS"],
    github: "https://github.com/Namantyagi2727/Photo-Search-Project",
  },
  {
    title: "Todo App",
    description:
      "A clean, responsive task management application with CRUD operations, local persistence, and a minimal UI. Built to practice frontend fundamentals and state management.",
    tags: ["JavaScript", "HTML", "CSS", "LocalStorage"],
    github: "https://github.com/Namantyagi2727/Todo-App",
  },
  {
    title: "Student Performance Visualization",
    description:
      "Data visualization dashboard analyzing student performance metrics. Uncovers trends across grades, subjects, and demographics using interactive charts and statistical insights.",
    tags: ["Python", "Data Visualization", "Pandas", "Matplotlib", "EDA"],
    github: "https://github.com/Namantyagi2727/Student-Performance-Visualization",
  },
];

export type Education = {
  degree: string;
  school: string;
  period: string;
  location: string;
  details?: string;
};

export const education: Education[] = [
  {
    degree: "Master of Science — Computer Science",
    school: "NYU Tandon School of Engineering",
    period: "Aug 2024 – Present",
    location: "Brooklyn, NY",
  },
  {
    degree: "Bachelor of Science — Computer Science (Honors in AI & ML)",
    school: "Amity University Noida",
    period: "Jul 2020 – Jun 2024",
    location: "Noida, India",
    details: "Exchange programs at Birkbeck University London & Adelphi University NY",
  },
];
