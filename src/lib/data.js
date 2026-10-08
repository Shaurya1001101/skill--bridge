// ===== SKILLBRIDGE — CORE DATA REGISTRY =====
// Integrated with 4 Workspace Datasets:
// 1. DataScience Jobs.csv (1,602 company benchmarks, 93,005 openings, 10 core roles)
// 2. Analytics Jobs.csv (15,841 job postings, salary bands, required skills)
// 3. JDS Skill Traits.xlsx (139 Junior Data Scientist skill & hike records)
// 4. SDS Personality Traits.xlsx (161 Senior Data Scientist Big Five traits & success classification)

export const ROLE_CATEGORIES = [
  'All Categories',
  'Data Science & AI',
  'Data Engineering',
  'Analytics & BI',
  'Cloud & Infrastructure',
  'Software & Engineering',
];

export const SKILL_ROLES = {
  // ─── 1. Data Science & AI Roles ───
  'ml-engineer': {
    name: 'Machine Learning Engineer',
    category: 'Data Science & AI',
    source: 'DataScience Jobs.csv & Analytics Jobs.csv',
    avgSalary: '₹9.85L LPA',
    salaryMin: 2.0,
    salaryMax: 40.0,
    openings: 964,
    minExp: '1–3 yrs',
    desc: 'Develop, optimize, and deploy production ML models, neural architectures, and real-time inferencing microservices.',
    skills: [
      { name: 'Python', weight: 0.20, required: 4, category: 'tech' },
      { name: 'Machine Learning', weight: 0.18, required: 4, category: 'ml' },
      { name: 'PyTorch', weight: 0.15, required: 3, category: 'ml' },
      { name: 'SQL', weight: 0.08, required: 3, category: 'tech' },
      { name: 'Docker', weight: 0.10, required: 3, category: 'cloud' },
      { name: 'AWS', weight: 0.12, required: 3, category: 'cloud' },
      { name: 'MLOps', weight: 0.15, required: 3, category: 'cloud' },
      { name: 'Scikit-learn', weight: 0.10, required: 3, category: 'ml' },
      { name: 'NLP', weight: 0.05, required: 2, category: 'ml' },
      { name: 'Statistics', weight: 0.07, required: 3, category: 'math' },
    ],
  },

  'data-scientist': {
    name: 'Data Scientist',
    category: 'Data Science & AI',
    source: 'DataScience Jobs.csv (188 companies)',
    avgSalary: '₹13.53L LPA',
    salaryMin: 2.0,
    salaryMax: 74.5,
    openings: 9051,
    minExp: '1–3 yrs',
    desc: 'Analyze complex datasets, formulate statistical hypothesis tests, engineer predictive features, and train business-driving models.',
    skills: [
      { name: 'Python', weight: 0.18, required: 4, category: 'tech' },
      { name: 'Statistics', weight: 0.15, required: 4, category: 'math' },
      { name: 'SQL', weight: 0.12, required: 3, category: 'tech' },
      { name: 'Machine Learning', weight: 0.15, required: 3, category: 'ml' },
      { name: 'Data Visualization', weight: 0.12, required: 3, category: 'tool' },
      { name: 'Pandas', weight: 0.10, required: 3, category: 'tech' },
      { name: 'R', weight: 0.08, required: 2, category: 'tech' },
      { name: 'A/B Testing', weight: 0.07, required: 2, category: 'math' },
      { name: 'Feature Engineering', weight: 0.10, required: 3, category: 'ml' },
    ],
  },

  'senior-data-scientist': {
    name: 'Senior Data Scientist',
    category: 'Data Science & AI',
    source: 'DataScience Jobs.csv & SDS Personality Traits.xlsx',
    avgSalary: '₹22.29L LPA',
    salaryMin: 1.0,
    salaryMax: 100.0,
    openings: 2129,
    minExp: '4–7 yrs',
    desc: 'Lead end-to-end data science initiatives, architect scalable machine learning systems, mentor juniors, and translate executive business KPIs.',
    skills: [
      { name: 'Python', weight: 0.15, required: 5, category: 'tech' },
      { name: 'Advanced Statistics', weight: 0.15, required: 5, category: 'math' },
      { name: 'Deep Learning', weight: 0.15, required: 4, category: 'ml' },
      { name: 'Machine Learning', weight: 0.14, required: 5, category: 'ml' },
      { name: 'ML System Design', weight: 0.12, required: 4, category: 'ml' },
      { name: 'SQL', weight: 0.10, required: 4, category: 'tech' },
      { name: 'Stakeholder Management', weight: 0.09, required: 4, category: 'soft' },
      { name: 'Cloud AI', weight: 0.10, required: 3, category: 'cloud' },
    ],
  },

  'junior-data-scientist': {
    name: 'Junior Data Scientist (JDS)',
    category: 'Data Science & AI',
    source: 'JDS Skill Traits.xlsx (139 candidates)',
    avgSalary: '₹7.80L LPA',
    salaryMin: 3.5,
    salaryMax: 16.0,
    openings: 841,
    minExp: '0–2 yrs',
    desc: 'Junior data science candidate evaluated across the 5 core JDS trait vectors: Big Data, Maths/Stats, Coding, AI/ML, and Dashboard Storytelling.',
    skills: [
      { name: 'Python', weight: 0.20, required: 3, category: 'tech' },
      { name: 'Maths & Statistics', weight: 0.20, required: 3, category: 'math' },
      { name: 'Coding Skills', weight: 0.18, required: 3, category: 'tech' },
      { name: 'AI & ML Skills', weight: 0.16, required: 3, category: 'ml' },
      { name: 'Dashboarding & Storytelling', weight: 0.14, required: 3, category: 'tool' },
      { name: 'SQL', weight: 0.12, required: 3, category: 'tech' },
    ],
  },

  'ai-researcher': {
    name: 'AI & Deep Learning Researcher',
    category: 'Data Science & AI',
    source: 'Analytics Jobs.csv & Research Postings',
    avgSalary: '₹32.00L LPA',
    salaryMin: 15.0,
    salaryMax: 95.0,
    openings: 140,
    minExp: '3–6 yrs',
    desc: 'Investigate novel foundational architectures, publish empirical discoveries, and scale training across multi-node distributed clusters.',
    skills: [
      { name: 'Python', weight: 0.12, required: 5, category: 'tech' },
      { name: 'PyTorch', weight: 0.20, required: 5, category: 'ml' },
      { name: 'Deep Learning', weight: 0.20, required: 5, category: 'ml' },
      { name: 'Mathematics', weight: 0.18, required: 5, category: 'math' },
      { name: 'NLP', weight: 0.12, required: 4, category: 'ml' },
      { name: 'Computer Vision', weight: 0.10, required: 3, category: 'ml' },
      { name: 'Research Writing', weight: 0.08, required: 4, category: 'soft' },
    ],
  },

  'nlp-llm-engineer': {
    name: 'NLP & GenAI Engineer',
    category: 'Data Science & AI',
    source: 'Analytics Jobs.csv (69 postings)',
    avgSalary: '₹22.50L LPA',
    salaryMin: 12.0,
    salaryMax: 50.0,
    openings: 320,
    minExp: '2–5 yrs',
    desc: 'Build Retrieval-Augmented Generation (RAG) engines, fine-tune open-weights LLMs, and integrate vector indexing systems.',
    skills: [
      { name: 'NLP', weight: 0.20, required: 4, category: 'ml' },
      { name: 'Generative AI / LLMs', weight: 0.18, required: 4, category: 'ml' },
      { name: 'Python', weight: 0.16, required: 4, category: 'tech' },
      { name: 'PyTorch', weight: 0.14, required: 3, category: 'ml' },
      { name: 'RAG Architectures', weight: 0.12, required: 4, category: 'ml' },
      { name: 'Vector Databases', weight: 0.10, required: 3, category: 'tech' },
      { name: 'HuggingFace', weight: 0.10, required: 3, category: 'ml' },
    ],
  },

  // ─── 2. Data Engineering Roles ───
  'data-engineer': {
    name: 'Data Engineer',
    category: 'Data Engineering',
    source: 'DataScience Jobs.csv (188 companies)',
    avgSalary: '₹11.81L LPA',
    salaryMin: 1.1,
    salaryMax: 93.5,
    openings: 8044,
    minExp: '1–3 yrs',
    desc: 'Construct robust data pipelines, ETL ingestion jobs, and lakehouse storage partitions powering downstream analytics.',
    skills: [
      { name: 'SQL', weight: 0.18, required: 4, category: 'tech' },
      { name: 'Python', weight: 0.15, required: 3, category: 'tech' },
      { name: 'Spark', weight: 0.15, required: 3, category: 'data' },
      { name: 'AWS', weight: 0.12, required: 3, category: 'cloud' },
      { name: 'Kafka', weight: 0.10, required: 3, category: 'data' },
      { name: 'dbt', weight: 0.10, required: 3, category: 'data' },
      { name: 'Airflow', weight: 0.12, required: 3, category: 'data' },
      { name: 'Data Modeling', weight: 0.08, required: 3, category: 'data' },
    ],
  },

  'senior-data-engineer': {
    name: 'Senior Data Engineer',
    category: 'Data Engineering',
    source: 'DataScience Jobs.csv (183 companies)',
    avgSalary: '₹19.00L LPA',
    salaryMin: 2.5,
    salaryMax: 94.0,
    openings: 3411,
    minExp: '4–7 yrs',
    desc: 'Lead real-time streaming infrastructure, distributed cluster performance tuning, fault-tolerant replication, and data governance.',
    skills: [
      { name: 'Spark', weight: 0.18, required: 5, category: 'data' },
      { name: 'Distributed Systems', weight: 0.16, required: 4, category: 'tech' },
      { name: 'SQL', weight: 0.15, required: 5, category: 'tech' },
      { name: 'Kafka', weight: 0.13, required: 4, category: 'data' },
      { name: 'Snowflake / Databricks', weight: 0.12, required: 4, category: 'cloud' },
      { name: 'Airflow', weight: 0.10, required: 4, category: 'data' },
      { name: 'Python', weight: 0.10, required: 4, category: 'tech' },
      { name: 'Kubernetes', weight: 0.06, required: 3, category: 'cloud' },
    ],
  },

  'data-architect': {
    name: 'Data Architect',
    category: 'Data Engineering',
    source: 'DataScience Jobs.csv (50 companies)',
    avgSalary: '₹25.09L LPA',
    salaryMin: 7.5,
    salaryMax: 102.0,
    openings: 528,
    minExp: '8–12 yrs',
    desc: 'Define enterprise data topologies, schema standards, medallion architectures (Bronze/Silver/Gold), and compliance frameworks.',
    skills: [
      { name: 'Data Modeling', weight: 0.20, required: 5, category: 'data' },
      { name: 'Enterprise Architecture', weight: 0.18, required: 5, category: 'tech' },
      { name: 'Lakehouse / Delta Lake', weight: 0.15, required: 4, category: 'data' },
      { name: 'SQL', weight: 0.13, required: 5, category: 'tech' },
      { name: 'Cloud Governance', weight: 0.12, required: 4, category: 'cloud' },
      { name: 'Spark', weight: 0.12, required: 4, category: 'data' },
      { name: 'System Scalability', weight: 0.10, required: 5, category: 'tech' },
    ],
  },

  'big-data-architect': {
    name: 'Big Data Architect',
    category: 'Data Engineering',
    source: 'Analytics Jobs.csv (289 postings)',
    avgSalary: '₹24.50L LPA',
    salaryMin: 15.0,
    salaryMax: 50.0,
    openings: 289,
    minExp: '8–14 yrs',
    desc: 'Design high-scale Hadoop/Spark distributed ecosystems, columnar storage formats, and mission-critical event backbones.',
    skills: [
      { name: 'Hadoop', weight: 0.18, required: 5, category: 'data' },
      { name: 'Spark', weight: 0.18, required: 5, category: 'data' },
      { name: 'Hive', weight: 0.12, required: 4, category: 'data' },
      { name: 'Java', weight: 0.12, required: 4, category: 'tech' },
      { name: 'NoSQL', weight: 0.12, required: 4, category: 'tech' },
      { name: 'Kafka', weight: 0.12, required: 4, category: 'data' },
      { name: 'SQL', weight: 0.10, required: 4, category: 'tech' },
      { name: 'Python', weight: 0.06, required: 3, category: 'tech' },
    ],
  },

  // ─── 3. Analytics & BI Roles ───
  'data-analyst': {
    name: 'Data Analyst',
    category: 'Analytics & BI',
    source: 'DataScience Jobs.csv (187 companies)',
    avgSalary: '₹5.71L LPA',
    salaryMin: 0.2,
    salaryMax: 50.0,
    openings: 18095,
    minExp: '0–2 yrs',
    desc: 'Extract exploratory insights from relational tables, craft interactive dashboards, and deliver operational KPI reports.',
    skills: [
      { name: 'SQL', weight: 0.22, required: 4, category: 'tech' },
      { name: 'Excel', weight: 0.18, required: 4, category: 'tool' },
      { name: 'Power BI', weight: 0.16, required: 3, category: 'tool' },
      { name: 'Python', weight: 0.14, required: 3, category: 'tech' },
      { name: 'Data Cleaning', weight: 0.12, required: 4, category: 'data' },
      { name: 'Statistics', weight: 0.10, required: 3, category: 'math' },
      { name: 'Reporting', weight: 0.08, required: 4, category: 'tool' },
    ],
  },

  'senior-data-analyst': {
    name: 'Senior Data Analyst',
    category: 'Analytics & BI',
    source: 'DataScience Jobs.csv (187 companies)',
    avgSalary: '₹9.57L LPA',
    salaryMin: 1.4,
    salaryMax: 40.0,
    openings: 3825,
    minExp: '3–5 yrs',
    desc: 'Synthesize cross-departmental telemetry, lead cohort retention experiments, and formulate predictive business forecasts.',
    skills: [
      { name: 'Advanced SQL', weight: 0.20, required: 5, category: 'tech' },
      { name: 'Tableau', weight: 0.18, required: 4, category: 'tool' },
      { name: 'Python', weight: 0.16, required: 4, category: 'tech' },
      { name: 'Predictive Analytics', weight: 0.14, required: 3, category: 'ml' },
      { name: 'Metric Frameworks', weight: 0.12, required: 4, category: 'soft' },
      { name: 'Executive Dashboards', weight: 0.12, required: 4, category: 'tool' },
      { name: 'Data Modeling', weight: 0.08, required: 3, category: 'data' },
    ],
  },

  'business-analyst': {
    name: 'Business Analyst',
    category: 'Analytics & BI',
    source: 'DataScience Jobs.csv (188 companies, 32.8K openings)',
    avgSalary: '₹8.95L LPA',
    salaryMin: 1.2,
    salaryMax: 30.0,
    openings: 32843,
    minExp: '1–3 yrs',
    desc: 'Bridge commercial business units and engineering squads by translating functional goals into technical requirements and workflows.',
    skills: [
      { name: 'Business Analysis', weight: 0.22, required: 4, category: 'soft' },
      { name: 'Requirements Gathering', weight: 0.18, required: 4, category: 'soft' },
      { name: 'SQL', weight: 0.15, required: 3, category: 'tech' },
      { name: 'Process Flow / BPMN', weight: 0.13, required: 3, category: 'tool' },
      { name: 'Excel', weight: 0.12, required: 4, category: 'tool' },
      { name: 'Agile / Scrum', weight: 0.10, required: 3, category: 'soft' },
      { name: 'Stakeholder Communication', weight: 0.10, required: 4, category: 'soft' },
    ],
  },

  'senior-business-analyst': {
    name: 'Senior Business Analyst',
    category: 'Analytics & BI',
    source: 'DataScience Jobs.csv (187 companies)',
    avgSalary: '₹13.17L LPA',
    salaryMin: 2.4,
    salaryMax: 38.0,
    openings: 14115,
    minExp: '4–6 yrs',
    desc: 'Spearhead enterprise product transformations, define ROI benchmarks, and steer cross-functional technical delivery.',
    skills: [
      { name: 'Strategic Analysis', weight: 0.20, required: 5, category: 'soft' },
      { name: 'Stakeholder Management', weight: 0.18, required: 5, category: 'soft' },
      { name: 'Solution Design', weight: 0.15, required: 4, category: 'tech' },
      { name: 'SQL', weight: 0.14, required: 4, category: 'tech' },
      { name: 'Financial Modeling', weight: 0.12, required: 3, category: 'math' },
      { name: 'Jira / Agile', weight: 0.11, required: 4, category: 'tool' },
      { name: 'Product Discovery', weight: 0.10, required: 4, category: 'soft' },
    ],
  },

  'power-bi-developer': {
    name: 'Power BI Developer',
    category: 'Analytics & BI',
    source: 'Analytics Jobs.csv (Power BI jobs)',
    avgSalary: '₹8.50L LPA',
    salaryMin: 4.0,
    salaryMax: 18.0,
    openings: 450,
    minExp: '2–5 yrs',
    desc: 'Develop corporate Power BI dashboards, model complex relational star schemas, and write high-efficiency DAX expressions.',
    skills: [
      { name: 'Power BI', weight: 0.25, required: 5, category: 'tool' },
      { name: 'DAX', weight: 0.20, required: 4, category: 'tool' },
      { name: 'SQL', weight: 0.18, required: 4, category: 'tech' },
      { name: 'Power Query / ETL', weight: 0.15, required: 4, category: 'data' },
      { name: 'Data Modeling', weight: 0.12, required: 3, category: 'data' },
      { name: 'Dashboard Storytelling', weight: 0.10, required: 4, category: 'soft' },
    ],
  },

  'tableau-bi-specialist': {
    name: 'Tableau & BI Specialist',
    category: 'Analytics & BI',
    source: 'Analytics Jobs.csv (69 postings)',
    avgSalary: '₹9.20L LPA',
    salaryMin: 4.5,
    salaryMax: 20.0,
    openings: 520,
    minExp: '2–5 yrs',
    desc: 'Build enterprise Tableau workbooks, configure Tableau Server security filters, and author intuitive data stories.',
    skills: [
      { name: 'Tableau', weight: 0.25, required: 5, category: 'tool' },
      { name: 'SQL', weight: 0.20, required: 4, category: 'tech' },
      { name: 'Business Intelligence', weight: 0.16, required: 4, category: 'data' },
      { name: 'Data Warehousing', weight: 0.14, required: 3, category: 'data' },
      { name: 'Data Storytelling', weight: 0.13, required: 4, category: 'soft' },
      { name: 'Excel', weight: 0.12, required: 4, category: 'tool' },
    ],
  },

  'portfolio-analytics-manager': {
    name: 'Portfolio Analytics Manager',
    category: 'Analytics & BI',
    source: 'Analytics Jobs.csv (NBFC / Banking postings)',
    avgSalary: '₹19.80L LPA',
    salaryMin: 12.0,
    salaryMax: 38.0,
    openings: 310,
    minExp: '5–9 yrs',
    desc: 'Oversee credit portfolio performance, loss forecasting, debt collections intelligence, and delinquency analytics.',
    skills: [
      { name: 'Portfolio Analytics', weight: 0.22, required: 5, category: 'data' },
      { name: 'Credit Risk Modeling', weight: 0.18, required: 4, category: 'math' },
      { name: 'SQL', weight: 0.18, required: 4, category: 'tech' },
      { name: 'Python / SAS', weight: 0.15, required: 4, category: 'tech' },
      { name: 'Financial Analysis', weight: 0.14, required: 4, category: 'math' },
      { name: 'Executive Reporting', weight: 0.13, required: 4, category: 'soft' },
    ],
  },

  // ─── 4. Cloud & Infrastructure Roles ───
  'mlops-engineer': {
    name: 'MLOps Engineer',
    category: 'Cloud & Infrastructure',
    source: 'Analytics Jobs.csv & Modern Cloud Postings',
    avgSalary: '₹18.50L LPA',
    salaryMin: 10.0,
    salaryMax: 38.0,
    openings: 780,
    minExp: '2–5 yrs',
    desc: 'Automate model training pipelines, maintain containerized inference endpoints, configure model registries, and observe telemetry.',
    skills: [
      { name: 'Docker', weight: 0.16, required: 4, category: 'cloud' },
      { name: 'Kubernetes', weight: 0.16, required: 4, category: 'cloud' },
      { name: 'MLOps', weight: 0.18, required: 4, category: 'cloud' },
      { name: 'Python', weight: 0.14, required: 3, category: 'tech' },
      { name: 'CI/CD', weight: 0.14, required: 3, category: 'cloud' },
      { name: 'AWS', weight: 0.12, required: 3, category: 'cloud' },
      { name: 'Model Monitoring', weight: 0.10, required: 3, category: 'cloud' },
    ],
  },

  'cloud-data-engineer': {
    name: 'Cloud Data Engineer',
    category: 'Cloud & Infrastructure',
    source: 'Analytics Jobs.csv (110 Cloud Postings)',
    avgSalary: '₹16.80L LPA',
    salaryMin: 8.0,
    salaryMax: 35.0,
    openings: 640,
    minExp: '3–6 yrs',
    desc: 'Provision serverless compute, automated lake storage, and infrastructure-as-code across AWS, Azure, or Google Cloud.',
    skills: [
      { name: 'AWS', weight: 0.20, required: 4, category: 'cloud' },
      { name: 'Cloud Pipelines', weight: 0.16, required: 4, category: 'cloud' },
      { name: 'Terraform', weight: 0.15, required: 3, category: 'cloud' },
      { name: 'Python', weight: 0.14, required: 3, category: 'tech' },
      { name: 'SQL', weight: 0.14, required: 4, category: 'tech' },
      { name: 'Docker', weight: 0.11, required: 3, category: 'cloud' },
      { name: 'IAM & Security', weight: 0.10, required: 3, category: 'cloud' },
    ],
  },

  // ─── 5. Software & Engineering Roles ───
  'python-backend-developer': {
    name: 'Python Backend Developer',
    category: 'Software & Engineering',
    source: 'Analytics Jobs.csv (Python postings)',
    avgSalary: '₹10.40L LPA',
    salaryMin: 4.0,
    salaryMax: 25.0,
    openings: 890,
    minExp: '2–5 yrs',
    desc: 'Design asynchronous REST APIs, manage database connections, implement auth protocols, and architect high-throughput services.',
    skills: [
      { name: 'Python', weight: 0.25, required: 5, category: 'tech' },
      { name: 'FastAPI / Django', weight: 0.20, required: 4, category: 'tech' },
      { name: 'REST APIs', weight: 0.18, required: 4, category: 'tech' },
      { name: 'PostgreSQL / SQL', weight: 0.15, required: 4, category: 'tech' },
      { name: 'Docker', weight: 0.12, required: 3, category: 'cloud' },
      { name: 'Git & CI/CD', weight: 0.10, required: 3, category: 'cloud' },
    ],
  },
};

