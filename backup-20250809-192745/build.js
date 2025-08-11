const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Files and directories to copy to public/
const itemsToCopy = [
  // HTML files
  'index.html',
  'apply.html',
  'about.html',
  'contact.html',
  'schedule.html',
  'sponsors.html',
  'team.html',
  'thank-you.html',
  
  // CSS and JS files
  'styles.css',
  'stylesteam.css',
  'game.js',
  
  // Image files
  'map.png',
  'Component 1.png',
  'Component 2.png',
  'portal.png',
  'dragon.gif',
  'crystalCave.png',
  'bg.png',
  'goback.png',
  'ycf.png',
  'favicon.png',
  'arrow.png',
  'schedualeimg.png',
  
  // Font directories
  'block-craft-font',
  'Inconsolata',
  
  // API directory
  'api'
];

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
    fs.mkdirSync(targetFolder);
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

console.log('📦 Building static site for Vercel...');

// Copy each item to public/
itemsToCopy.forEach(item => {
  if (fs.existsSync(item)) {
    if (fs.lstatSync(item).isDirectory()) {
      console.log(`📁 Copying directory: ${item}`);
      copyFolderRecursiveSync(item, 'public');
    } else {
      console.log(`📄 Copying file: ${item}`);
      copyFileSync(item, path.join('public', item));
    }
  } else {
    console.log(`⚠️  File not found: ${item}`);
  }
});

console.log('✅ Build complete! Files copied to public/ directory.');
console.log('🚀 Ready for Vercel deployment.');