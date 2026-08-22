const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\updated_data\\templates\\new templates\\agttools.in';

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchFiles(fullPath);
    } else if (file.endsWith('.html') || file.endsWith('.txt')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for phone, email, address, store name
      const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const phoneMatches = content.match(/(?:\+91[\s-]?)?[6-9]\d{9}/g) || [];
      
      if (emailMatches.length > 0 || phoneMatches.length > 0) {
        console.log('File:', fullPath);
        if (emailMatches.length > 0) console.log('  Emails:', Array.from(new Set(emailMatches)));
        if (phoneMatches.length > 0) console.log('  Phones:', Array.from(new Set(phoneMatches)));
      }
    }
  }
}

searchFiles(targetDir);