export const HEATMAP_DATA = [
  { name: 'Python', pct: 82, cat: 'ok' },
  { name: 'SQL', pct: 78, cat: 'low' },
  { name: 'Machine Learning', pct: 61, cat: 'high' },
  { name: 'Data Viz', pct: 68, cat: 'medium' },
  { name: 'Cloud / AWS', pct: 48, cat: 'critical' },
  { name: 'Docker', pct: 55, cat: 'high' },
  { name: 'MLOps', pct: 29, cat: 'critical' },
  { name: 'Generative AI', pct: 37, cat: 'critical' },
  { name: 'Statistics', pct: 71, cat: 'medium' },
  { name: 'Deep Learning', pct: 44, cat: 'critical' },
  { name: 'Spark', pct: 34, cat: 'critical' },
  { name: 'Kubernetes', pct: 38, cat: 'critical' },
  { name: 'FastAPI', pct: 62, cat: 'medium' },
  { name: 'NLP', pct: 42, cat: 'critical' },
  { name: 'Pandas', pct: 76, cat: 'low' },
  { name: 'Git / DevOps', pct: 88, cat: 'ok' },
];

export const PEER_PROFILES = [
  { id: 'E-101', name: 'User', currentRole: 'Software Engineer', dept: 'engineering', color: '#00C2A8',
    skills: { Python: 4, SQL: 3, 'Machine Learning': 2, Docker: 2, AWS: 1, MLOps: 0, PyTorch: 0, 'Scikit-learn': 2, NLP: 0, Statistics: 2 } },
  { id: 'E-204', name: 'Priya M.', currentRole: 'Data Analyst', dept: 'data', color: '#3B82F6',
    skills: { Python: 3, SQL: 4, 'Machine Learning': 1, Docker: 0, AWS: 1, MLOps: 0, PyTorch: 0, 'Scikit-learn': 2, NLP: 1, Statistics: 3 } },
  { id: 'E-317', name: 'Rohan K.', currentRole: 'Backend Engineer', dept: 'engineering', color: '#8B5CF6',
    skills: { Python: 4, SQL: 2, 'Machine Learning': 1, Docker: 3, AWS: 2, MLOps: 1, PyTorch: 0, 'Scikit-learn': 1, NLP: 0, Statistics: 1 } },
  { id: 'E-422', name: 'Sneha P.', currentRole: 'QA Engineer', dept: 'engineering', color: '#F59E0B',
    skills: { Python: 2, SQL: 2, 'Machine Learning': 0, Docker: 1, AWS: 0, MLOps: 0, PyTorch: 0, 'Scikit-learn': 0, NLP: 0, Statistics: 1 } },
  { id: 'E-118', name: 'Vikram D.', currentRole: 'Data Scientist', dept: 'data', color: '#10B981',
    skills: { Python: 4, SQL: 3, 'Machine Learning': 3, Docker: 1, AWS: 2, MLOps: 1, PyTorch: 2, 'Scikit-learn': 3, NLP: 2, Statistics: 4 } },
  { id: 'E-355', name: 'Aditya N.', currentRole: 'DevOps Engineer', dept: 'engineering', color: '#F97316',
    skills: { Python: 3, SQL: 2, 'Machine Learning': 0, Docker: 4, AWS: 4, MLOps: 2, PyTorch: 0, 'Scikit-learn': 0, NLP: 0, Statistics: 1 } },
];

