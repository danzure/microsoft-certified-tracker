const fs = require('fs');
const path = 'src/data/certificationPaths.js';
let data = fs.readFileSync(path, 'utf8');

const regex = /(id: 'gh-600',[\\s\\S]*?)learnUrl: 'https:\/\/resources\\.github\\.com\/learn\/certifications\/'/g;
data = data.replace(regex, `$1learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/agentic-ai-developer/?practice-assessment-type=certification'`);

fs.writeFileSync(path, data);
console.log('Done');
