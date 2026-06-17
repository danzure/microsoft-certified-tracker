const fs = require('fs');
const file = 'c:/Users/Daniel/OneDrive/Documents/Antigravity/repositories/react-mscertification-app/src/data/certificationPaths.js';
let content = fs.readFileSync(file, 'utf8');

const examsToRemove = ['mb-210', 'mb-240', 'mb-260', 'mb-300', 'mb-335', 'mb-700'];

examsToRemove.forEach(exam => {
  const regex = new RegExp(`\\s*\\{\\s*id:\\s*'${exam}'[\\s\\S]*?retirementDate:\\s*null,\\s*\\},?`, 'g');
  content = content.replace(regex, '');
});

content = content.replace(/prerequisites:\s*\['mb-300'\]/g, 'prerequisites: []');

fs.writeFileSync(file, content);
console.log('Done');