export const SAMPLE_CANDIDATES = {
  user: {
    id: 'user', name: 'Alex Mercer (User)', currentRole: 'Senior Backend & Cloud Engineer',
    company: 'CloudScale Infrastructure',
    location: 'Bengaluru, India',
    connections: '500+ connections',
    connectionDegree: '1st',
    headline: 'Senior Backend & Cloud Engineer @ CloudScale · Ex-AWS · Microservices & Cloud Architect',
    targetRole: 'mlops-engineer', exp: '6 Years Exp', avatar: 'AM',
    avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    bannerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%)',
    openToWork: true,
    color: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    skills: ['Python', 'Docker', 'Kubernetes', 'AWS', 'SQL', 'FastAPI', 'CI/CD'],
    endorsedSkills: [
      { name: 'Python', count: '99+' },
      { name: 'Docker', count: '84+' },
      { name: 'Kubernetes', count: '72+' },
      { name: 'AWS Cloud', count: '90+' }
    ],
    summary: '6+ yrs building high-throughput microservices and AWS infra. Transitioning to MLOps.',
    text: `Senior Backend & Cloud Engineer with 6+ years building microservices, data pipelines, and cloud infrastructure on AWS. Expert in Python, Docker, Kubernetes, and CI/CD. Seeking MLOps transition.\n\nSkills: Python, Docker, Kubernetes, AWS EC2/S3/ECS, FastAPI, PostgreSQL, Kafka, CI/CD, Git, Terraform, MLflow (basics), Scikit-learn, Pandas`,
  },
  priya: {
    id: 'priya', name: 'Priya Patel', currentRole: 'Full Stack Web Developer',
    company: 'TechNova Solutions',
    location: 'Bengaluru, India',
    connections: '500+ connections',
    connectionDegree: '1st',
    headline: 'Full Stack Web Developer @ TechNova · React / Next.js / GenAI Integration Specialist',
    targetRole: 'ml-engineer', exp: '4 Years Exp', avatar: 'PP',
    avatarImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    bannerGradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 50%, #38bdf8 100%)',
    openToWork: true,
    color: 'linear-gradient(135deg, #06B6D4, #67E8F9)',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'OpenAI API'],
    endorsedSkills: [
      { name: 'React', count: '99+' },
      { name: 'TypeScript', count: '88+' },
      { name: 'Node.js', count: '75+' },
      { name: 'Python', count: '68+' }
    ],
    summary: '4 yrs web engineering. Transitioning to GenAI/ML Applications.',
    text: `Full Stack Developer with 4 years building React/TypeScript/Node.js apps. Exploring GenAI integration.\n\nSkills: React, TypeScript, Next.js, Node.js, Python, GraphQL, MongoDB, Docker, OpenAI API, LangChain, Scikit-learn (foundational)`,
  },
  rohan: {
    id: 'rohan', name: 'Rohan Verma', currentRole: 'Senior Data Analyst',
    company: 'QuantMetric Analytics',
    location: 'Gurugram / Delhi NCR',
    connections: '500+ connections',
    connectionDegree: '2nd',
    headline: 'Senior Data Analyst @ QuantMetric · Predictive Analytics & Business Intelligence',
    targetRole: 'data-scientist', exp: '3.5 Years Exp', avatar: 'RV',
    avatarImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    bannerGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fbbf24 100%)',
    openToWork: true,
    color: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
    skills: ['SQL', 'Python', 'Power BI', 'Pandas', 'Statistics', 'A/B Testing'],
    endorsedSkills: [
      { name: 'SQL', count: '99+' },
      { name: 'Power BI', count: '85+' },
      { name: 'Pandas', count: '82+' },
      { name: 'Statistics', count: '79+' }
    ],
    summary: '3.5 yrs BI & analytics. Transitioning to Data Scientist.',
    text: `Data Analyst with 3.5 years of BI and analytics experience. Transitioning to predictive ML.\n\nSkills: SQL, Python (Pandas, NumPy, Matplotlib), Power BI, Tableau, Statistics, Hypothesis Testing, A/B Testing, Scikit-learn, Feature Engineering`,
  },
  ananya: {
    id: 'ananya', name: 'Ananya Iyer', currentRole: 'DevOps & Cloud Associate',
    company: 'SkyOps Cloud Architecture',
    location: 'Hyderabad, India',
    connections: '500+ connections',
    connectionDegree: '1st',
    headline: 'DevOps & Cloud Associate @ SkyOps · Kubernetes / Terraform / AWS Specialist',
    targetRole: 'mlops-engineer', exp: '2.5 Years Exp', avatar: 'AI',
    avatarImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    bannerGradient: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #34d399 100%)',
    openToWork: true,
    color: 'linear-gradient(135deg, #10B981, #34D399)',
    skills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    endorsedSkills: [
      { name: 'Kubernetes', count: '94+' },
      { name: 'Docker', count: '86+' },
      { name: 'AWS', count: '82+' },
      { name: 'Terraform', count: '78+' }
    ],
    summary: '2.5 yrs Linux/Docker/AWS. Transitioning to MLOps.',
    text: `DevOps Engineer with 2.5 years managing cloud infrastructure and CI/CD pipelines on AWS.\n\nSkills: Linux, Docker, Kubernetes, AWS (EC2/S3/IAM), Terraform, GitHub Actions, Jenkins, Prometheus, Grafana, Python (foundations)`,
  },
  kavya: {
    id: 'kavya', name: 'Kavya Nair', currentRole: 'QA Automation Engineer',
    company: 'ApexQuality Systems',
    location: 'Pune, Maharashtra',
    connections: '500+ connections',
    connectionDegree: '2nd',
    headline: 'QA Automation Engineer @ ApexQuality · Python / Selenium / CI-CD Pipeline Testing',
    targetRole: 'ml-engineer', exp: '4 Years Exp', avatar: 'KN',
    avatarImg: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&q=80',
    bannerGradient: 'linear-gradient(135deg, #9d174d 0%, #ec4899 50%, #f472b6 100%)',
    openToWork: true,
    color: 'linear-gradient(135deg, #EC4899, #F472B6)',
    skills: ['Python', 'Selenium', 'PyTest', 'SQL', 'Git', 'Agile'],
    endorsedSkills: [
      { name: 'Selenium', count: '91+' },
      { name: 'PyTest', count: '87+' },
      { name: 'Python', count: '85+' },
      { name: 'SQL', count: '70+' }
    ],
    summary: '4 yrs automated testing & Python. Transitioning to ML.',
    text: `QA Automation Engineer with 4 years building Python test frameworks and CI/CD pipelines.\n\nSkills: Python, Selenium, Cypress, PyTest, Postman, SQL, Jenkins, GitHub Actions, BDD, Agile`,
  },
};

