const fs = require('fs');
const file = 'c:/Users/Daniel/OneDrive/Documents/Antigravity/repositories/react-mscertification-app/src/data/certificationPaths.js';
let content = fs.readFileSync(file, 'utf8');

const devopsOld = `    id: 'devops',
    name: 'DevOps',
    shortName: 'DevOps',
    code: 'AZ',
    pillar: PILLARS.CLOUD_AI,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.2)',
    cssVar: '--line-devops',
    icon: 'GitBranch',
    description: 'Combine development and operations practices to deliver solutions continuously.',
    branches: [
      { id: 'admin', name: 'Administrator Track' },
    ],`;

const devopsNew = `    id: 'devops',
    name: 'DevOps & GitHub',
    shortName: 'DevOps & GitHub',
    code: 'AZ/GH',
    pillar: PILLARS.CLOUD_AI,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.2)',
    cssVar: '--line-devops',
    icon: 'GitBranch',
    description: 'Combine development and operations practices with GitHub workflows, actions, and security.',
    branches: [
      { id: 'admin', name: 'Azure Admin Track' },
      { id: 'gh-devops', name: 'GitHub DevOps Track' },
      { id: 'gh-security', name: 'GitHub Security Track' },
      { id: 'gh-ai', name: 'GitHub AI Track' },
    ],`;

content = content.replace(devopsOld, devopsNew);

// Extract GitHub certifications
const githubRegex = /    id: 'github',[\s\S]*?certifications: \[\s*([\s\S]*?)\s*\]\s*\},\s*\];/;
const githubMatch = content.match(githubRegex);
if (!githubMatch) {
  console.log("Could not find GitHub array");
  process.exit(1);
}

let githubCerts = githubMatch[1];
// Update branch names in GitHub certs
githubCerts = githubCerts.replace(/branch: 'devops',/g, "branch: 'gh-devops',");
githubCerts = githubCerts.replace(/branch: 'security',/g, "branch: 'gh-security',");
githubCerts = githubCerts.replace(/branch: 'ai',/g, "branch: 'gh-ai',");

// Insert into DevOps
const devopsEndStr = `        id: 'az-400',
        examCode: 'AZ-400',
        name: 'DevOps Engineer Expert',
        level: CERT_LEVELS.EXPERT,
        description: 'Design and implement DevOps practices for version control, compliance, CI/CD, and monitoring.',
        prerequisites: ['az-104-devops'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-400/',
        retirementDate: null,
      },`;

content = content.replace(devopsEndStr, devopsEndStr + '\n' + githubCerts);

// Delete the GitHub path
const githubFull = `    },
    {
      id: 'github',`;

const githubPathRegex = /\s*\},[\s\n]*\{\s*id: 'github',[\s\S]*?\]\s*\},/g;
content = content.replace(githubPathRegex, '\n    }');

fs.writeFileSync(file, content);
console.log('Merge complete!');
