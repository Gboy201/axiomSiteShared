const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Files and directories to copy to public
const itemsToCopy = [
    'index.html',
    'apply.html',
    'about.html',
    'contact.html',
    'schedule.html',
    'sponsors.html',
    'team.html',
    'thank-you.html',
    'styles.css',
    'game.js',
    'arrow.png',
    'portal.png',
    'Portal V1.png',
    'dragon.gif',
    'map.png',
    'map V1.png',
    'map V2.png',
    'mapV3.png',
    'Component 1.png',
    'Component 2.png',
    'Component V1.png',
    'crystalCave.png',
    'ycf.png',
    'orc.png',
    'scheduale.png',
    'schedualeimg.png',
    'block-craft-font'
];

// Function to copy file or directory recursively
function copyRecursive(src, dest) {
    if (fs.existsSync(src)) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
            // Create directory if it doesn't exist
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            // Copy all files in directory
            const files = fs.readdirSync(src);
            files.forEach(file => {
                copyRecursive(path.join(src, file), path.join(dest, file));
            });
        } else {
            // Copy file
            fs.copyFileSync(src, dest);
            console.log(`Copied: ${src} -> ${dest}`);
        }
    } else {
        console.log(`Warning: ${src} not found, skipping...`);
    }
}

// Copy all items to public directory
console.log('Building static site to public directory...');
itemsToCopy.forEach(item => {
    const srcPath = item;
    const destPath = path.join('public', item);
    copyRecursive(srcPath, destPath);
});

console.log('✅ Build completed! Static files copied to public directory.');