export const VIDEO_LIBRARY = [
  { id: 'v1', title: '3Blue1Brown: Essence of Linear Algebra', channel: '3Blue1Brown', duration: '3h 45m', category: 'math', tags: ['Math', 'Vectors', 'Matrices'], url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', thumbnail: '#8B5CF6', desc: 'Visual intuition for linear algebra — transformations, eigenvectors, and more.' },
  { id: 'v2', title: 'Andrew Ng: Machine Learning Specialization', channel: 'DeepLearning.AI', duration: '60h+', category: 'ml', tags: ['ML', 'Neural Nets', 'Python'], url: 'https://www.coursera.org/specializations/machine-learning-introduction', thumbnail: '#3B82F6', desc: 'The gold standard ML course by Andrew Ng covering supervised/unsupervised learning.' },
  { id: 'v3', title: 'Daniel Bourke: PyTorch for Deep Learning', channel: 'freeCodeCamp', duration: '25h', category: 'ml', tags: ['PyTorch', 'Deep Learning', 'Python'], url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', thumbnail: '#EF4444', desc: 'Complete PyTorch bootcamp from zero to mastery, covering CNNs, transformers, and more.' },
  { id: 'v4', title: 'Harvard CS50: Introduction to Computer Science', channel: 'Harvard University', duration: '40h', category: 'python', tags: ['Python', 'C', 'Algorithms'], url: 'https://cs50.harvard.edu/x/', thumbnail: '#DC2626', desc: 'The legendary Harvard intro course covering CS fundamentals, Python, SQL, and web dev.' },
  { id: 'v5', title: 'StatQuest: Machine Learning Algorithms Explained', channel: 'Josh Starmer', duration: '15h', category: 'ml', tags: ['ML', 'Statistics', 'Algorithms'], url: 'https://www.youtube.com/@statquest', thumbnail: '#10B981', desc: 'Step-by-step visual explanations of ML algorithms from SVMs to neural networks.' },
  { id: 'v6', title: 'TechWorld with Nana: Docker & Kubernetes', channel: 'TechWorld with Nana', duration: '10h', category: 'devops', tags: ['Docker', 'Kubernetes', 'DevOps'], url: 'https://www.youtube.com/@TechWorldwithNana', thumbnail: '#0EA5E9', desc: 'Beginner to advanced containers, Kubernetes, and modern DevOps practices.' },
  { id: 'v7', title: 'Overleaf: LaTeX for Beginners', channel: 'Overleaf Official', duration: '4h', category: 'latex', tags: ['LaTeX', 'PDF', 'Academic'], url: 'https://www.overleaf.com/learn', thumbnail: '#059669', desc: 'Official Overleaf documentation and video guides for LaTeX typesetting.' },
  { id: 'v8', title: 'CS50 SQL: Database Fundamentals', channel: 'Harvard CS50', duration: '8h', category: 'sql', tags: ['SQL', 'Databases', 'PostgreSQL'], url: 'https://cs50.harvard.edu/sql/', thumbnail: '#7C3AED', desc: 'Harvard\'s dedicated SQL course covering databases, queries, and real-world use cases.' },
  { id: 'v9', title: 'Kaggle ML Micro-Courses', channel: 'Kaggle', duration: '12h', category: 'ml', tags: ['Pandas', 'ML', 'Python'], url: 'https://www.kaggle.com/learn', thumbnail: '#F59E0B', desc: 'Hands-on 4-hour micro-courses in Pandas, ML, Feature Engineering, and GenAI.' },
  { id: 'v10', title: 'MIT 6.006: Introduction to Algorithms', channel: 'MIT OpenCourseWare', duration: '35h', category: 'python', tags: ['Algorithms', 'Data Structures', 'CS'], url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', thumbnail: '#6D28D9', desc: 'MIT\'s comprehensive algorithms course with full lecture videos and problem sets.' },
  { id: 'v11', title: 'Fast.ai: Practical Deep Learning', channel: 'fast.ai', duration: '20h', category: 'ml', tags: ['Deep Learning', 'PyTorch', 'NLP'], url: 'https://fast.ai', thumbnail: '#EA580C', desc: 'Top-down practical approach to deep learning, covering NLP, vision, and tabular.' },
  { id: 'v12', title: 'freeCodeCamp: Relational Databases', channel: 'freeCodeCamp', duration: '300h cert', category: 'sql', tags: ['SQL', 'PostgreSQL', 'Bash'], url: 'https://www.freecodecamp.org/learn/relational-database/', thumbnail: '#0891B2', desc: '300-hour interactive relational database certification covering SQL and PostgreSQL.' },

  // GeeksforGeeks Curated Learning Hub Collection
  { id: 'gfg-dsa-1', title: 'GeeksforGeeks: Complete DSA Roadmap & Mastery Guide', channel: 'GeeksforGeeks', duration: 'Curated Guide', category: 'dsa', tags: ['DSA', 'Arrays', 'Trees', 'Graphs'], url: 'https://www.geeksforgeeks.org/complete-guide-to-dsa-for-beginners/', thumbnail: '#2F8D46', desc: 'Step-by-step roadmap covering foundational arrays, linked lists, trees, graphs, and dynamic programming algorithms.' },
  { id: 'gfg-dsa-2', title: 'GeeksforGeeks: Top 50 Array & Two-Pointer Coding Problems', channel: 'GeeksforGeeks', duration: 'Practice Hub', category: 'dsa', tags: ['DSA', 'Arrays', 'Two Pointers'], url: 'https://www.geeksforgeeks.org/top-50-array-coding-problems-for-interviews/', thumbnail: '#2F8D46', desc: 'Curated collection of interview-tested array and two-pointer challenges with detailed complexity analyses.' },
  { id: 'gfg-dsa-3', title: 'GeeksforGeeks: Dynamic Programming (DP) Tutorial with Problems', channel: 'GeeksforGeeks', duration: 'Self-paced', category: 'dsa', tags: ['DSA', 'Dynamic Programming', 'Memoization'], url: 'https://www.geeksforgeeks.org/dynamic-programming/', thumbnail: '#2F8D46', desc: 'Master overlapping subproblems, memoization vs tabulation, knapsack, and longest common subsequence patterns.' },
  { id: 'gfg-dsa-4', title: 'GeeksforGeeks: Binary Search Trees & Graph Algorithms (BFS/DFS)', channel: 'GeeksforGeeks', duration: 'Interactive', category: 'dsa', tags: ['DSA', 'BST', 'BFS', 'DFS'], url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', thumbnail: '#2F8D46', desc: 'In-depth algorithms for traversals, Dijkstra shortest path, topological sorting, and cycle detection.' },
  { id: 'gfg-py-1', title: 'GeeksforGeeks: Python Programming Foundation & Advanced OOP', channel: 'GeeksforGeeks', duration: 'Tutorial Series', category: 'python', tags: ['Python', 'OOP', 'Generators', 'Data Structures'], url: 'https://www.geeksforgeeks.org/python-programming-language/', thumbnail: '#2F8D46', desc: 'Complete Python syntax, decorators, generators, multi-threading, and object-oriented architectural patterns.' },
  { id: 'gfg-py-2', title: 'GeeksforGeeks: NumPy & Pandas for Data Science Bootcamp', channel: 'GeeksforGeeks', duration: 'Hands-on Guide', category: 'python', tags: ['Python', 'NumPy', 'Pandas', 'Data Analysis'], url: 'https://www.geeksforgeeks.org/numpy-tutorial/', thumbnail: '#2F8D46', desc: 'Vectorized arrays, broadcasting, data manipulation with Pandas DataFrames, and performance profiling.' },
  { id: 'gfg-sql-1', title: 'GeeksforGeeks: SQL Querying, Subqueries & Window Functions', channel: 'GeeksforGeeks', duration: 'Practice Hub', category: 'sql', tags: ['SQL', 'Window Functions', 'JOINs', 'Indexing'], url: 'https://www.geeksforgeeks.org/sql-tutorial/', thumbnail: '#2F8D46', desc: 'Master complex aggregations, recursive CTEs, window functions (ROW_NUMBER, RANK, LEAD/LAG), and B-Tree indexing.' },
  { id: 'gfg-sql-2', title: 'GeeksforGeeks: Database Management Systems (DBMS) Fundamentals', channel: 'GeeksforGeeks', duration: 'Course Notes', category: 'sql', tags: ['SQL', 'DBMS', 'ACID', 'Normalization'], url: 'https://www.geeksforgeeks.org/dbms/', thumbnail: '#2F8D46', desc: 'ACID properties, transactions, isolation levels, database normalization (1NF–BCNF), and concurrency control.' },
  { id: 'gfg-devops-1', title: 'GeeksforGeeks: Docker & Containerization Architecture', channel: 'GeeksforGeeks', duration: 'Tutorial', category: 'devops', tags: ['Docker', 'DevOps', 'Containers', 'CI/CD'], url: 'https://www.geeksforgeeks.org/docker-tutorial/', thumbnail: '#2F8D46', desc: 'Building multi-stage Dockerfiles, image optimization, volume management, and container networking.' },
  { id: 'gfg-devops-2', title: 'GeeksforGeeks: Kubernetes Architecture, Pods & Services Guide', channel: 'GeeksforGeeks', duration: 'Architecture Guide', category: 'devops', tags: ['Kubernetes', 'K8s', 'Cloud', 'DevOps'], url: 'https://www.geeksforgeeks.org/kubernetes/', thumbnail: '#2F8D46', desc: 'Cluster architecture, Deployments, ReplicaSets, Ingress controllers, and Horizontal Pod Autoscaling (HPA).' },
  { id: 'gfg-math-1', title: 'GeeksforGeeks: Mathematics & Statistics for Machine Learning', channel: 'GeeksforGeeks', duration: 'Tutorial', category: 'math', tags: ['Math', 'Linear Algebra', 'Calculus', 'Probability'], url: 'https://www.geeksforgeeks.org/maths-for-machine-learning/', thumbnail: '#2F8D46', desc: 'Matrix decompositions (SVD, Eigenvalues), gradient descent calculus, and Bayesian probability distributions.' },
  { id: 'gfg-ml-1', title: 'GeeksforGeeks: Machine Learning Algorithms from Scratch', channel: 'GeeksforGeeks', duration: 'In-Depth Guide', category: 'ml', tags: ['ML', 'Algorithms', 'Scikit-learn', 'Regression'], url: 'https://www.geeksforgeeks.org/machine-learning/', thumbnail: '#2F8D46', desc: 'Mathematical derivations and Python implementations for Linear/Logistic Regression, Decision Trees, and Random Forests.' },
  { id: 'gfg-ml-2', title: 'GeeksforGeeks: Deep Learning & Neural Networks Architecture', channel: 'GeeksforGeeks', duration: 'Course Notes', category: 'ml', tags: ['Deep Learning', 'PyTorch', 'Neural Networks', 'CNN'], url: 'https://www.geeksforgeeks.org/deep-learning-tutorial/', thumbnail: '#2F8D46', desc: 'Backpropagation calculus, Convolutional Neural Networks (CNNs), Recurrent Neural Networks (RNNs), and Attention Mechanisms.' },
];

export const MARKET_JOBS = [
  {
    id: 'job-1', company: 'Razorpay', title: 'Senior MLOps & Cloud Platform Engineer',
    location: 'Bengaluru (Hybrid)', salary: '₹30L–₹45L LPA', exp: '4-7 yrs',
    source: 'Analytics Jobs.csv / LinkedIn', logoBg: 'linear-gradient(135deg, #0284C7, #38BDF8)', logo: 'R',
    roleKey: 'mlops-engineer', category: 'Cloud & Infrastructure',
    skills: ['Python', 'Docker', 'Kubernetes', 'AWS', 'MLOps', 'CI/CD'],
    desc: 'Scale real-time fraud detection and ML pipelines serving 100M+ API requests daily.',
  },
  {
    id: 'job-2', company: 'Flipkart', title: 'Staff Machine Learning Engineer – Search & Recs',
    location: 'Bengaluru', salary: '₹42L–₹65L LPA', exp: '5-9 yrs',
    source: 'DataScience Jobs.csv (Flipkart) / LinkedIn', logoBg: 'linear-gradient(135deg, #F59E0B, #FBBF24)', logo: 'F',
    roleKey: 'ml-engineer', category: 'Data Science & AI',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'SQL', 'Scikit-learn', 'Docker'],
    desc: 'Build and scale ML models for Flipkart\'s core product search, catalog embeddings, and ranking systems.',
  },
  {
    id: 'job-3', company: 'Google DeepMind', title: 'Research Engineer – Foundation Model Architecture',
    location: 'Hyderabad (On-site)', salary: '₹60L–₹95L LPA', exp: '4-8 yrs',
    source: 'Analytics Jobs.csv / Research', logoBg: 'linear-gradient(135deg, #4285F4, #34A853)', logo: 'G',
    roleKey: 'ai-researcher', category: 'Data Science & AI',
    skills: ['Python', 'PyTorch', 'Deep Learning', 'Distributed Systems', 'Mathematics', 'NLP'],
    desc: 'Work on training and inference infrastructure for next-generation multi-modal reasoning models.',
  },
  {
    id: 'job-4', company: 'Swiggy', title: 'Data Engineer – Real-Time Food Delivery Streaming',
    location: 'Bengaluru (Hybrid)', salary: '₹22L–₹38L LPA', exp: '2-5 yrs',
    source: 'DataScience Jobs.csv (Swiggy)', logoBg: 'linear-gradient(135deg, #F97316, #FED7AA)', logo: 'S',
    roleKey: 'data-engineer', category: 'Data Engineering',
    skills: ['SQL', 'Python', 'Spark', 'Kafka', 'Airflow', 'dbt'],
    desc: 'Design and build real-time event streaming pipelines processing millions of food delivery orders daily.',
  },
  {
    id: 'job-5', company: 'CRED', title: 'Data Scientist – Credit Scoring & Risk Analytics',
    location: 'Bengaluru', salary: '₹28L–₹48L LPA', exp: '3-6 yrs',
    source: 'DataScience Jobs.csv (CRED)', logoBg: 'linear-gradient(135deg, #7C3AED, #C4B5FD)', logo: 'C',
    roleKey: 'data-scientist', category: 'Data Science & AI',
    skills: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'A/B Testing', 'Feature Engineering'],
    desc: 'Build credit risk scoring models and probabilistic default analytics for CRED\'s high-trust fintech members.',
  },
  {
    id: 'job-6', company: 'Amazon', title: 'Data Scientist – AWS Intelligence & Consumer AI',
    location: 'Bengaluru / Hyderabad', salary: '₹28.1L–₹50.0L LPA', exp: '2-5 yrs',
    source: 'DataScience Jobs.csv (Row 14, 140 Openings)', logoBg: 'linear-gradient(135deg, #FF9900, #146EB4)', logo: 'A',
    roleKey: 'data-scientist', category: 'Data Science & AI',
    skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'AWS', 'Pandas'],
    desc: 'Formulate predictive customer lifetime models and supply chain forecasting algorithms across India operations.',
  },
  {
    id: 'job-7', company: 'Microsoft', title: 'Senior Data Scientist – Azure Cloud & Semantic AI',
    location: 'Hyderabad', salary: '₹32.1L–₹60.0L LPA', exp: '4-7 yrs',
    source: 'DataScience Jobs.csv (Row 25, 81 Openings)', logoBg: 'linear-gradient(135deg, #00A4EF, #7FBA00)', logo: 'M',
    roleKey: 'senior-data-scientist', category: 'Data Science & AI',
    skills: ['Python', 'Deep Learning', 'Advanced Statistics', 'Machine Learning', 'Cloud AI', 'ML System Design'],
    desc: 'Lead the next generation of intelligent telemetry and conversational AI integrated into enterprise services.',
  },
  {
    id: 'job-8', company: 'Walmart', title: 'Senior Data Engineer – Omni-Channel Data Platforms',
    location: 'Bengaluru', salary: '₹28.3L–₹41.0L LPA', exp: '3-6 yrs',
    source: 'DataScience Jobs.csv (Row 23, 85 Openings)', logoBg: 'linear-gradient(135deg, #0071DC, #FFC220)', logo: 'W',
    roleKey: 'senior-data-engineer', category: 'Data Engineering',
    skills: ['Spark', 'Distributed Systems', 'Kafka', 'SQL', 'Snowflake / Databricks', 'Airflow'],
    desc: 'Architect global inventory data ingestion pipelines processing petabyte-scale transactions with sub-second SLA.',
  },
  {
    id: 'job-9', company: 'TCS', title: 'Senior Business Analyst – Global Enterprise Consulting',
    location: 'Mumbai / Pune', salary: '₹13.2L–₹22.0L LPA', exp: '3-6 yrs',
    source: 'DataScience Jobs.csv (Row 2, 841 Openings)', logoBg: 'linear-gradient(135deg, #1F2937, #4B5563)', logo: 'T',
    roleKey: 'senior-business-analyst', category: 'Analytics & BI',
    skills: ['Business Analysis', 'Strategic Analysis', 'SQL', 'Requirements Gathering', 'Process Flow / BPMN', 'Agile / Scrum'],
    desc: 'Guide Fortune 500 clients through digital architecture transformations, requirements elicitation, and workflow redesign.',
  },
  {
    id: 'job-10', company: 'Accenture', title: 'Data Architect – Modern Enterprise Lakehouse',
    location: 'Bengaluru', salary: '₹25.0L–₹45.0L LPA', exp: '8-12 yrs',
    source: 'DataScience Jobs.csv (Row 3, 501 Openings)', logoBg: 'linear-gradient(135deg, #A100FF, #000000)', logo: '>A',
    roleKey: 'data-architect', category: 'Data Engineering',
    skills: ['Data Modeling', 'Enterprise Architecture', 'Lakehouse / Delta Lake', 'Cloud Governance', 'Spark', 'SQL'],
    desc: 'Lead cloud data modernization strategies, defining Medallion data mesh architectures for multinational clients.',
  },
  {
    id: 'job-11', company: 'IBM', title: 'Big Data Architect – Distributed Cloud Analytics',
    location: 'Bengaluru', salary: '₹24.0L–₹38.0L LPA', exp: '7-12 yrs',
    source: 'Analytics Jobs.csv (Big Data Architect)', logoBg: 'linear-gradient(135deg, #052FAD, #1F70C1)', logo: 'IBM',
    roleKey: 'big-data-architect', category: 'Data Engineering',
    skills: ['Hadoop', 'Spark', 'Hive', 'Java', 'NoSQL', 'Kafka', 'SQL'],
    desc: 'Design fault-tolerant distributed compute backbones on hybrid cloud clusters with end-to-end data governance.',
  },
  {
    id: 'job-12', company: 'JP Morgan Chase', title: 'Senior Data Analyst – Quantitative Financial Risk',
    location: 'Mumbai', salary: '₹12.8L–₹18.0L LPA', exp: '3-5 yrs',
    source: 'DataScience Jobs.csv (Row 1191, Senior Data Analyst)', logoBg: 'linear-gradient(135deg, #111827, #374151)', logo: 'JPM',
    roleKey: 'senior-data-analyst', category: 'Analytics & BI',
    skills: ['Advanced SQL', 'Python', 'Tableau', 'Predictive Analytics', 'Metric Frameworks', 'Data Modeling'],
    desc: 'Conduct quantitative liquidity risk modeling, stress test asset exposures, and produce executive board dashboards.',
  },
  {
    id: 'job-13', company: 'Deloitte', title: 'Senior Business Analyst – Strategy & Operations',
    location: 'Gurgaon', salary: '₹14.2L–₹25.0L LPA', exp: '3-6 yrs',
    source: 'DataScience Jobs.csv (Row 11, 163 Openings)', logoBg: 'linear-gradient(135deg, #86BC25, #000000)', logo: 'D',
    roleKey: 'senior-business-analyst', category: 'Analytics & BI',
    skills: ['Strategic Analysis', 'Stakeholder Management', 'SQL', 'Financial Modeling', 'Jira / Agile', 'Solution Design'],
    desc: 'Perform commercial due diligence, cost optimization modeling, and tech roadmap planning for healthcare and tech leaders.',
  },
  {
    id: 'job-14', company: 'HSBC', title: 'Portfolio Analytics Manager – Retail Risk & Fraud',
    location: 'Pune / Bengaluru', salary: '₹11.9L–₹16.0L LPA', exp: '4-8 yrs',
    source: 'DataScience Jobs.csv (Row 1187) & Analytics Jobs.csv', logoBg: 'linear-gradient(135deg, #DB0011, #4B5563)', logo: 'H',
    roleKey: 'portfolio-analytics-manager', category: 'Analytics & BI',
    skills: ['Portfolio Analytics', 'Credit Risk Modeling', 'SQL', 'Python / SAS', 'Financial Analysis', 'Executive Reporting'],
    desc: 'Optimize consumer credit underwriting scorecards, monitor cross-border portfolio loss ratios, and detect fraud signals.',
  },
  {
    id: 'job-15', company: 'Cognizant', title: 'Power BI Developer – Enterprise Reporting Solutions',
    location: 'Chennai / Kolkata', salary: '₹8.5L–₹14.0L LPA', exp: '2-5 yrs',
    source: 'Analytics Jobs.csv (Power BI Specialist)', logoBg: 'linear-gradient(135deg, #0033A0, #0072CE)', logo: 'C',
    roleKey: 'power-bi-developer', category: 'Analytics & BI',
    skills: ['Power BI', 'DAX', 'SQL', 'Power Query / ETL', 'Data Modeling', 'Dashboard Storytelling'],
    desc: 'Design semantic tabular models, write optimized DAX metrics, and build executive scorecards for global pharmaceutical clients.',
  },
  {
    id: 'job-16', company: 'Capgemini', title: 'Tableau & BI Specialist – Visual Intelligence',
    location: 'Pune / Hyderabad', salary: '₹9.0L–₹15.0L LPA', exp: '2-5 yrs',
    source: 'Analytics Jobs.csv (Tableau Specialists)', logoBg: 'linear-gradient(135deg, #0070AD, #1B365D)', logo: 'CG',
    roleKey: 'tableau-bi-specialist', category: 'Analytics & BI',
    skills: ['Tableau', 'SQL', 'Business Intelligence', 'Data Warehousing', 'Data Storytelling', 'Excel'],
    desc: 'Engineer self-service Tableau reports, configure row-level data security filters, and train corporate stakeholder groups.',
  },
  {
    id: 'job-17', company: 'Ericsson', title: 'Junior Data Scientist – 5G Network Intelligence',
    location: 'Noida', salary: '₹7.8L–₹14.6L LPA', exp: '1-3 yrs',
    source: 'DataScience Jobs.csv (Row 12) & JDS Traits Dataset', logoBg: 'linear-gradient(135deg, #002561, #0072CE)', logo: 'E',
    roleKey: 'junior-data-scientist', category: 'Data Science & AI',
    skills: ['Python', 'Maths & Statistics', 'Coding Skills', 'AI & ML Skills', 'Dashboarding & Storytelling', 'SQL'],
    desc: 'Benchmark telecommunications cell towers, predict network congestion spikes, and visualize coverage heatmaps.',
  },
  {
    id: 'job-18', company: 'Wipro', title: 'Cloud Data Engineer – Azure & AWS Pipelines',
    location: 'Bengaluru', salary: '₹12.0L–₹18.2L LPA', exp: '2-5 yrs',
    source: 'DataScience Jobs.csv (Row 8, 225 Openings)', logoBg: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', logo: 'W',
    roleKey: 'cloud-data-engineer', category: 'Cloud & Infrastructure',
    skills: ['AWS', 'Cloud Pipelines', 'Terraform', 'Python', 'SQL', 'Docker', 'IAM & Security'],
    desc: 'Implement Infrastructure-as-Code data landing zones, automated serverless functions, and secure cloud warehouses.',
  },
  {
    id: 'job-19', company: 'Zomato', title: 'Python Backend Developer – Core Order Processing',
    location: 'Gurgaon', salary: '₹14.0L–₹22.0L LPA', exp: '2-5 yrs',
    source: 'Analytics Jobs.csv (Python Developer)', logoBg: 'linear-gradient(135deg, #E23744, #FEE2E2)', logo: 'Z',
    roleKey: 'python-backend-developer', category: 'Software & Engineering',
    skills: ['Python', 'FastAPI / Django', 'REST APIs', 'PostgreSQL / SQL', 'Docker', 'Git & CI/CD'],
    desc: 'Build high-concurrency order placement and live rider location tracking microservices handling 20,000 requests/second.',
  },
  {
    id: 'job-20', company: 'Fractal Analytics', title: 'NLP & GenAI Specialist – Enterprise Agentic Systems',
    location: 'Mumbai / Bengaluru', salary: '₹22.0L–₹36.0L LPA', exp: '3-6 yrs',
    source: 'DataScience Jobs.csv (Row 10, 166 Openings) & Analytics Jobs.csv', logoBg: 'linear-gradient(135deg, #EC4899, #8B5CF6)', logo: 'FA',
    roleKey: 'nlp-llm-engineer', category: 'Data Science & AI',
    skills: ['NLP', 'Generative AI / LLMs', 'Python', 'PyTorch', 'RAG Architectures', 'Vector Databases', 'HuggingFace'],
    desc: 'Develop domain-specific multi-agent LLM reasoning workflows, evaluation harnesses, and vector retrieval pipelines.',
  },
];

export const TREND_DATA = {
  labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'],
  'ai-ml': [
    { name: 'Generative AI', data: [5, 8, 12, 18, 28, 42, 58, 72, 83, 91], color: '#00C2A8' },
    { name: 'MLOps', data: [15, 20, 24, 30, 36, 42, 49, 55, 61, 66], color: '#3B82F6' },
    { name: 'PyTorch', data: [25, 30, 36, 42, 48, 54, 60, 66, 71, 75], color: '#8B5CF6' },
    { name: 'RAG / LLM', data: [2, 4, 7, 12, 22, 38, 55, 68, 78, 86], color: '#F59E0B' },
  ],
  cloud: [
    { name: 'AWS', data: [65, 67, 70, 72, 74, 76, 78, 80, 82, 84], color: '#F59E0B' },
    { name: 'Kubernetes', data: [30, 35, 40, 46, 52, 57, 62, 66, 70, 73], color: '#00C2A8' },
    { name: 'Terraform', data: [20, 25, 30, 36, 42, 47, 52, 57, 62, 66], color: '#3B82F6' },
    { name: 'FinOps', data: [5, 8, 12, 18, 24, 31, 38, 44, 50, 56], color: '#EC4899' },
  ],
  data: [
    { name: 'dbt', data: [10, 16, 22, 30, 38, 46, 53, 59, 64, 69], color: '#F97316' },
    { name: 'Spark', data: [55, 57, 60, 62, 64, 65, 67, 68, 69, 70], color: '#8B5CF6' },
    { name: 'Kafka', data: [32, 36, 40, 44, 48, 52, 55, 58, 60, 63], color: '#3B82F6' },
    { name: 'DuckDB', data: [2, 5, 10, 16, 24, 34, 44, 54, 62, 69], color: '#00C2A8' },
  ],
  security: [
    { name: 'Cloud Security', data: [40, 44, 49, 54, 59, 63, 67, 70, 73, 76], color: '#EF4444' },
    { name: 'Zero Trust', data: [15, 20, 27, 34, 41, 47, 53, 58, 63, 67], color: '#F59E0B' },
    { name: 'AppSec/SAST', data: [28, 31, 35, 39, 43, 47, 51, 54, 57, 60], color: '#8B5CF6' },
    { name: 'AI Safety', data: [2, 3, 5, 8, 14, 22, 32, 42, 52, 61], color: '#00C2A8' },
  ],
};

export const ROADMAPS = {
  'ml-engineer': {
    beginner: [
      { weeks: '1–2', skill: 'Python Fundamentals', desc: 'Core Python: data types, functions, OOP, file I/O', tags: ['Variables', 'Functions', 'OOP'], priority: 'critical', hours: 20 },
      { weeks: '3–4', skill: 'SQL & Data Basics', desc: 'Querying databases, joins, aggregations, window functions', tags: ['SELECT', 'Joins', 'Aggregations'], priority: 'high', hours: 16 },
      { weeks: '5–6', skill: 'Statistics & Math', desc: 'Probability, distributions, hypothesis testing, linear algebra', tags: ['Probability', 'Linear Algebra'], priority: 'high', hours: 18 },
      { weeks: '7–8', skill: 'Machine Learning Basics', desc: 'Supervised/unsupervised learning, Scikit-learn, model evaluation', tags: ['Scikit-learn', 'Classification', 'Regression'], priority: 'critical', hours: 20 },
      { weeks: '9–10', skill: 'PyTorch & Deep Learning', desc: 'Neural networks, training loops, CNNs, optimization', tags: ['PyTorch', 'Neural Nets', 'Backprop'], priority: 'critical', hours: 22 },
      { weeks: '11–12', skill: 'Deployment & Docker', desc: 'FastAPI, containerization, basic model serving', tags: ['FastAPI', 'Docker', 'REST API'], priority: 'high', hours: 18 },
    ],
    intermediate: [
      { weeks: '1–3', skill: 'PyTorch & Advanced ML', desc: 'Deep learning architectures, transformers, model fine-tuning', tags: ['PyTorch', 'Transformers', 'Fine-tuning'], priority: 'critical', hours: 30 },
      { weeks: '4–5', skill: 'Model Deployment', desc: 'FastAPI endpoints, model serialization, request handling', tags: ['FastAPI', 'ONNX', 'Serving'], priority: 'high', hours: 20 },
      { weeks: '6–7', skill: 'Docker & Containers', desc: 'Dockerfiles, docker-compose, container orchestration basics', tags: ['Docker', 'docker-compose', 'Containers'], priority: 'high', hours: 18 },
      { weeks: '8–10', skill: 'MLOps Practices', desc: 'MLflow, experiment tracking, CI/CD for ML, model monitoring', tags: ['MLflow', 'CI/CD', 'Monitoring'], priority: 'critical', hours: 22 },
      { weeks: '11–12', skill: 'AWS Deployment', desc: 'EC2, S3, SageMaker, ECS — deploying and scaling ML models', tags: ['AWS', 'SageMaker', 'ECS'], priority: 'high', hours: 20 },
    ],
    advanced: [
      { weeks: '1–2', skill: 'MLOps Architecture', desc: 'Production-grade ML systems, feature stores, model registry', tags: ['Kubeflow', 'Feature Store', 'Model Registry'], priority: 'critical', hours: 20 },
      { weeks: '3–4', skill: 'AWS ML Infrastructure', desc: 'SageMaker Pipelines, EKS, multi-region deployments', tags: ['SageMaker', 'EKS', 'Lambda'], priority: 'high', hours: 18 },
      { weeks: '5–7', skill: 'LLM Fine-tuning & RAG', desc: 'PEFT, LoRA, RAG pipelines, vector databases', tags: ['LoRA', 'RAG', 'pgvector'], priority: 'critical', hours: 26 },
      { weeks: '8–10', skill: 'System Design for ML', desc: 'Distributed training, serving at scale, A/B testing ML', tags: ['Distributed', 'Load Balancing', 'A/B'], priority: 'medium', hours: 22 },
      { weeks: '11–12', skill: 'Research & Publication', desc: 'Paper writing, experiment design, benchmark contribution', tags: ['Research', 'arXiv', 'Benchmarks'], priority: 'low', hours: 16 },
    ],
  },
};

export const WAYPOINTS = [
  {
    id: 'wp1', num: '01', label: 'Baseline Diagnostic', icon: '◎',
    title: 'Waypoint 01: Baseline Diagnostic',
    desc: 'Audit your current skills and establish your readiness baseline.',
    goals: ['Complete skill gap analysis', 'Identify top 3 critical gaps', 'Set target role', 'Upload your resume'],
    videos: ['v4', 'v5'], drills: ['Run Gap Analysis', 'Analyze resume text'],
  },
  {
    id: 'wp2', num: '02', label: 'Foundations & Resume', icon: '◉',
    title: 'Waypoint 02: Foundational Code & LaTeX CV',
    desc: 'Polish Python basics and write an ATS-compliant resume in LaTeX.',
    goals: ['Python functions and OOP', 'Pandas data manipulation', 'Write LaTeX resume', 'Push to GitHub'],
    videos: ['v4', 'v7'], drills: ['Python Pandas drill', 'LaTeX CV template'],
  },
  {
    id: 'wp3', num: '03', label: 'Core Competency', icon: '◈',
    title: 'Waypoint 03: Core Competency Bridge',
    desc: 'Master neural network math, PyTorch fundamentals, and model evaluation.',
    goals: ['Linear algebra & calculus intuition', 'PyTorch tensors and autograd', 'Train/test split and evaluation', 'Scikit-learn pipelines'],
    videos: ['v1', 'v3', 'v11'], drills: ['PyTorch tensor drill', 'Scikit-learn metrics'],
  },
  {
    id: 'wp4', num: '04', label: 'Lab Sandboxes & CI/CD', icon: '◆',
    title: 'Waypoint 04: Lab Sandboxes & CI/CD',
    desc: 'Docker containerization, FastAPI endpoints, and automated pipelines.',
    goals: ['Dockerize a Python app', 'Build FastAPI REST endpoint', 'Set up GitHub Actions CI/CD', 'Write SQL against real schema'],
    videos: ['v6'], drills: ['SQL playground query', 'Python ML code lab'],
  },
  {
    id: 'wp5', num: '05', label: 'Masterclass Deep Dives', icon: '◇',
    title: 'Waypoint 05: Masterclass Deep Dives',
    desc: 'Build deep conceptual intuition through visual math and university lectures.',
    goals: ['MIT Algorithms course (6.006)', 'StatQuest algorithm series', 'Advanced PyTorch patterns', 'Transformers and attention mechanism'],
    videos: ['v10', 'v5', 'v2'], drills: ['Transformers code walkthrough'],
  },
  {
    id: 'wp6', num: '06', label: 'Capstone & Role Mastery', icon: '★',
    title: 'Waypoint 06: Capstone & Role Mastery',
    desc: 'Build, test, and document an end-to-end portfolio project.',
    goals: ['Define capstone problem statement', 'Collect and clean dataset', 'Train, evaluate, deploy model', 'Write technical report or blog post'],
    videos: ['v9', 'v3'], drills: ['Capstone project submission'],
  },
];

export const DAILY_PROBLEMS = [
  {
    id: 'p1', title: 'Sigmoid Activation Function', difficulty: 'easy', category: 'Python/ML',
    desc: 'Implement the sigmoid activation function σ(x) = 1/(1+e^−x) using only NumPy. Then compute sigmoid for a list of values: [-2, -1, 0, 1, 2].',
    hint: 'Use np.exp() and be careful of numerical stability for very large negative numbers.',
    starterCode: 'import numpy as np\n\ndef sigmoid(x):\n    # Your implementation here\n    pass\n\nvalues = [-2, -1, 0, 1, 2]\nprint(sigmoid(np.array(values)))',
    solution: 'import numpy as np\n\ndef sigmoid(x):\n    return 1 / (1 + np.exp(-x))\n\nvalues = [-2, -1, 0, 1, 2]\nprint(sigmoid(np.array(values)))\n# Output: [0.119 0.269 0.5 0.731 0.881]',
    tags: ['NumPy', 'Activation', 'Math'],
    gfgPractice: { title: 'GeeksforGeeks: Mathematical Functions in Python', url: 'https://www.geeksforgeeks.org/mathematical-functions-python-set-1-numeric-functions/' },
  },
  {
    id: 'p2', title: 'Top 5 Highest Salary Roles', difficulty: 'easy', category: 'SQL',
    desc: 'Write a SQL query to find the top 5 job roles with the highest average salary from a `jobs` table. Include the role name and average salary, ordered by salary descending.',
    hint: 'Use GROUP BY with AVG() and ORDER BY with LIMIT.',
    starterCode: '-- Table: jobs (id, role, salary, company, location)\nSELECT \n    role,\n    -- Your code here\nFROM jobs\n-- Complete the query\nLIMIT 5;',
    solution: 'SELECT \n    role,\n    ROUND(AVG(salary), 2) AS avg_salary\nFROM jobs\nGROUP BY role\nORDER BY avg_salary DESC\nLIMIT 5;',
    tags: ['GROUP BY', 'AVG', 'ORDER BY'],
    gfgPractice: { title: 'GeeksforGeeks: SQL Query to find Second and Nth Highest Salary', url: 'https://www.geeksforgeeks.org/sql-query-to-find-second-largest-salary/' },
  },
  {
    id: 'p3', title: 'Train/Test Split from Scratch', difficulty: 'medium', category: 'Python/ML',
    desc: 'Implement a simple train_test_split function without using sklearn. Split a dataset into 80% training and 20% test sets, shuffling with a random seed for reproducibility.',
    hint: 'Use np.random.permutation() to shuffle indices, then slice by the split ratio.',
    starterCode: 'import numpy as np\n\ndef train_test_split(X, y, test_size=0.2, random_state=42):\n    # Your implementation here\n    pass\n\nX = np.array([[1,2],[3,4],[5,6],[7,8],[9,10]])\ny = np.array([0, 1, 0, 1, 0])\nX_train, X_test, y_train, y_test = train_test_split(X, y)\nprint(f"Train size: {len(X_train)}, Test size: {len(X_test)}")',
    solution: 'import numpy as np\n\ndef train_test_split(X, y, test_size=0.2, random_state=42):\n    np.random.seed(random_state)\n    indices = np.random.permutation(len(X))\n    split = int(len(X) * (1 - test_size))\n    train_idx, test_idx = indices[:split], indices[split:]\n    return X[train_idx], X[test_idx], y[train_idx], y[test_idx]\n\nX = np.array([[1,2],[3,4],[5,6],[7,8],[9,10]])\ny = np.array([0, 1, 0, 1, 0])\nX_train, X_test, y_train, y_test = train_test_split(X, y)\nprint(f"Train size: {len(X_train)}, Test size: {len(X_test)}")',
    tags: ['NumPy', 'Preprocessing', 'ML'],
    gfgPractice: { title: 'GeeksforGeeks: Splitting Data for Machine Learning Models', url: 'https://www.geeksforgeeks.org/splitting-data-for-machine-learning-models/' },
  },
  {
    id: 'p4', title: 'Compute Precision & Recall', difficulty: 'medium', category: 'Python/ML',
    desc: 'Given arrays of true labels and predicted labels, compute precision and recall from scratch (no sklearn). Handle the edge case where the denominator is zero.',
    hint: 'Precision = TP / (TP + FP), Recall = TP / (TP + FN). Count true/false positives/negatives manually.',
    starterCode: 'def precision_recall(y_true, y_pred):\n    # Your implementation here\n    pass\n\ny_true = [1, 0, 1, 1, 0, 1]\ny_pred = [1, 0, 1, 0, 1, 1]\np, r = precision_recall(y_true, y_pred)\nprint(f"Precision: {p:.3f}, Recall: {r:.3f}")',
    solution: 'def precision_recall(y_true, y_pred):\n    tp = sum(1 for t,p in zip(y_true,y_pred) if t==1 and p==1)\n    fp = sum(1 for t,p in zip(y_true,y_pred) if t==0 and p==1)\n    fn = sum(1 for t,p in zip(y_true,y_pred) if t==1 and p==0)\n    precision = tp / (tp + fp) if (tp + fp) > 0 else 0\n    recall = tp / (tp + fn) if (tp + fn) > 0 else 0\n    return precision, recall\n\ny_true = [1, 0, 1, 1, 0, 1]\ny_pred = [1, 0, 1, 0, 1, 1]\np, r = precision_recall(y_true, y_pred)\nprint(f"Precision: {p:.3f}, Recall: {r:.3f}")',
    tags: ['Metrics', 'Classification', 'ML'],
    gfgPractice: { title: 'GeeksforGeeks: Precision and Recall in Machine Learning', url: 'https://www.geeksforgeeks.org/precision-and-recall-in-machine-learning/' },
  },
  {
    id: 'p5', title: 'Find Skill Co-occurrence', difficulty: 'hard', category: 'SQL',
    desc: 'Write a SQL query to find the top 5 pairs of skills that appear together most often in job postings. Assume a `job_skills` table with job_id and skill columns.',
    hint: 'Self-join the table and use WHERE a.skill < b.skill to avoid duplicate pairs.',
    starterCode: '-- Table: job_skills (job_id, skill)\n-- Find top 5 co-occurring skill pairs\nSELECT\n    -- Your code here\nFROM job_skills a\nJOIN job_skills b ON -- join condition\nWHERE -- avoid duplicates\nGROUP BY a.skill, b.skill\nORDER BY count DESC\nLIMIT 5;',
    solution: 'SELECT\n    a.skill AS skill_1,\n    b.skill AS skill_2,\n    COUNT(*) AS co_occurrence\nFROM job_skills a\nJOIN job_skills b ON a.job_id = b.job_id\nWHERE a.skill < b.skill\nGROUP BY a.skill, b.skill\nORDER BY co_occurrence DESC\nLIMIT 5;',
    tags: ['Self-Join', 'Aggregation', 'Advanced'],
    gfgPractice: { title: 'GeeksforGeeks: SQL Self Join with Real-World Queries', url: 'https://www.geeksforgeeks.org/sql-self-join/' },
  },
  {
    id: 'p6', title: 'K-Nearest Neighbors Classifier', difficulty: 'hard', category: 'Python/ML',
    desc: 'Implement a simple KNN classifier from scratch. The predict function should return the majority class among the k nearest training examples (using Euclidean distance).',
    hint: 'For each test point, compute distance to all training points, sort, take k nearest, return majority class.',
    starterCode: 'import numpy as np\nfrom collections import Counter\n\nclass KNN:\n    def __init__(self, k=3):\n        self.k = k\n    \n    def fit(self, X, y):\n        # Store training data\n        pass\n    \n    def predict(self, X):\n        # Return predictions\n        pass\n\n# Test it\nX_train = np.array([[1,1],[2,2],[3,1],[6,6],[7,7],[8,6]])\ny_train = np.array([0,0,0,1,1,1])\nX_test = np.array([[2,1],[7,6]])\nknn = KNN(k=3)\nknn.fit(X_train, y_train)\nprint(knn.predict(X_test))  # Expected: [0, 1]',
    solution: 'import numpy as np\nfrom collections import Counter\n\nclass KNN:\n    def __init__(self, k=3):\n        self.k = k\n    \n    def fit(self, X, y):\n        self.X_train = X\n        self.y_train = y\n    \n    def predict(self, X):\n        return np.array([self._predict_single(x) for x in X])\n    \n    def _predict_single(self, x):\n        dists = np.sqrt(np.sum((self.X_train - x)**2, axis=1))\n        k_idx = np.argsort(dists)[:self.k]\n        k_labels = self.y_train[k_idx]\n        return Counter(k_labels).most_common(1)[0][0]\n\nX_train = np.array([[1,1],[2,2],[3,1],[6,6],[7,7],[8,6]])\ny_train = np.array([0,0,0,1,1,1])\nX_test = np.array([[2,1],[7,6]])\nknn = KNN(k=3)\nknn.fit(X_train, y_train)\nprint(knn.predict(X_test))  # [0, 1]',
    tags: ['Algorithm', 'Distance', 'Classification'],
    gfgPractice: { title: 'GeeksforGeeks: K-Nearest Neighbours Algorithm & Implementation', url: 'https://www.geeksforgeeks.org/k-nearest-neighbours/' },
  },
  {
    id: 'p7', title: 'Gradient Descent Step', difficulty: 'medium', category: 'Python/ML',
    desc: 'Implement one step of gradient descent for linear regression. Given weights w, features X, labels y, and learning rate lr, compute the gradient and return updated weights.',
    hint: 'For MSE loss: gradient = -(2/n) * X.T @ (y - X@w). Update: w = w - lr * gradient',
    starterCode: 'import numpy as np\n\ndef gradient_descent_step(w, X, y, lr=0.01):\n    # Compute one gradient descent step for linear regression\n    pass\n\nX = np.array([[1,1],[1,2],[1,3]])\ny = np.array([2, 3, 4])\nw = np.zeros(2)\nw_new = gradient_descent_step(w, X, y, lr=0.01)\nprint(w_new)',
    solution: 'import numpy as np\n\ndef gradient_descent_step(w, X, y, lr=0.01):\n    n = len(y)\n    predictions = X @ w\n    errors = y - predictions\n    gradient = -(2/n) * X.T @ errors\n    return w - lr * gradient\n\nX = np.array([[1,1],[1,2],[1,3]])\ny = np.array([2, 3, 4])\nw = np.zeros(2)\nw_new = gradient_descent_step(w, X, y, lr=0.01)\nprint(w_new)',
    tags: ['Optimization', 'Linear Algebra', 'Math'],
    gfgPractice: { title: 'GeeksforGeeks: Gradient Descent in Python from Scratch', url: 'https://www.geeksforgeeks.org/gradient-descent-in-python/' },
  },
];

export const FAQ_DATA = [
  {
    q: 'How does the skill gap score work?',
    a: 'The gap score uses a weighted formula: Σ[skill_weight × max(0, required_level − current_level)], normalized to 0–100%. Higher weights go to skills more critical for the target role.',
  },
  {
    q: 'Is my resume data sent to any server?',
    a: 'No. PDF and DOCX parsing happens entirely in your browser using client-side libraries (pdf.js, mammoth.js). Your resume content never leaves your device.',
  },
  {
    q: 'How does the AI assistant work without an API key?',
    a: 'Without an API key, the assistant uses a rule-based fallback that answers from a curated FAQ database. All common questions about skill gaps, roadmaps, and platform features are covered.',
  },
  {
    q: 'Can I export my learning roadmap?',
    a: 'Yes. Go to Improvement Map and click "Export .ics" to download your study plan as an iCalendar file compatible with Google Calendar, Outlook, and Apple Calendar.',
  },
  {
    q: 'How do I earn XP and badges?',
    a: 'Earn XP by completing daily coding problems (+10 XP each), maintaining a daily streak bonus (+5 XP/day), running gap analyses, and completing waypoints. Badges unlock at milestone thresholds.',
  },
  {
    q: 'What does the Market Shock Simulator do?',
    a: 'It recalculates your trajectory projections under five industry demand scenarios (Baseline, GenAI Surge, MLOps Boom, Data Spike, Stats Rebound) to show how market shifts affect your readiness timeline.',
  },
  {
    q: 'How does LinkedIn job matching work?',
    a: 'SkillBridge computes your match % against each job\'s required skills based on your gap analysis profile. The "Search on LinkedIn" button opens LinkedIn Jobs pre-filled with the role and relevant skills. Note: live job data would require a licensed LinkedIn API.',
  },
  {
    q: 'How is the daily problem chosen?',
    a: 'Problems are chosen deterministically by the day of the year, so everyone sees the same problem each day. The question bank rotates through Python, SQL, and ML topics by difficulty.',
  },
];

export const LATEX_TEMPLATES = {
  cv: `\\documentclass[11pt, a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\setlength{\\parindent}{0pt}

\\begin{document}

% --- HEADER ---
{\\LARGE \\textbf{Your Full Name}} \\\\[4pt]
\\href{mailto:you@email.com}{you@email.com} \\quad | \\quad
+91 98765 43210 \\quad | \\quad
\\href{https://linkedin.com/in/yourprofile}{linkedin.com/in/yourprofile} \\quad | \\quad
Bengaluru, India

\\section*{Professional Summary}
Senior Software Engineer with 4+ years of experience building ML systems and data pipelines.
Proficient in Python, PyTorch, Docker, and AWS. Seeking Machine Learning Engineer role.

\\section*{Technical Skills}
\\begin{itemize}[noitemsep]
  \\item \\textbf{Languages:} Python, SQL, Bash
  \\item \\textbf{ML/AI:} PyTorch, Scikit-learn, Pandas, NumPy, MLflow
  \\item \\textbf{Cloud \\& DevOps:} AWS (EC2, S3, SageMaker), Docker, Kubernetes, CI/CD
  \\item \\textbf{Tools:} Git, FastAPI, PostgreSQL, Kafka
\\end{itemize}

\\section*{Experience}
\\textbf{Machine Learning Engineer} \\hfill \\textit{2022 -- Present} \\\\
\\textit{TechCorp India, Bengaluru}
\\begin{itemize}[noitemsep]
  \\item Deployed 3 production ML models serving 10M+ predictions/day using FastAPI and Docker.
  \\item Reduced model inference latency by 40\\% via ONNX optimization and batch processing.
  \\item Built automated MLOps pipeline with MLflow, GitHub Actions, and AWS SageMaker.
\\end{itemize}

\\section*{Education}
\\textbf{B.Tech in Computer Science} \\hfill \\textit{2018 -- 2022} \\\\
\\textit{IIT Bombay, Mumbai}

\\end{document}`,

  paper: `\\documentclass[12pt]{article}
\\usepackage{amsmath, amssymb}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{abstract}

\\title{\\textbf{SkillBridge: An AI-Powered Skill Gap Analysis Framework for Career Transition}}
\\author{Your Name\\\\
\\textit{Institution Name}\\\\
\\href{mailto:you@email.com}{you@email.com}}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{abstract}
We present SkillBridge, a client-side AI platform that diagnoses individual skill gaps against
target technical roles using weighted gap scoring and NLP-based skill extraction. Our approach
achieves high alignment with human expert assessments while running entirely in the browser.
\\end{abstract}

\\section{Introduction}
The rapid evolution of technical roles creates persistent mismatches between available talent
and required competencies. Traditional resume screening relies on keyword matching, failing to
capture semantic skill relationships or proficiency depth.

\\section{Methodology}
\\subsection{Weighted Gap Score}
For candidate $c$ targeting role $r$, the gap score is computed as:
\\begin{equation}
  G(c, r) = \\sum_{s \\in S_r} w_s \\cdot \\max(0,\\; \\text{required}_s - \\text{current}_s^{(c)})
\\end{equation}
where $w_s$ is the importance weight, $S_r$ the skill set, normalized to $[0, 100]$.

\\subsection{Skill Extraction}
Skills are extracted using keyword matching against a curated taxonomy of 200+ technical
competencies, with synonym resolution (e.g., \\texttt{sklearn} $\\to$ \\texttt{Scikit-learn}).

\\section{Results}
Preliminary evaluation on 50 candidate profiles shows 87\\% agreement with expert assessments.

\\section{Conclusion}
SkillBridge demonstrates that effective, privacy-preserving skill gap analysis is achievable
using client-side NLP and weighted scoring, without requiring server-side AI infrastructure.

\\end{document}`,

  project: `\\documentclass[12pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref, enumitem, graphicx}
\\usepackage{titlesec}

\\title{\\textbf{Technical Project Report}\\\\[6pt]
{\\large Sentiment Analysis API with FastAPI \\& PyTorch}}
\\author{Your Name}
\\date{\\today}

\\begin{document}
\\maketitle
\\tableofcontents
\\newpage

\\section{Project Overview}
This project implements a production-ready sentiment analysis REST API using a fine-tuned
BERT model wrapped in FastAPI and containerized with Docker for cloud deployment.

\\section{Architecture}
\\begin{itemize}
  \\item \\textbf{Model:} DistilBERT fine-tuned on SST-2 dataset (92.4\\% accuracy)
  \\item \\textbf{API Framework:} FastAPI with async request handling
  \\item \\textbf{Containerization:} Docker + docker-compose for local and cloud deployment
  \\item \\textbf{Cloud:} AWS EC2 + S3 for model artifacts
\\end{itemize}

\\section{Technical Implementation}
\\subsection{Model Training}
The model was fine-tuned using the HuggingFace \\texttt{transformers} library:
\\begin{verbatim}
trainer = Trainer(
    model=model,
    args=TrainingArguments(output_dir='./results', num_train_epochs=3),
    train_dataset=train_ds, eval_dataset=val_ds
)
trainer.train()
\\end{verbatim}

\\section{Results \\& Metrics}
\\begin{itemize}
  \\item Accuracy: 92.4\\% on SST-2 test set
  \\item Inference latency: 45ms p95 on AWS EC2 t3.medium
  \\item API throughput: 150 req/s with 4 Gunicorn workers
\\end{itemize}

\\section{Skills Demonstrated}
PyTorch, HuggingFace Transformers, FastAPI, Docker, AWS, Python, REST API design.

\\end{document}`,
};

export const MARKET_SHOCK_CONFIGS = {
  neutral: { label: 'Baseline Market', sub: 'Current 2024–2026', desc: 'Standard demand weights from LinkedIn Economic Graph and Stack Overflow 2024 trends.', multipliers: {} },
  'genai-surge': { label: 'GenAI Surge', sub: '+45% LLM / PyTorch', desc: 'Generative AI demand explodes — PyTorch, NLP, and RAG skills become 45% more critical.', multipliers: { PyTorch: 1.45, NLP: 1.45, 'Machine Learning': 1.25 } },
  'mlops-boom': { label: 'MLOps Boom', sub: '+40% Docker / K8s', desc: 'MLOps and infrastructure demand surges — Docker, Kubernetes, CI/CD become 40% more valuable.', multipliers: { Docker: 1.40, Kubernetes: 1.40, MLOps: 1.35, 'CI/CD': 1.30 } },
  'data-eng-spike': { label: 'Data Spike', sub: '+35% SQL / Spark', desc: 'Data engineering demand spikes — SQL, Spark, and dbt become 35% more critical.', multipliers: { SQL: 1.35, Spark: 1.35, Kafka: 1.30, dbt: 1.25 } },
  'stats-rebound': { label: 'Stats Rebound', sub: '+30% Math / Rigor', desc: 'Statistical rigor becomes premium — Statistics, Mathematics, and A/B Testing gain 30%.', multipliers: { Statistics: 1.30, Mathematics: 1.30, 'A/B Testing': 1.25 } },
};

export const DEPT_READINESS = [
  { name: 'Data & Analytics', pct: 74, color: '#3B82F6' },
  { name: 'Engineering', pct: 69, color: '#8B5CF6' },
  { name: 'Research', pct: 81, color: '#10B981' },
  { name: 'Product', pct: 52, color: '#F59E0B' },
  { name: 'Operations', pct: 43, color: '#EF4444' },
  { name: 'HR / Finance', pct: 31, color: '#EF4444' },
];

export const COVERAGE_MATRIX = [
  { skill: 'Python', current: 82, required: 80, status: 'ok' },
  { skill: 'Machine Learning', current: 61, required: 85, status: 'critical' },
  { skill: 'Cloud / AWS', current: 48, required: 80, status: 'critical' },
  { skill: 'MLOps', current: 29, required: 70, status: 'critical' },
  { skill: 'Docker', current: 55, required: 75, status: 'high' },
  { skill: 'SQL', current: 78, required: 75, status: 'ok' },
  { skill: 'Deep Learning', current: 44, required: 70, status: 'critical' },
  { skill: 'Statistics', current: 71, required: 75, status: 'low' },
  { skill: 'GenAI / LLMs', current: 37, required: 65, status: 'critical' },
];

export const DATASETS = [
  {
    name: 'Analytics Jobs (job_descriptions)',
    category: 'Market Postings',
    table: 'job_descriptions',
    desc: 'Extensive dataset of job postings, designation titles, minimum & maximum experience years, salary brackets, and required skills across 8 tech role families.',
    records: '15,841 Postings',
    dateRange: 'Active Live Telemetry',
    license: 'Internal Hackathon',
    sourceFile: 'Analytics Jobs.csv',
    url: '/api/skillgap/jobs',
  },
  {
    name: 'Data Science Salary Benchmarks (datascience_jobs)',
    category: 'Compensation Intelligence',
    table: 'datascience_jobs',
    desc: 'Empirical company-level salary distributions, hiring volumes, and experience requirements across top tech employers (Amazon, Microsoft, Walmart, TCS, Accenture, etc.).',
    records: '1,602 Records (93,005 Openings)',
    dateRange: 'Empirical Industry Benchmarks',
    license: 'Internal Hackathon',
    sourceFile: 'DataScience Jobs.csv',
    url: '/api/datascience-jobs',
  },
  {
    name: 'Junior Data Scientist Skill Traits (JDS)',
    category: 'Candidate Trait Evaluations',
    table: 'jds_skill_traits',
    desc: 'Evaluations of 139 junior candidates measured on 5 foundational skill dimensions (Big Data, Maths/Stats, Coding, AI/ML, Storytelling) and salary hike outcomes.',
    records: '139 Candidates (52.5% High Hike)',
    dateRange: 'Trait Assessment Matrix',
    license: 'Research Dataset',
    sourceFile: 'JDS Skill Traits.xlsx',
    url: '/api/traits/jds',
  },
  {
    name: 'Senior Data Scientist Personality Traits (SDS)',
    category: 'Leadership Intelligence',
    table: 'sds_personality_traits',
    desc: 'Evaluations of 161 senior candidates across Big Five Personality Traits (Neuroticism, Extraversion, Openness, Agreeableness, Conscientiousness) and success classification.',
    records: '161 Senior Profiles (52.8% High Fit)',
    dateRange: 'EPQ Psychometric Matrix',
    license: 'Research Dataset',
    sourceFile: 'SDS Personality Traits.xlsx',
    url: '/api/traits/sds',
  },
];

export const STATIC_NEWS_FALLBACK = [
  { title: 'PyTorch 2.4 Released with 40% Faster Training', tag: 'AI/ML', url: 'https://pytorch.org', date: '2 days ago' },
  { title: 'Stack Overflow Survey: Python Tops Most Used Language 12 Years Running', tag: 'Python', url: 'https://survey.stackoverflow.co', date: '1 week ago' },
  { title: 'Google Releases Gemini 2.0: Multimodal Reasoning Benchmark Results', tag: 'GenAI', url: 'https://deepmind.google', date: '3 days ago' },
  { title: 'MLOps Engineer Salaries Up 28% YoY Across Indian Tech Hubs', tag: 'Career', url: 'https://linkedin.com', date: '5 days ago' },
  { title: 'Kubernetes 1.32: Enhanced Memory Manager and Node Swap Support', tag: 'DevOps', url: 'https://kubernetes.io', date: '4 days ago' },
  { title: 'Meta Open-Sources LLaMA 3.3 — 70B Parameter Model', tag: 'LLM', url: 'https://ai.meta.com', date: '1 week ago' },
  { title: 'SQL Still #1 Required Skill in Data Engineering Job Postings', tag: 'SQL', url: 'https://www.kaggle.com', date: '6 days ago' },
];

export const SALARY_BANDS = [
  { role: 'AI & Deep Learning Researcher', min: 15, max: 95, avg: 32.0, color: '#8B5CF6', category: 'Data Science & AI' },
  { role: 'Data Architect', min: 8, max: 102, avg: 25.1, color: '#F59E0B', category: 'Data Engineering' },
  { role: 'Big Data Architect', min: 15, max: 50, avg: 24.5, color: '#F97316', category: 'Data Engineering' },
  { role: 'Senior Data Scientist', min: 2, max: 100, avg: 22.3, color: '#10B981', category: 'Data Science & AI' },
  { role: 'NLP & GenAI Engineer', min: 12, max: 50, avg: 22.5, color: '#EC4899', category: 'Data Science & AI' },
  { role: 'Portfolio Analytics Manager', min: 12, max: 38, avg: 19.8, color: '#06B6D4', category: 'Analytics & BI' },
  { role: 'Senior Data Engineer', min: 3, max: 94, avg: 19.0, color: '#3B82F6', category: 'Data Engineering' },
  { role: 'MLOps Engineer', min: 10, max: 38, avg: 18.5, color: '#00C2A8', category: 'Cloud & Infrastructure' },
  { role: 'Cloud Data Engineer', min: 8, max: 35, avg: 16.8, color: '#6366F1', category: 'Cloud & Infrastructure' },
  { role: 'Data Scientist', min: 2, max: 75, avg: 13.5, color: '#10B981', category: 'Data Science & AI' },
  { role: 'Senior Business Analyst', min: 2, max: 38, avg: 13.2, color: '#8B5CF6', category: 'Analytics & BI' },
  { role: 'Data Engineer', min: 1, max: 94, avg: 11.8, color: '#3B82F6', category: 'Data Engineering' },
  { role: 'Python Backend Developer', min: 4, max: 25, avg: 10.4, color: '#F59E0B', category: 'Software & Engineering' },
  { role: 'Machine Learning Engineer', min: 2, max: 40, avg: 9.9, color: '#00C2A8', category: 'Data Science & AI' },
  { role: 'Senior Data Analyst', min: 1, max: 40, avg: 9.6, color: '#06B6D4', category: 'Analytics & BI' },
  { role: 'Tableau & BI Specialist', min: 5, max: 20, avg: 9.2, color: '#3B82F6', category: 'Analytics & BI' },
  { role: 'Business Analyst', min: 1, max: 30, avg: 8.9, color: '#8B5CF6', category: 'Analytics & BI' },
  { role: 'Power BI Developer', min: 4, max: 18, avg: 8.5, color: '#F59E0B', category: 'Analytics & BI' },
  { role: 'Junior Data Scientist (JDS)', min: 4, max: 16, avg: 7.8, color: '#10B981', category: 'Data Science & AI' },
  { role: 'Data Analyst', min: 1, max: 50, avg: 5.7, color: '#06B6D4', category: 'Analytics & BI' },
];

export const PACING_MODES = {
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive',
    badge: 'Fast Track',
    badgeClass: 'badge-danger',
    color: '#EF4444',
    totalWeeks: 4,
    hoursPerWeek: 28,
    hoursPerDay: 4.0,
    taskDensity: 'High (3–4 tasks/day)',
    summary: 'Fastest timeline with maximum daily focus. Best for active job seekers or full-time upskilling.',
    multiplier: 0.5,
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced',
    badge: 'Recommended',
    badgeClass: 'badge-brand',
    color: '#3B82F6',
    totalWeeks: 8,
    hoursPerWeek: 18,
    hoursPerDay: 2.5,
    taskDensity: 'Moderate (1–2 tasks/day)',
    summary: 'Optimized pacing balancing deep mastery with sustainable daily effort. Fits working professionals.',
    multiplier: 1.0,
  },
  conservative: {
    id: 'conservative',
    name: 'Conservative',
    badge: 'Extended',
    badgeClass: 'badge-info',
    color: '#10B981',
    totalWeeks: 16,
    hoursPerWeek: 10,
    hoursPerDay: 1.5,
    taskDensity: 'Light (3–4 tasks/week)',
    summary: 'Minimal daily commitment over an extended horizon. Ideal for busy schedules or exploratory learning.',
    multiplier: 2.0,
  },
};

