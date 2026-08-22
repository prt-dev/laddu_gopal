const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\updated_data\\templates\\new templates\\agttools.in\\cdn\\shop\\files';
const destDir = 'd:\\new_projects_2026_july\\gardening-tools\\public\\assets\\img\\agttools';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
let copiedCount = 0;

files.forEach(file => {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, file);
  fs.copyFileSync(srcFile, destFile);
  copiedCount++;
});

console.log(`Copied ${copiedCount} files to ${destDir}`);
