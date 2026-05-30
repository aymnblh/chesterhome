const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');
const oldUrl = 'http://localhost:5000';
const newUrl = 'https://chesterhome.onrender.com';

function replaceInDir(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const filePath = path.join(currentDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      replaceInDir(filePath);
    } else if (filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(oldUrl)) {
        content = content.split(oldUrl).join(newUrl);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  }
}

replaceInDir(dir);
console.log('API URL update complete.');