export const SKILL_RESOURCES = {
  Python: {
    skill: 'Python',
    practice: [
      { platform: 'LeetCode', title: 'Top Interview 150: Python Data Structures', desc: 'Core arrays, hash tables, sliding windows, and binary search problems.', url: 'https://leetcode.com/problem-list/top-interview-questions/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'Python Proficiency Track (115 Challenges)', desc: 'From basic data types to itertools, decorators, and regex challenges.', url: 'https://www.hackerrank.com/domains/python', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Python Practice Problems & Algorithmic Drills', desc: 'Timed problem-solving drills focused on space & time complexity.', url: 'https://www.codechef.com/practice/python', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'Python for Beginners to Advanced (12-Hour Masterclass)', desc: 'FreeCodeCamp in-depth walkthrough of object-oriented Python, dunder methods, and memory management.', url: 'https://www.youtube.com/results?search_query=freecodecamp+python+masterclass', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Python Object-Oriented Programming & Clean Architecture', desc: 'Design patterns, typing, modular packaging, and test-driven development.', url: 'https://www.linkedin.com/learning/search?keywords=python+advanced', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Python for Everybody Specialization (University of Michigan)', desc: 'Data structures, networked application programs, and database interfaces.', url: 'https://www.coursera.org/specializations/python', icon: 'book', badge: 'Coursera' },
    ],
  },
  PyTorch: {
    skill: 'PyTorch',
    practice: [
      { platform: 'LeetCode', title: 'Tensor Manipulation & Matrix Math Algorithms', desc: 'Linear algebra computation problems, dot products, and multi-dimensional tensor indexing.', url: 'https://leetcode.com/tag/math/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'Matrix Mathematics & Linear Algebra Drills', desc: 'Eigenvalues, vector operations, and gradient descent simulation.', url: 'https://www.hackerrank.com/domains/ai', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Neural Net Forward-Pass from Scratch', desc: 'Implementing backpropagation and custom autograd loss functions without libraries.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'PyTorch for Deep Learning Bootcamp (Daniel Bourke / FreeCodeCamp)', desc: 'Zero to mastery in tensors, CNNs, ViT, Transfer Learning, and custom PyTorch datasets.', url: 'https://www.youtube.com/results?search_query=daniel+bourke+pytorch+for+deep+learning', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Building Deep Learning Models with PyTorch', desc: 'Autograd, GPU acceleration with CUDA, custom torch.nn.Module, and inference profiling.', url: 'https://www.linkedin.com/learning/search?keywords=pytorch+deep+learning', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Deep Neural Networks with PyTorch (IBM)', desc: 'Covers linear classifiers, multi-layer perceptrons, convolutional networks, and TorchVision.', url: 'https://www.coursera.org/learn/deep-neural-networks-with-pytorch', icon: 'book', badge: 'Coursera' },
    ],
  },
  'Machine Learning': {
    skill: 'Machine Learning',
    practice: [
      { platform: 'LeetCode', title: 'Machine Learning & Data Science LeetCode Set', desc: 'K-Means clustering, decision tree splits, and statistical scoring challenges.', url: 'https://leetcode.com/problem-list/machine-learning/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'Artificial Intelligence & ML Domain Challenges', desc: 'Regression, classification, NLP n-grams, and bot building.', url: 'https://www.hackerrank.com/domains/ai', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Optimization & Numerical Methods Arena', desc: 'Gradient descent, cost function minimization, and matrix factorization.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'StatQuest with Josh Starmer: Machine Learning Fundamentals', desc: 'Crystal-clear visual explanations of ROC curves, Random Forests, XGBoost, and PCA.', url: 'https://www.youtube.com/results?search_query=statquest+machine+learning', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Machine Learning with Scikit-Learn: Best Practices', desc: 'Cross-validation, hyperparameter tuning with GridSearchCV, and pipeline transformers.', url: 'https://www.linkedin.com/learning/search?keywords=machine+learning+scikit-learn', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Machine Learning Specialization by Andrew Ng (DeepLearning.AI)', desc: 'Supervised learning, advanced learning algorithms, and unsupervised learning best practices.', url: 'https://www.coursera.org/specializations/machine-learning-introduction', icon: 'book', badge: 'Coursera' },
    ],
  },
  MLOps: {
    skill: 'MLOps',
    practice: [
      { platform: 'LeetCode', title: 'System Design: Scalable Model Inference API', desc: 'Architecting rate limiters, caching layers, and asynchronous worker queues for ML inference.', url: 'https://leetcode.com/discuss/interview-question/system-design/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'DevOps & Pipeline Automation Challenges', desc: 'Shell scripting, continuous integration hooks, and automated health checks.', url: 'https://www.hackerrank.com/domains/shell', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Batch Processing & Distributed Queue Drills', desc: 'Handling high-throughput streaming payloads with fault tolerance.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'Made With ML: Production MLOps Course (Goku Mohandas)', desc: 'End-to-end ML production: packaging, testing, MLflow tracking, DVC data versioning, and CI/CD.', url: 'https://www.youtube.com/results?search_query=made+with+ml+goku+mohandas', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'MLOps: Deploying and Monitoring Machine Learning Models', desc: 'Model registries, drift detection, Prometheus metrics, and automated retraining pipelines.', url: 'https://www.linkedin.com/learning/search?keywords=mlops+machine+learning', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Machine Learning Engineering for Production (MLOps) Specialization', desc: 'By Andrew Ng: Introduction to Machine Learning in Production, Data Pipelines, and Deployment.', url: 'https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops', icon: 'book', badge: 'Coursera' },
    ],
  },
  Docker: {
    skill: 'Docker',
    practice: [
      { platform: 'LeetCode', title: 'Microservices & Container Networking System Design', desc: 'Container orchestration, port forwarding, load balancing, and container lifecycle.', url: 'https://leetcode.com/discuss/interview-question/system-design/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'Linux Bash & Docker Environment Challenges', desc: 'Dockerfile creation, environment variable injection, and volume mounts.', url: 'https://www.hackerrank.com/domains/shell', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Resource Allocation & Container Sandbox Sandbox', desc: 'Restricting memory/CPU bounds and managing multi-container composition.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'Docker Tutorial for Beginners (TechWorld with Nana)', desc: 'Comprehensive guide covering images, containers, networks, Docker Compose, and multi-stage builds.', url: 'https://www.youtube.com/results?search_query=docker+tutorial+for+beginners+techworld+with+nana', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Learning Docker: Containerization for Developers', desc: 'Best practices for writing lean Dockerfiles, securing container daemon, and caching layers.', url: 'https://www.linkedin.com/learning/search?keywords=docker+containerization', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Introduction to Containers with Docker, Kubernetes & OpenShift (IBM)', desc: 'Containerizing Python ML APIs and orchestrating them for production availability.', url: 'https://www.coursera.org/learn/ibm-containers-docker-kubernetes-openshift', icon: 'book', badge: 'Coursera' },
    ],
  },
  Kubernetes: {
    skill: 'Kubernetes',
    practice: [
      { platform: 'LeetCode', title: 'High-Availability Service Cluster Architecture', desc: 'Designing zero-downtime rolling updates, canary rollouts, and ingress proxies.', url: 'https://leetcode.com/discuss/interview-question/system-design/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'YAML Manifest Configuration & K8s CLI Drills', desc: 'Writing Pod, Deployment, Service, and ConfigMap declarations.', url: 'https://www.hackerrank.com/domains/shell', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Horizontal Pod Autoscaler Simulation', desc: 'Configuring metrics servers and autoscaling thresholds under synthetic load.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'Kubernetes Course for Beginners (FreeCodeCamp)', desc: 'Pods, Services, Ingress, Volumes, Namespaces, Helm charts, and cluster architecture.', url: 'https://www.youtube.com/results?search_query=freecodecamp+kubernetes+course', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Kubernetes Essential Training: Deployments & Scaling', desc: 'Managing clusters with kubectl, persistent storage, and node management.', url: 'https://www.linkedin.com/learning/search?keywords=kubernetes+essential+training', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Google Cloud: Architecting with Google Kubernetes Engine', desc: 'Production GKE management, network policies, and auto-repairing node pools.', url: 'https://www.coursera.org/specializations/architecting-google-kubernetes-engine', icon: 'book', badge: 'Coursera' },
    ],
  },
  SQL: {
    skill: 'SQL',
    practice: [
      { platform: 'LeetCode', title: 'LeetCode SQL 50: Study Plan for Data Professionals', desc: 'Window functions, recursive CTEs, JOIN edge cases, and conditional aggregations.', url: 'https://leetcode.com/studyplan/top-sql-50/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'HackerRank SQL Practice (Basic to Advanced 58 Challenges)', desc: 'Covers ranking functions, Pivot tables, self-joins, and subquery optimizations.', url: 'https://www.hackerrank.com/domains/sql', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Database Query Optimization & Indexing Drills', desc: 'Query performance profiling, EXPLAIN ANALYZE, and index coverage.', url: 'https://www.codechef.com/practice/sql', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'Advanced SQL for Data Engineers (Luke Barousse / Alex The Analyst)', desc: 'Window functions (ROW_NUMBER, DENSE_RANK, LAG/LEAD), CTEs, and cohort analysis.', url: 'https://www.youtube.com/results?search_query=alex+the+analyst+advanced+sql', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Advanced SQL: Window Functions & Query Tuning', desc: 'Analytical partitioning, indexing strategies, and execution plan optimization.', url: 'https://www.linkedin.com/learning/search?keywords=advanced+sql+window+functions', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'SQL for Data Science (UC Davis)', desc: 'Filtering, sorting, calculating, creating tables, and joining relational databases.', url: 'https://www.coursera.org/learn/sql-for-data-science', icon: 'book', badge: 'Coursera' },
    ],
  },
  'Deep Learning': {
    skill: 'Deep Learning',
    practice: [
      { platform: 'LeetCode', title: 'Graph & Matrix Algorithmic Problems for Neural Nets', desc: 'Adjacency list traversal, topological sort, backprop computational graphs.', url: 'https://leetcode.com/tag/graph/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'Deep Learning & Neural Network Fundamentals', desc: 'Activation functions, softmax derivatives, and cross-entropy calculation.', url: 'https://www.hackerrank.com/domains/ai', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Convolutional Layer 2D Kernel Convolution', desc: 'Writing sliding-window 2D spatial convolution and pooling algorithms.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'Neural Networks: Zero to Hero (Andrej Karpathy)', desc: 'Building micrograd, makemore, GPT-2 from scratch with deep intuitive understanding.', url: 'https://www.youtube.com/results?search_query=andrej+karpathy+zero+to+hero', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Deep Learning: Foundations and Practical Architecture', desc: 'Vanishing gradients, residual connections, dropout regularization, and batch normalization.', url: 'https://www.linkedin.com/learning/search?keywords=deep+learning+foundations', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Deep Learning Specialization by Andrew Ng (DeepLearning.AI)', desc: 'Neural Networks, Hyperparameter Tuning, Structuring ML Projects, CNNs, and Sequence Models.', url: 'https://www.coursera.org/specializations/deep-learning', icon: 'book', badge: 'Coursera' },
    ],
  },
  NLP: {
    skill: 'NLP',
    practice: [
      { platform: 'LeetCode', title: 'String Parsing, Trie & Tokenization Problems', desc: 'Prefix trees, edit distance (Levenshtein), regex matching, and word break algorithms.', url: 'https://leetcode.com/tag/trie/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'NLP Text Processing & Stemming Challenges', desc: 'TF-IDF scoring, sentiment tokenization, and n-gram probabilities.', url: 'https://www.hackerrank.com/domains/ai', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Vocabulary Indexer & BPE Tokenizer Drills', desc: 'Byte-pair encoding algorithms and sentence similarity metrics.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'Hugging Face NLP Course — Transformers & Tokenizers', desc: 'Official Hugging Face tutorials on fine-tuning BERT, RoBERTa, and pipeline inference.', url: 'https://www.youtube.com/results?search_query=hugging+face+nlp+course', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Natural Language Processing with Transformers', desc: 'Attention mechanisms, embeddings, BERT, GPT, and vector semantic search.', url: 'https://www.linkedin.com/learning/search?keywords=nlp+transformers', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Natural Language Processing Specialization (DeepLearning.AI)', desc: 'NLP with classification and vector spaces, probabilistic models, and attention models.', url: 'https://www.coursera.org/specializations/natural-language-processing-nlp', icon: 'book', badge: 'Coursera' },
    ],
  },
  'Cloud / AWS': {
    skill: 'Cloud / AWS',
    practice: [
      { platform: 'LeetCode', title: 'Distributed Systems & Cloud Fault Tolerance', desc: 'Designing resilient SQS event consumers, S3 object storage tiers, and serverless lambdas.', url: 'https://leetcode.com/discuss/interview-question/system-design/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'AWS IAM & CLI Automation Challenges', desc: 'Configuring security groups, IAM least privilege roles, and S3 bucket policies.', url: 'https://www.hackerrank.com/domains/shell', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Cloud Infrastructure Health-Check Drills', desc: 'Simulating multi-AZ failovers, load balancing, and connection pooling.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'AWS Certified Solutions Architect Associate (Stephane Maarek / FreeCodeCamp)', desc: 'Complete breakdown of EC2, S3, RDS, Lambda, SageMaker, VPC, and CloudWatch.', url: 'https://www.youtube.com/results?search_query=freecodecamp+aws+solutions+architect', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'AWS for Machine Learning Engineers', desc: 'Deploying model endpoints with SageMaker, managing S3 datasets, and IAM authentication.', url: 'https://www.linkedin.com/learning/search?keywords=aws+machine+learning', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'AWS Fundamentals: Going Cloud-Native (Amazon Web Services)', desc: 'Core AWS services, security, database migration, and serverless computing.', url: 'https://www.coursera.org/learn/aws-fundamentals-going-cloud-native', icon: 'book', badge: 'Coursera' },
    ],
  },
  'CI/CD': {
    skill: 'CI/CD',
    practice: [
      { platform: 'LeetCode', title: 'System Design: Automated Build & Deployment Pipeline', desc: 'Designing artifacts registries, rollback mechanisms, and blue/green deployments.', url: 'https://leetcode.com/discuss/interview-question/system-design/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'Git & Bash Pipeline Automation Challenges', desc: 'Git branching models, merge conflict automation, and shell testing hooks.', url: 'https://www.hackerrank.com/domains/shell', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'Automated Test Runner & Coverage Verification', desc: 'Writing CLI test harnesses and fail-safe deployment gates.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'GitHub Actions Full Course (TechWorld with Nana)', desc: 'Building complete CI/CD pipelines from scratch with automated testing and Docker publishing.', url: 'https://www.youtube.com/results?search_query=github+actions+tutorial+techworld+with+nana', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'DevOps Foundations: Continuous Delivery / Continuous Integration', desc: 'Automated test pipelines, release orchestration, and pipeline security best practices.', url: 'https://www.linkedin.com/learning/search?keywords=ci+cd+continuous+integration', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Continuous Integration and Continuous Delivery (CI/CD) by IBM', desc: 'Building pipelines using GitHub Actions, Tekton, and deploying to cloud Kubernetes.', url: 'https://www.coursera.org/learn/continuous-integration-and-continuous-delivery-ci-cd', icon: 'book', badge: 'Coursera' },
    ],
  },
  'GenAI / LLMs': {
    skill: 'GenAI / LLMs',
    practice: [
      { platform: 'LeetCode', title: 'Vector Similarity, Top-K Nearest Neighbors & Cosine Search', desc: 'Efficient dot product ranking, sparse matrix search, and semantic indexing.', url: 'https://leetcode.com/tag/math/', icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: 'Prompt Engineering & Deterministic Output Parsing', desc: 'Structured JSON output extraction, function calling schema validation.', url: 'https://www.hackerrank.com/domains/ai', icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: 'RAG Chunking & Token Window Splitting Drills', desc: 'Recursive text chunking, overlap preservation, and vector embedding pipelines.', url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: 'LangChain & LlamaIndex for RAG Applications (FreeCodeCamp)', desc: 'Building Retrieval-Augmented Generation systems, vector databases (Chroma, Pinecone), and agent tools.', url: 'https://www.youtube.com/results?search_query=langchain+rag+tutorial+freecodecamp', icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: 'Building Generative AI Applications with LangChain & OpenAI', desc: 'Prompt templates, memory chains, output parsers, and custom retrieval agents.', url: 'https://www.linkedin.com/learning/search?keywords=generative+ai+langchain', icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: 'Generative AI with Large Language Models (DeepLearning.AI & AWS)', desc: 'Transformer architectures, pre-training, fine-tuning with PEFT/LoRA, and RLHF alignment.', url: 'https://www.coursera.org/learn/generative-ai-with-llms', icon: 'book', badge: 'Coursera' },
    ],
  },
};

export function getSkillResources(skillName) {
  if (SKILL_RESOURCES[skillName]) return SKILL_RESOURCES[skillName];
  // Fuzzy match
  const key = Object.keys(SKILL_RESOURCES).find(k => k.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(k.toLowerCase()));
  if (key) return SKILL_RESOURCES[key];

  // Generic fallback with search-linked resources
  return {
    skill: skillName,
    practice: [
      { platform: 'LeetCode', title: `${skillName} Interview Problem Sets`, desc: `Practice curated coding problems and algorithms directly testing ${skillName} capabilities.`, url: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(skillName)}`, icon: 'code', badge: 'LeetCode' },
      { platform: 'HackerRank', title: `${skillName} Domain Skill Challenges`, desc: `Hands-on skill validation exercises and coding assessments for ${skillName}.`, url: `https://www.hackerrank.com/domains/search?q=${encodeURIComponent(skillName)}`, icon: 'terminal', badge: 'HackerRank' },
      { platform: 'CodeChef', title: `${skillName} Algorithmic Drills`, desc: `Timed problem-solving challenges to sharpen algorithmic efficiency in ${skillName}.`, url: 'https://www.codechef.com/practice', icon: 'cpu', badge: 'CodeChef' },
    ],
    learning: [
      { platform: 'YouTube', title: `${skillName} Masterclass & Deep Dive`, desc: `Comprehensive, highly-rated video tutorials covering architecture and real-world implementation.`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName)}+masterclass+tutorial`, icon: 'video', badge: 'YouTube' },
      { platform: 'LinkedIn Learning', title: `${skillName} Professional Training Course`, desc: `Industry-standard coursework from certified practitioners with certificate of completion.`, url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(skillName)}`, icon: 'linkedin', badge: 'LinkedIn' },
      { platform: 'Coursera', title: `${skillName} Specialization & Projects`, desc: `University-backed curriculums with guided hands-on lab environments and peer evaluations.`, url: `https://www.coursera.org/search?query=${encodeURIComponent(skillName)}`, icon: 'book', badge: 'Coursera' },
    ],
  };
}
