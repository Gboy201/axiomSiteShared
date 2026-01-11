const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

function copyFileSync(source, target) {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

console.log('Building static site for Vercel...');

// Copy HTML files from src/pages/ to public/
console.log('Copying HTML files...');
const htmlFiles = fs.readdirSync('src/pages').filter(file => file.endsWith('.html'));
htmlFiles.forEach(file => {
  const sourcePath = path.join('src/pages', file);
  const targetPath = path.join('public', file);
  console.log(`  ${file}`);
  copyFileSync(sourcePath, targetPath);
});

// Copy CSS files from src/css/ to public/css/
console.log('Copying CSS directory...');
if (!fs.existsSync('public/css')) {
  fs.mkdirSync('public/css', { recursive: true });
}
const cssFiles = fs.readdirSync('src/css');
cssFiles.forEach(file => {
  const sourcePath = path.join('src/css', file);
  const targetPath = path.join('public/css', file);
  console.log(`  css/${file}`);
  copyFileSync(sourcePath, targetPath);
});

// Copy assets directory from src/assets/ to public/assets/
console.log('Copying assets directory...');
if (fs.existsSync('src/assets')) {
  copyFolderRecursiveSync('src/assets', 'public');
}

// Copy SEO files
console.log('Copying SEO files...');
const seoFiles = ['sitemap.xml', 'robots.txt'];
seoFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ${file}`);
    copyFileSync(file, path.join('public', file));
  }
});

// Copy API directory
console.log('Copying API directory...');
if (fs.existsSync('api')) {
  copyFolderRecursiveSync('api', 'public');
}

console.log('Build complete! Files copied to public/ directory.');
console.log('Ready for Vercel deployment.');
