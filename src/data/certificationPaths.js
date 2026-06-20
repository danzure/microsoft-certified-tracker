// Microsoft Certification Paths Data
// Each path represents a track with stations (certifications)
// Certifications can be grouped into named branches (tracks) within each path

export const CERT_LEVELS = {
  FUNDAMENTALS: 'Fundamentals',
  ASSOCIATE: 'Associate',
  EXPERT: 'Expert',
  SPECIALTY: 'Specialty',
};

export const CERT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  NEEDS_RENEWAL: 'needs_renewal',
};

export const doesCertExpire = (level) => {
  return [CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY].includes(level);
};

export const PILLARS = {
  CLOUD_AI: 'Cloud & AI Platforms',
  BIZ_SOLUTIONS: 'AI Business Solutions',
  SECURITY: 'Security',
  RETIRED: 'Retired & Archived',
};

export const certificationPaths = [
  {
    id: 'azure-infrastructure',
    name: 'Microsoft Azure Infrastructure',
    shortName: 'Azure Infrastructure',
    code: 'AZ',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-azure)',
    glowColor: 'var(--glow-azure)',
    cssVar: '--line-azure',
    icon: 'Cloud',
    description: 'Cloud administration, networking, and architecture for Azure infrastructure.',
    branches: [
      { id: 'admin', name: 'Admin' },
      { id: 'developer', name: 'Developer' },
      { id: 'networking', name: 'Networking' },
      { id: 'hybrid', name: 'Hybrid' },
      { id: 'specialty-sap', name: 'SAP Specialty' },
      { id: 'specialty-vdi', name: 'VDI Specialty' },
    ],
    certifications: [
      {
        id: 'az-900',
        examCode: 'AZ-900',
        name: 'Azure Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate foundational knowledge of cloud concepts, core Azure services, plus Azure management and governance features and tools.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe cloud concepts (25–30%)',
        'Describe Azure architecture and services (35–40%)',
        'Describe Azure management and governance (30–35%)'
        ],
      },
      {
        id: 'az-104',
        examCode: 'AZ-104',
        name: 'Azure Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'admin',
        description: 'Demonstrate key skills to configure, manage, secure, and administer key professional functions in Microsoft Azure.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/',
        retirementDate: null,
        skillsMeasured: [
        'Manage Azure identities and governance (20–25%)',
        'Implement and manage storage (15–20%)',
        'Deploy and manage Azure compute resources (20–25%)',
        'Implement and manage virtual networking (15–20%)',
        'Monitor and maintain Azure resources (10–15%)'
        ],
      },
      {
        id: 'az-700',
        examCode: 'AZ-700',
        name: 'Azure Network Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'networking',
        description: 'Demonstrate the design, implementation, and maintenance of Azure networking infrastructure, load balancing traffic, network routing, and more. ',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-700/',
        retirementDate: null,
        skillsMeasured: [
        'Design and implement core networking infrastructure (25–30%)',
        'Design, implement, and manage connectivity services (20–25%)',
        'Design and implement application delivery services (15–20%)',
        'Design and implement private access to Azure services (10–15%)',
        'Design and implement Azure network security services (15–20%)'
        ],
      },
      {
        id: 'az-305',
        examCode: 'AZ-305',
        name: 'Azure Solutions Architect Expert',
        level: CERT_LEVELS.EXPERT,
        branch: 'admin',
        description: 'Design infrastructure, identity, data, business continuity, and application solutions on Azure.',
        prerequisites: ['az-104'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-305/',
        retirementDate: null,
        skillsMeasured: [
        'Design identity, governance, and monitoring solutions (25–30%)',
        'Design data storage solutions (20–25%)',
        'Design business continuity solutions (15–20%)',
        'Design infrastructure solutions (30–35%)'
        ],
      },
      {
        id: 'az-120',
        examCode: 'AZ-120',
        name: 'Azure for SAP Workloads Specialty',
        level: CERT_LEVELS.SPECIALTY,
        branch: 'specialty-sap',
        description: 'Demonstrate planning, migration, and operation of an SAP solution on Microsoft Azure while you leverage Azure resources.',
        prerequisites: [],
        recommendedPrereqs: ['az-104'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-120/',
        retirementDate: null,
        skillsMeasured: [
        'Migrate SAP workloads to Azure (25–30%)',
        'Design and implement an infrastructure to support SAP workloads on Azure (25–30%)',
        'Design and implement high availability and disaster recovery (HADR) (20–25%)',
        'Maintain SAP workloads on Azure (20–25%)'
        ],
      },
      {
        id: 'az-140',
        examCode: 'AZ-140',
        name: 'Azure Virtual Desktop Specialty',
        level: CERT_LEVELS.SPECIALTY,
        branch: 'specialty-vdi',
        description: 'Plan, deliver, manage, and monitor virtual desktop experiences and remote apps on Microsoft Azure for any device.',
        prerequisites: [],
        recommendedPrereqs: ['az-104'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-140/',
        retirementDate: null,
        skillsMeasured: [
        'Plan and implement an Azure Virtual Desktop infrastructure (40–45%)',
        'Plan and implement identity and security (15–20%)',
        'Plan and implement user environments and apps (20–25%)',
        'Monitor and maintain an Azure Virtual Desktop infrastructure (10–15%)'
        ],
      },
    ],
  },
  {
    id: 'ai-machine-learning',
    name: 'Microsoft Azure AI & Machine Learning',
    shortName: 'Azure AI & ML',
    code: 'AI',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-ai)',
    glowColor: 'var(--glow-ai)',
    cssVar: '--line-ai',
    icon: 'Brain',
    description: 'Build and deploy AI solutions, intelligent agents, and machine learning operations.',
    branches: [
      { id: 'cloud-ai', name: 'Cloud AI' },
      { id: 'apps-agents', name: 'Apps & Agents' },
      { id: 'mlops', name: 'MLOps' },
    ],
    certifications: [
      {
        id: 'ai-901',
        examCode: 'AI-901',
        name: 'Azure AI Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Foundational knowledge of machine learning, computer vision, NLP, and generative AI on Azure.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/',
        retirementDate: null,
        skillsMeasured: [
        'Identify AI concepts and responsibilities (40–45%)',
        'Implement AI solutions by using Microsoft Foundry (55–60%)'
        ],
      },
      {
        id: 'ai-200',
        examCode: 'AI-200',
        name: 'Azure AI Cloud Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'cloud-ai',
        description: 'This certification validates your ability to design, build, and implement AI solutions on Azure, with a focus on back‑end services, scalable architectures, and the full development lifecycle.',
        prerequisites: [],
        recommendedPrereqs: ['ai-901'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-200/',
        retirementDate: null,
        skillsMeasured: [
        'Azure SDKs and third-party SDKs used in Azure.',
        'Azure data management services.',
        'Azure monitoring and troubleshooting.',
        'Azure messaging and eventing.',
        'Vector databases.',
        'Python programming.',
        'Implementing containerized applications on Azure.'
        ],
      },
      {
        id: 'ai-103',
        examCode: 'AI-103',
        name: 'Azure AI App & Agent Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'apps-agents',
        description: 'This certification validates your expertise in designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry.',
        prerequisites: [],
        recommendedPrereqs: ['ai-901'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/',
        retirementDate: null,
        skillsMeasured: [
        'Plan and manage an Azure AI solution (25–30%)',
        'Implement generative AI and agentic solutions (30–35%)',
        'Implement computer vision solutions (10–15%)',
        'Implement text analysis solutions (10–15%)',
        'Implement information extraction solutions (10–15%)'
        ],
      },
      {
        id: 'ai-300',
        examCode: 'AI-300',
        name: 'Machine Learning Operations Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'mlops',
        description: 'Demonstrate skills setting up infrastructure for machine learning operations (MLOps) and generative AI operations (GenAIOps) solutions on Azure, together referred to as AI operations (AIOps).',
        prerequisites: [],
        recommendedPrereqs: ['ai-200'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-300/',
        retirementDate: null,
        skillsMeasured: [
        'Machine Learning.',
        'Foundry.',
        'GitHub Actions.',
        'Infrastructure as code (IaC) practices with Bicep and Azure CLI.'
        ],
      },

    ],
  },
  {
    id: 'data-engineering',
    name: 'Microsoft Data & Analytics',
    shortName: 'Data & Analytics',
    code: 'DP',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-data)',
    glowColor: 'var(--glow-data)',
    cssVar: '--line-data',
    icon: 'Database',
    description: 'Design and implement data solutions, analytics pipelines, and database systems.',
    branches: [
      { id: 'engineering', name: 'Engineering' },
      { id: 'analytics', name: 'Analytics' },
      { id: 'admin', name: 'Database Admin' },
      { id: 'specialty-cosmos', name: 'Cosmos DB Specialty' },
    ],
    certifications: [
      {
        id: 'dp-900',
        examCode: 'DP-900',
        name: 'Azure Data Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate foundational knowledge of core data concepts related to Microsoft Azure data services.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe core data concepts (25–30%)',
        'Identify considerations for relational data on Azure (20–25%)',
        'Describe considerations for working with non-relational data on Azure (15–20%)',
        'Describe an analytics workload on Azure (25–30%)'
        ],
      },
            {
        id: 'dp-700',
        examCode: 'DP-700',
        name: 'Fabric Data Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'engineering',
        description: 'As a Fabric Data Engineer, you should have subject matter expertise with data loading patterns, data architectures, and orchestration processes.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer/',
        retirementDate: null,
        skillsMeasured: [
        'Implement and manage an analytics solution (30–35%)',
        'Ingest and transform data (30–35%)',
        'Monitor and optimize an analytics solution (30–35%)'
        ],
      },
      {
        id: 'dp-750',
        examCode: 'DP-750',
        name: 'Azure Databricks Data Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'engineering',
        description: 'Build scalable, secure data pipelines for AI and analytics using Azure Databricks.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/',
        retirementDate: null,
        skillsMeasured: [
        'Set up and configure an Azure Databricks environment (15–20%)',
        'Secure and govern Unity Catalog objects (15–20%)',
        'Prepare and process data (30–35%)',
        'Deploy and maintain data pipelines and workloads (30–35%)'
        ],
      },
      {
        id: 'dp-800',
        examCode: 'DP-800',
        name: 'Data Security Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'engineering',
        description: 'Implement and manage security for data in Azure.',
        prerequisites: [],
        recommendedPrereqs: ['dp-700'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/',
        retirementDate: null,
        skillsMeasured: [
        'Design and develop database solutions (35–40%)',
        'Secure, optimize, and deploy database solutions (35–40%)',
        'Implement AI capabilities in database solutions (25–30%)'
        ],
      },
      {
        id: 'dp-300',
        examCode: 'DP-300',
        name: 'Azure Database Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'admin',
        description: 'Administer an SQL Server database infrastructure for cloud, on-premises and hybrid relational databases using the Microsoft PaaS relational database offerings.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/',
        retirementDate: null,
        skillsMeasured: [
        'Plan and implement data platform resources (15–20%)',
        'Implement a secure environment (20–25%)',
        'Monitor, configure, and optimize database resources (20–25%)',
        'Configure and manage automation of tasks (15–20%)',
        'Plan and configure a high availability and disaster recovery (HA/DR) environment (20–25%)'
        ],
      },
      {
        id: 'dp-600',
        examCode: 'DP-600',
        name: 'Fabric Analytics Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'analytics',
        description: 'As a Fabric analytics engineer associate, you should have subject matter expertise in designing, creating, and deploying enterprise-scale data analytics solutions.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-600/',
        retirementDate: null,
        skillsMeasured: [
        'Maintain a data analytics solution (25–30%)',
        'Prepare data (45–50%)',
        'Implement and manage semantic models (25–30%)'
        ],
      },
      {
        id: 'dp-420',
        examCode: 'DP-420',
        name: 'Azure Cosmos DB Developer Specialty',
        level: CERT_LEVELS.SPECIALTY,
        branch: 'specialty-cosmos',
        description: 'Write efficient queries, create indexing policies, manage, and provision resources in the SQL API and SDK with Microsoft Azure Cosmos DB.',
        prerequisites: [],
        recommendedPrereqs: ['dp-700'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-420/',
        retirementDate: null,
        skillsMeasured: [
        'Design and implement data models (35–40%)',
        'Design and implement data distribution (5–10%)',
        'Integrate an Azure Cosmos DB solution (5–10%)',
        'Optimize an Azure Cosmos DB solution (15–20%)',
        'Maintain an Azure Cosmos DB solution (25–30%)'
        ],
      },
    ],
  },
  {
    id: 'security',
    name: 'Microsoft Security, Compliance & Identity',
    shortName: 'Security & Identity',
    code: 'SC',
    pillar: PILLARS.SECURITY,
    color: 'var(--line-security)',
    glowColor: 'var(--glow-security)',
    cssVar: '--line-security',
    icon: 'Shield',
    description: 'Secure cloud environments, manage identity, and protect AI systems.',
    branches: [
      { id: 'cloud-security', name: 'Cloud Security' },
      { id: 'operations', name: 'SecOps' },
      { id: 'identity', name: 'Identity' },
      { id: 'info-sec', name: 'Info Security' },
      { id: 'business', name: 'Business' },
    ],
    certifications: [
      {
        id: 'sc-900',
        examCode: 'SC-900',
        name: 'Security, Compliance & Identity Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate foundational knowledge on security, compliance, and identity concepts and related cloud-based Microsoft solutions.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe the concepts of security, compliance, and identity (10–15%)',
        'Describe the capabilities of Microsoft Entra (25–30%)',
        'Describe the capabilities of Microsoft security solutions (35–40%)',
        'Describe the capabilities of Microsoft compliance solutions (20–25%)'
        ],
      },
      {
        id: 'sc-500',
        examCode: 'SC-500',
        name: 'Cloud & AI Security Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'cloud-security',
        description: 'This certification validates your ability to design, implement, and manage end‑to‑end security controls across Azure, hybrid, and AI-enabled environments to protect identities, data, applications, infrastructure, and maintain regulatory compliance.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/cloud-and-ai-security-engineer-associate/?wt.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        isBeta: true,
        skillsMeasured: [
        'Securing access to resources by using Microsoft Entra ID and Azure Key Vault.',
        'Enforcing security and regulatory compliance.',
        'Securing storage, databases, and networking.',
        'Securing compute.',
        'Securing AI solutions.',
        'Managing and monitoring security posture.'
        ],
      },
      {
        id: 'sc-730',
        examCode: 'SC-730',
        name: 'Cybersecurity Business Professional',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'business',
        description: 'Develop and integrate advanced, scalable AI agents using Microsoft Copilot Studio, Power Platform, and enterprise technologies to deliver robust solutions for organizations.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/cybersecurity-business-professional/',
        retirementDate: null,
        skillsMeasured: [
        'Digital reliance, and you frequently use computers, mobile devices, cloud services, and collaboration platforms to access, share, and store information.',
        'A non-technical background and limited formal training in cybersecurity. Your expertise lies in business processes rather than in IT or security operations.',
        'High exposure to cyber risks because you regularly handle sensitive data and communicate across networks, but you might not always be aware of potential risks.',
        'Responsibility for privacy and accountability for safeguarding personal and organizational information in compliance with company policies.'
        ],
      },
      {
        id: 'sc-100',
        examCode: 'SC-100',
        name: 'Cybersecurity Architect Expert',
        level: CERT_LEVELS.EXPERT,
        description: 'Design and evolve the cybersecurity strategy for an organization.',
        prerequisites: [['sc-200', 'sc-300', 'sc-500']], // Requires ONE OF these
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-100/',
        retirementDate: null,
        skillsMeasured: [
        'Design solutions that align with security best practices and priorities (20–25%)',
        'Design security operations, identity, and compliance capabilities (25–30%)',
        'Design security solutions for infrastructure (25–30%)',
        'Design security solutions for applications and data (20–25%)'
        ],
      },

      {
        id: 'sc-200',
        examCode: 'SC-200',
        name: 'Security Operations Analyst Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'operations',
        description: 'Investigate, search for, and mitigate threats using Microsoft Sentinel, Microsoft Defender for Cloud, and Microsoft 365 Defender.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-200/',
        retirementDate: null,
        skillsMeasured: [
        'Manage a security operations environment (40–45%)',
        'Respond to security incidents (35–40%)',
        'Perform threat hunting (20–25%)'
        ],
      },
      {
        id: 'sc-300',
        examCode: 'SC-300',
        name: 'Identity and Access Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'identity',
        description: 'Demonstrate the features of Microsoft Entra ID to modernize identity solutions, implement hybrid solutions, and implement identity governance.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-300/',
        retirementDate: null,
        skillsMeasured: [
        'Implement and manage user identities (20–25%)',
        'Implement authentication and access management (25–30%)',
        'Plan and implement workload identities (20–25%)',
        'Plan and automate identity governance (20–25%)'
        ],
      },
      {
        id: 'sc-401',
        examCode: 'SC-401',
        name: 'Information Security Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'info-sec',
        description: 'As an Information Security Administrator, you plan and implement information security of sensitive data by using Microsoft Purview and related services.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-401/',
        retirementDate: null,
        skillsMeasured: [
        'Implement information protection (30–35%)',
        'Implement data loss prevention and retention (30–35%)',
        'Manage risks, alerts, and activities (30–35%)'
        ],
      },

    ],
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    shortName: 'Microsoft 365',
    code: 'MS',
    pillar: PILLARS.BIZ_SOLUTIONS,
    color: 'var(--line-m365)',
    glowColor: 'var(--glow-m365)',
    cssVar: '--line-m365',
    icon: 'Monitor',
    description: 'Administer, secure, and optimize Microsoft 365 and modern workplace solutions.',
    branches: [
      { id: 'admin', name: 'Admin' },
      { id: 'endpoint', name: 'Endpoint' },
      { id: 'messaging', name: 'Messaging' },
      { id: 'teams', name: 'Teams' },
      { id: 'collab', name: 'Collaboration' },
    ],
    certifications: [
      {
        id: 'ms-102',
        examCode: 'MS-102',
        name: 'Microsoft 365 Administrator',
        level: CERT_LEVELS.EXPERT,
        description: 'Deploy, configure, and manage Microsoft 365 tenants including identity, security, and compliance.',
        prerequisites: [['md-102', 'ms-700', 'sc-300', 'sc-401']],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-102/',
        retirementDate: null,
        skillsMeasured: [
        'Deploy and manage a Microsoft 365 tenant (25–30%)',
        'Implement and manage Microsoft Entra identity and access (25–30%)',
        'Manage security and threats by using Microsoft Defender XDR (30–35%)',
        'Manage compliance by using Microsoft Purview (10–15%)'
        ],
      },
      {
        id: 'md-102',
        examCode: 'MD-102',
        name: 'Endpoint Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'endpoint',
        description: 'Plan and execute an endpoint deployment strategy, using essential elements of modern management, co-management approaches, and Microsoft Intune integration.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/md-102/',
        retirementDate: null,
        skillsMeasured: [
        'Prepare infrastructure for devices (25–30%)',
        'Manage and maintain devices (30–35%)',
        'Manage applications (15–20%)',
        'Protect devices (15–20%)'
        ],
      },
      {
        id: 'ms-700',
        examCode: 'MS-700',
        name: 'Teams Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'teams',
        description: 'Demonstrate skills to plan, deploy, configure, and manage Microsoft Teams to focus on efficient and effective collaboration and communication in a Microsoft 365 environment. ',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-700/',
        retirementDate: null,
        skillsMeasured: [
        'Configure and manage a Teams environment (40–45%)',
        'Manage teams, channels, chats, and apps (20–25%)',
        'Manage meetings and calling (15–20%)',
        'Monitor, report on, and troubleshoot Teams (15–20%)'
        ],
      },
      {
        id: 'ms-721',
        examCode: 'MS-721',
        name: 'Collaboration Communications Systems Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'collab',
        description: 'Demonstrate skills to configure, deploy, monitor, and manage Microsoft Teams Phone, meetings, and certified devices.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-721/',
        retirementDate: null,
        skillsMeasured: [
        'Plan and design collaboration communications systems (20–25%)',
        'Configure and manage Teams meetings, webinars, and town halls (15–20%)',
        'Configure and manage Teams Phone (30–35%)',
        'Configure and manage Teams Rooms and devices (20–25%)'
        ],
      },
    ],
  },
  {
    id: 'power-platform',
    name: 'Microsoft Power Platform',
    shortName: 'Power Platform',
    code: 'PL',
    pillar: PILLARS.BIZ_SOLUTIONS,
    color: 'var(--line-power)',
    glowColor: 'var(--glow-power)',
    cssVar: '--line-power',
    icon: 'Zap',
    description: 'Build low-code applications, automate workflows, and analyze data with Power Platform.',
    branches: [
      { id: 'functional', name: 'Functional' },
      { id: 'developer', name: 'Developer' },
      { id: 'analyst', name: 'Analyst' },
      { id: 'rpa', name: 'RPA' },
    ],
    certifications: [
      {
        id: 'pl-900',
        examCode: 'PL-900',
        name: 'Power Platform Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate the business value and product capabilities of Microsoft Power Platform, such as Power Apps, data connections with Dataverse, and Power Automate.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe the business value of Microsoft Power Platform (15–20%)',
        'Manage the Microsoft Power Platform environment (15–20%)',
        'Demonstrate the capabilities of Power Apps (25–30%)',
        'Demonstrate the capabilities of Power Automate (15–20%)',
        'Demonstrate the capabilities of Power Pages (10–15%)'
        ],
      },
      {
        id: 'pl-300',
        examCode: 'PL-300',
        name: 'Power BI Data Analyst Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'analyst',
        description: 'Demonstrate methods and best practices that align with business and technical requirements for modeling, visualizing, and analyzing data with Microsoft Power BI.',
        prerequisites: [],
        recommendedPrereqs: ['pl-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-300/',
        retirementDate: null,
        skillsMeasured: [
        'Prepare the data (25–30%)',
        'Model the data (25–30%)',
        'Visualize and analyze the data (25–30%)',
        'Manage and secure Power BI (15–20%)'
        ],
      },
      {
        id: 'pl-600',
        examCode: 'PL-600',
        name: 'Power Platform Solution Architect Expert',
        level: CERT_LEVELS.EXPERT,
        branch: 'functional',
        description: 'Design and architect complex business solutions using the Power Platform.',
        prerequisites: ['pl-200'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-600/',
        retirementDate: null,
        skillsMeasured: [
        'Perform solution envisioning and requirement analysis (45–50%)',
        'Architect a solution (35–40%)',
        'Implement the solution (15–20%)'
        ],
      },
      {
        id: 'pl-400',
        examCode: 'PL-400',
        name: 'Power Platform Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'developer',
        description: 'Demonstrate how to simplify, automate, and transform business tasks and processes using Microsoft Power Platform Developer.',
        prerequisites: [],
        recommendedPrereqs: ['pl-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-400/',
        retirementDate: null,
        skillsMeasured: [
        'Create a technical design (10–15%)',
        'Build Power Platform solutions (10–15%)',
        'Implement Power Apps improvements (10–15%)',
        'Extend the user experience (10–15%)',
        'Extend the platform (30–35%)',
        'Develop integrations (10–15%)'
        ],
      },
    ],
  },
  {
    id: 'agentic-ai',
    name: 'Microsoft Copilot & AI Agents',
    shortName: 'Copilot & AI',
    code: 'AB',
    pillar: PILLARS.BIZ_SOLUTIONS,
    color: 'var(--line-agentic)',
    glowColor: 'var(--glow-agentic)',
    cssVar: '--line-agentic',
    icon: 'Bot',
    description: 'Build and architect AI-powered business solutions with Copilot and autonomous agents.',
    branches: [
      { id: 'sales', name: 'Sales' },
      { id: 'contact-center', name: 'Contact Center' },
      { id: 'builder', name: 'Agent Builder' },
      { id: 'business', name: 'Business' },
      { id: 'leadership', name: 'Leadership' },
    ],
    certifications: [
      {
        id: 'ab-900',
        examCode: 'AB-900',
        name: 'Copilot & Agent Admin Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate how to support, secure, and protect an AI-enabled Microsoft 365 environment.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-900/',
        retirementDate: null,
        skillsMeasured: [
        'Identify the core features and objects of Microsoft 365 services (30–35%)',
        'Understand data protection and governance tasks for Microsoft 365 and Copilot (35–40%)',
        'Perform basic administrative tasks for Copilot and agents (25–30%)'
        ],
      },
      {
        id: 'ab-210',
        examCode: 'AB-210',
        name: 'Dynamics 365 Sales AI Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'sales',
        description: 'This certification validates your ability to design and implement AI‑enhanced sales solutions in Dynamics 365 Sales that support intelligent seller workflows across the lead‑to‑cash process.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-210/',
        retirementDate: null,
        skillsMeasured: [
        'Configure Dynamics 365 Sales core features.',
        'Deploy, manage, and monitor agents in Sales.',
        'Implement collaboration features.',
        'Tailor AI-powered intelligence features.'
        ],
      },
      {
        id: 'ab-250',
        examCode: 'AB-250',
        name: 'AI Contact Center Specialist',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'contact-center',
        description: 'Design and deploy AI-powered contact center solutions with autonomous agents.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/',
        retirementDate: null,
        skillsMeasured: [
        'Configuring workstreams and engagement channels.',
        'Designing, managing, and implementing routing strategies.',
        'Configuring service representative profiles and experiences.',
        'Enabling productivity tools, including Microsoft Copilot–assisted guidance.',
        'Implementing and managing agents for customer self-service.',
        'Identifying implementation opportunities for and managing service-oriented autonomous agents.',
        'Working with Dynamics 365 Contact Center tools for continuous improvement.',
        'Monitoring and resolving operational issues identified in the contact center.',
        'Configuring proactive engagement capabilities, including outbound dial modes and journey orchestration.',
        'Configuring workforce management capabilities, including demand forecasting, scheduling, and skills alignment.'
        ],
        isBeta: true,
      },
      {
        id: 'ab-410',
        examCode: 'AB-410',
        name: 'Intelligent Applications Builder Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'builder',
        description: 'This certification validates your ability to design, build, and implement AI-powered solutions using Microsoft Power Platform, leveraging Copilot, low-code tools, and integrated data experiences.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/intelligent-applications-builder-associate/?wt.mc_id=credentials_AB410_blog_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Developing Dataverse data models, model-driven apps, and canvas apps.',
        'Integrating agents and Copilot features into canvas apps, model-driven apps, and Power Pages sites.',
        'Creating cloud flows and business logic.'
        ],
      },
      {
        id: 'ab-700',
        examCode: 'AB-700',
        name: 'AI Business Professional',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'business',
        description: 'Candidates for this Microsoft Certification should be adept at using generative AI productivity tools and core Microsoft 365 apps to enhance business outcomes and decision-making, without requiring coding or app development skills.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/ai-business-professional/?practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Understand core concepts of AB-700',
        'Implement and manage AB-700 workloads',
        'Optimize and monitor AB-700 environments',
        'Secure AB-700 solutions'
        ],
      },
      {
        id: 'ab-701',
        examCode: 'AB-701',
        name: 'AI Transformation Leader',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'leadership',
        description: 'This Microsoft Certification is for business decision-makers who guide AI transformation and innovation with Microsoft 365 Copilot, Azure AI, and Microsoft Foundry, without requiring coding skills.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/ai-transformation-leader/?practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Understand core concepts of AB-701',
        'Implement and manage AB-701 workloads',
        'Optimize and monitor AB-701 environments',
        'Secure AB-701 solutions'
        ],
      },
      {
        id: 'ab-100',
        examCode: 'AB-100',
        name: 'Agentic AI Solutions Architect Expert',
        level: CERT_LEVELS.EXPERT,
        branch: 'builder',
        description: 'As an AI-first solution architect, you lead the transformation of enterprise operations by envisioning and implementing AI-powered architecture.',
        prerequisites: ['ab-410'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/',
        retirementDate: null,
        skillsMeasured: [
        'Expertise in architecting solutions that use AI, including generative AI and various Foundry Tools tailored to meet business objectives.',
        'The ability to design agentic-first solutions.',
        'Skills in designing multi-agent orchestrated solutions.',
        'Experience designing secure and scalable cross-platform AI solutions.',
        'Comprehensive knowledge of core Dynamics 365 products, Microsoft Power Platform, Microsoft Copilot Studio, Microsoft Foundry Tools, and Foundry Models.',
        'Proficiency in working with agents created by using Copilot Studio, AI prompts, Microsoft Foundry, and working knowledge of multiple language models to create intelligent solutions.',
        'Proficiency in adopting frameworks and delivering measurable outcomes aligned with enterprise success metrics and architecture patterns.',
        'Expertise in working with open standards and protocols, including Agent2Agent (A2A) and Model Context Protocol (MCP).',
        'Expertise in responsible AI practices, helping to ensure compliance and advocating for the Microsoft responsible AI guidelines.',
        'Strong leadership in orchestrating AI features in Microsoft business applications to optimize operations and unlock growth opportunities.',
        'Skills in securing AI models and data workflows, including detecting and resolving vulnerabilities, enforcing data residency and access controls, safeguarding model tuning, tracking changes, maintaining audit trails, and defending against prompt manipulation.',
        'Experience in monitoring agent performance and interpreting telemetry data to help ensure reliability, optimize behavior, and drive continuous improvement.',
        'Ability to conduct a return-on-investment (ROI) analysis of an AI-powered solution.'
        ],
      }
    ],
  },
  {
    id: 'dynamics-365',
    name: 'Microsoft Dynamics 365',
    shortName: 'Dynamics 365',
    code: 'MB',
    pillar: PILLARS.BIZ_SOLUTIONS,
    color: 'var(--line-dynamics)',
    glowColor: 'var(--glow-dynamics)',
    cssVar: '--line-dynamics',
    icon: 'Briefcase',
    description: 'Implement, customize, and maintain Dynamics 365 business applications.',
    branches: [
      { id: 'sales-service', name: 'Sales & Service' },
      { id: 'finance-ops', name: 'Finance & Operations' },
      { id: 'bc', name: 'Business Central' },
    ],
    certifications: [
      {
        id: 'mb-230',
        examCode: 'MB-230',
        name: 'Dynamics 365 Customer Service Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'sales-service',
        description: 'Build CX solutions that are fast, agile, and leverage AI.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-230/',
        retirementDate: null,
        skillsMeasured: [
        'Manage cases in Customer Service (51–55%)',
        'Configure representative experience and routing (25–30%)',
        'Extend Customer Service (15–20%)'
        ],
      },
      {
        id: 'mb-310',
        examCode: 'MB-310',
        name: 'Dynamics 365 Finance Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'finance-ops',
        description: 'Analyze and translate financial business requirements into processes and solutions that implement industry recommended practices.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-310/',
        retirementDate: null,
        skillsMeasured: [
        'Implement financial management (40–45%)',
        'Implement accounts receivable, credit, collections, and subscription billing (15–20%)',
        'Implement and manage accounts payable and expenses (10–15%)',
        'Manage budgeting (10–15%)',
        'Manage fixed assets (10–15%)'
        ],
      },
      {
        id: 'mb-330',
        examCode: 'MB-330',
        name: 'Dynamics 365 Supply Chain Management Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'finance-ops',
        description: 'Design and configure Dynamics 365 Supply chain Management and related tools.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-330/',
        retirementDate: null,
        skillsMeasured: [
        'Implement product information management (25–30%)',
        'Implement inventory and asset management (20–25%)',
        'Implement and manage supply chain processes (15–20%)',
        'Implement warehouse management and transportation management (20–25%)',
        'Implement master planning (10–15%)'
        ],
      },
      {
        id: 'mb-500',
        examCode: 'MB-500',
        name: 'Dynamics 365 Finance and Operations Apps Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'finance-ops',
        description: 'Implement and extend finance and operation apps in Microsoft Dynamics 365.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-500/',
        retirementDate: null,
        skillsMeasured: [
        'Plan the architecture and solution design (5–10%)',
        'Apply developer tools (5–10%)',
        'Design and develop AOT elements (15–20%)',
        'Develop and test code (20–25%)',
        'Implement reporting (10–15%)',
        'Integrate and manage data solutions (15–20%)',
        'Implement security and optimize performance (10–15%)'
        ],
      },
      {
        id: 'mb-800',
        examCode: 'MB-800',
        name: 'Dynamics 365 Business Central Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'bc',
        description: 'As a functional consultant, you implement core application setup processes for small and medium businesses. You configure the application in collaboration with the implementation team to provide the business with manageability and ease of use.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-800/',
        retirementDate: null,
        skillsMeasured: [
        'Set up Business Central (20–25%)',
        'Configure financials (30–35%)',
        'Configure sales and purchasing (10–15%)',
        'Perform Business Central operations (30–35%)'
        ],
      },
      {
        id: 'mb-820',
        examCode: 'MB-820',
        name: 'Dynamics 365 Business Central Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'bc',
        description: 'Demonstrate you have the skills to design, develop, test, and maintain solutions based on Dynamics 365 Business Central.',
        prerequisites: ['mb-800'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-820/',
        retirementDate: null,
        skillsMeasured: [
        'Describe Business Central (10–15%)',
        'Install, develop, and deploy for Business Central (10–15%)',
        'Develop by using AL objects (35–40%)',
        'Develop by using AL (15–20%)',
        'Work with development tools (10–15%)',
        'Integrate Business Central with other applications (10–15%)'
        ],
      },
    ],
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps',
    shortName: 'Azure DevOps',
    code: 'AZ',
    pillar: PILLARS.CLOUD_AI,
    color: '#0078d4',
    glowColor: 'rgba(0, 120, 212, 0.2)',
    cssVar: '--line-devops',
    icon: 'AzureDevOps',
    description: 'Design and implement DevOps practices for version control, compliance, CI/CD, and monitoring.',
    branches: [],
    certifications: [
      {
        id: 'az-900',
        examCode: 'AZ-900',
        name: 'Azure Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate foundational knowledge of cloud concepts, core Azure services, plus Azure management and governance features and tools.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe cloud concepts (25–30%)',
        'Describe Azure architecture and services (35–40%)',
        'Describe Azure management and governance (30–35%)'
        ],
        isShared: true,
        sharedWith: 'azure-infrastructure',
      },
      {
        id: 'az-104',
        examCode: 'AZ-104',
        name: 'Azure Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        description: 'Demonstrate key skills to configure, manage, secure, and administer key professional functions in Microsoft Azure.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/',
        retirementDate: null,
        skillsMeasured: [
        'Manage Azure identities and governance (20–25%)',
        'Implement and manage storage (15–20%)',
        'Deploy and manage Azure compute resources (20–25%)',
        'Implement and manage virtual networking (15–20%)',
        'Monitor and maintain Azure resources (10–15%)'
        ],
        isShared: true,
        sharedWith: 'azure-infrastructure',
      },
      {
        id: 'az-400',
        examCode: 'AZ-400',
        name: 'DevOps Engineer Expert',
        level: CERT_LEVELS.EXPERT,
        description: 'Design and implement DevOps practices for version control, compliance, CI/CD, and monitoring.',
        prerequisites: [],
        recommendedPrereqs: ['az-104'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-400/',
        retirementDate: null,
        skillsMeasured: [
        'Design and implement processes and communications (10–15%)',
        'Design and implement a source control strategy (10–15%)',
        'Design and implement build and release pipelines (50–55%)',
        'Develop a security and compliance plan (10–15%)',
        'Implement an instrumentation strategy (5–10%)'
        ],
      },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    shortName: 'GitHub',
    code: 'GH',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-github)',
    glowColor: 'var(--glow-github)',
    cssVar: '--line-github',
    icon: 'GitHub',
    description: 'Automate software development workflows, pipeline optimization, and AI integrations with GitHub.',
    branches: [
      { id: 'devops', name: 'DevOps' },
      { id: 'security', name: 'Security' },
      { id: 'ai', name: 'AI' },
    ],
    certifications: [
      {
        id: 'gh-foundations',
        examCode: 'GH-900',
        name: 'GitHub Foundations',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Validates fundamental knowledge of Git, GitHub products, collaboration, and repository management.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-foundations/?WT.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Understand core concepts of GH-900',
        'Implement and manage GH-900 workloads',
        'Optimize and monitor GH-900 environments',
        'Secure GH-900 solutions'
        ],
      },
      {
        id: 'gh-actions',
        examCode: 'GH-200',
        name: 'GitHub Actions',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'devops',
        description: 'Focuses on automating software development workflows, pipeline optimization, and task automation.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-actions/?WT.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Author and manage workflows (20–25%)',
        'Consume and troubleshoot workflows (15–20%)',
        'Author and maintain actions (15–20%)',
        'Manage GitHub Actions for the enterprise (20–25%)',
        'Secure and optimize automation (10–15%)'
        ],
      },
      {
        id: 'gh-security',
        examCode: 'GH-AdvancedSec',
        name: 'GitHub Advanced Security',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'security',
        description: 'Covers security implementation, vulnerability identification, and managing security within the development lifecycle.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-advanced-security/?practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Understand core concepts of GH-AdvancedSec',
        'Implement and manage GH-AdvancedSec workloads',
        'Optimize and monitor GH-AdvancedSec environments',
        'Secure GH-AdvancedSec solutions'
        ],
      },
      {
        id: 'gh-admin',
        examCode: 'GH-100',
        name: 'GitHub Administration',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'devops',
        description: 'Validates the ability to manage and optimize GitHub environments, including repository management and collaboration.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-administration/?WT.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Manage GitHub identities and access (15–20%)',
        'Administer GitHub Enterprise environment (10–15%)',
        'Implement secure software development and compliance (25–30%)',
        'Manage GitHub Actions (20–25%)',
        'Monitor and optimize GitHub usage (10–15%)'
        ],
      },
      {
        id: 'gh-copilot',
        examCode: 'GH-300',
        name: 'GitHub Copilot',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'ai',
        description: 'Focuses on using GitHub Copilot, covering prompt engineering, responsible AI, and integrating AI into development workflows.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-copilot/?WT.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Use GitHub Copilot responsibly (15–20%)',
        'Use GitHub Copilot features (25–30%)',
        'GitHub Copilot features (25–30%)',
        'Understand GitHub Copilot data and architecture (10–15%)',
        'Apply prompt engineering and context crafting (10–15%)',
        'Improve developer productivity with GitHub Copilot (10–15%)',
        'Configure privacy, content exclusions, and safeguards (10–15%)'
        ],
      },
      {
        id: 'gh-600',
        examCode: 'GH-600',
        name: 'GitHub Agentic AI Developer',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'ai',
        description: 'Develop agentic workflows and advanced AI integrations on GitHub.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/agentic-ai-developer/?practice-assessment-type=certification',
        retirementDate: null,
        isBeta: true,
        skillsMeasured: [
        'Operating agent workflows inside the SDLC',
        'Supervising autonomous behavior with GitHub controls',
        'Evaluating and tuning agent outputs using scans and artifacts',
        'Configuring custom agents',
        'Coordinating multi-agent execution safely'
        ],
      }
    ],
  },
  {
    id: 'retired-exams',
    name: 'Retired Certifications',
    shortName: 'Retired Exams',
    code: 'ARCHIVE',
    pillar: PILLARS.RETIRED,
    color: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    cssVar: '--line-retired',
    icon: 'Archive',
    description: 'A collection of historically retired or soon-to-be retired certifications.',
    branches: [
      { id: 'retiring', name: 'Retiring Soon', isIndependent: true },
      { id: 'retired', name: 'Already Retired', isIndependent: true },
    ],
    certifications: [
      {
        id: 'az-800',
        examCode: 'AZ-800/801',
        name: 'Windows Server Hybrid Admin Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retiring',
        description: 'Configure and manage Windows Server on-premises, hybrid, and IaaS workloads.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-800/',
        retirementDate: '2026-09-30',
        skillsMeasured: [
        'Understand core concepts of AZ-800/801',
        'Implement and manage AZ-800/801 workloads',
        'Optimize and monitor AZ-800/801 environments',
        'Secure AZ-800/801 solutions'
        ],
        isIndependent: true,
      },
      {
        id: 'az-204',
        examCode: 'AZ-204',
        name: 'Azure Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retiring',
        description: 'Build end-to-end solutions in Microsoft Azure to create Azure Functions, implement and manage web apps, develop solutions utilizing Azure storage, and more.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-204/',
        retirementDate: '2026-07-31',
        skillsMeasured: [
        'Develop Azure compute solutions (25–30%)',
        'Develop for Azure storage (15–20%)',
        'Implement Azure security (15–20%)',
        'Monitor, troubleshoot, and optimize Azure solutions (5–10%)',
        'Connect to and consume Azure services and third-party services (20–25%)'
        ],
        isIndependent: true,
      },
      {
        id: 'pl-200',
        examCode: 'PL-200',
        name: 'Power Platform Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retiring',
        description: 'Configure Dataverse, Power Apps, Power Automate, and chatbots for business solutions.',
        prerequisites: [],
        recommendedPrereqs: ['pl-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-200/',
        retirementDate: '2026-08-31',
        skillsMeasured: [
        'Configure Microsoft Dataverse (25–30%)',
        'Create apps by using Microsoft Power Apps (25–30%)',
        'Create and manage logic and process automation (25–30%)',
        'Manage environments (15–20%)'
        ],
        isIndependent: true,
      },
      {
        id: 'pl-500',
        examCode: 'PL-500',
        name: 'Power Automate RPA Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retiring',
        description: 'Demonstrate how to improve and automate workflows with Microsoft Power Automate RPA developer.',
        prerequisites: [],
        recommendedPrereqs: ['pl-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-500/',
        retirementDate: '2026-06-30',
        skillsMeasured: [
        'Design automations (25–30%)',
        'Develop automations (45–50%)',
        'Deploy and manage automations (20–25%)'
        ],
        isIndependent: true,
      },
      {
        id: 'ms-900',
        examCode: 'MS-900',
        name: 'Microsoft 365 Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        branch: 'retired',
        description: 'Demonstrate understanding of Microsoft 365, to deliver industry-leading productivity apps along with intelligent cloud services, and world-class security.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-900/',
        retirementDate: '2026-03-31',
        skillsMeasured: [
        'Describe cloud concepts (5–10%)',
        'Describe Microsoft 365 apps and services (45–50%)',
        'Describe security, compliance, privacy, and trust in Microsoft 365 (25–30%)',
        'Describe Microsoft 365 pricing, licensing, and support (10–15%)'
        ],
        isIndependent: true,
      },
      {
        id: 'dp-203',
        examCode: 'DP-203',
        name: 'Azure Data Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retired',
        description: 'Demonstrate understanding of common data engineering tasks to implement and manage data engineering workloads on Microsoft Azure, using a number of Azure services.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-203/',
        retirementDate: '2025-03-31',
        skillsMeasured: [
        'Design and implement data storage (15–20%)',
        'Develop data processing (40–45%)',
        'Secure, monitor, and optimize data storage and data processing (30–35%)'
        ],
        isIndependent: true,
      },
      {
        id: 'ms-203',
        examCode: 'MS-203',
        name: 'Messaging Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retired',
        description: 'Microsoft 365 messaging administrators are responsible for managing recipients, mailboxes, transport, mail flow, administrative roles, threat protection, compliance, migrations, and client connectivity.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/m365-messaging-administrator/',
        retirementDate: '2023-12-31',
        skillsMeasured: [
        'Understand core concepts of MS-203',
        'Implement and manage MS-203 workloads',
        'Optimize and monitor MS-203 environments',
        'Secure MS-203 solutions'
        ],
        isIndependent: true,
      },
    ]
  }
];

// Helper to get a path by ID
export const getPathById = (pathId) => certificationPaths.find((p) => p.id === pathId);

// Helper to get a certification by ID across all paths
export const getCertById = (certId) => {
  for (const path of certificationPaths) {
    const cert = path.certifications.find((c) => c.id === certId);
    if (cert) return { cert, path };
  }
  return null;
};

// Get all certifications flat
export const getAllCertifications = () =>
  certificationPaths.flatMap((path) =>
    path.certifications.map((cert) => ({ ...cert, pathId: path.id, pathName: path.name, pathColor: path.color }))
  );

// Helper to get certifications that require a specific certification
export const getCertificationsRequiring = (certId) => {
  return getAllCertifications().filter((c) => {
    if (!c.prerequisites) return false;
    return c.prerequisites.some((prereq) => {
      if (Array.isArray(prereq)) {
        return prereq.includes(certId);
      }
      return prereq === certId;
    });
  });
};

// Helper to get branch info for a certification
export const getBranchForCert = (path, cert) => {
  if (!cert.branch || !path.branches) return null;
  return path.branches.find((b) => b.id === cert.branch) || null;
};

// Level order for sorting
export const LEVEL_ORDER = {
  [CERT_LEVELS.FUNDAMENTALS]: 0,
  [CERT_LEVELS.ASSOCIATE]: 1,
  [CERT_LEVELS.EXPERT]: 2,
  [CERT_LEVELS.SPECIALTY]: 3,
};
