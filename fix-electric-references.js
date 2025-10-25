const fs = require('fs');
const path = require('path');

// Function to recursively find all files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Function to replace electric references with trion
function replaceElectricReferences(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace electric color references with trion
  const replacements = [
    // Color classes
    { from: /from-electric-500/g, to: 'from-trion-500' },
    { from: /from-electric-600/g, to: 'from-trion-600' },
    { from: /from-electric-400/g, to: 'from-trion-400' },
    { from: /via-electric-500/g, to: 'via-trion-500' },
    { from: /via-electric-600/g, to: 'via-trion-600' },
    { from: /via-electric-400/g, to: 'via-trion-400' },
    { from: /to-electric-500/g, to: 'to-trion-500' },
    { from: /to-electric-600/g, to: 'to-trion-600' },
    { from: /to-electric-400/g, to: 'to-trion-400' },
    
    // Border and background classes
    { from: /border-electric-500/g, to: 'border-trion-500' },
    { from: /border-electric-400/g, to: 'border-trion-400' },
    { from: /border-electric-600/g, to: 'border-trion-600' },
    { from: /bg-electric-500/g, to: 'bg-trion-500' },
    { from: /bg-electric-600/g, to: 'bg-trion-600' },
    { from: /bg-electric-400/g, to: 'bg-trion-400' },
    { from: /text-electric-500/g, to: 'text-trion-500' },
    { from: /text-electric-600/g, to: 'text-trion-600' },
    { from: /text-electric-400/g, to: 'text-trion-400' },
    
    // Shadow classes
    { from: /shadow-electric-500/g, to: 'shadow-trion-500' },
    { from: /shadow-electric-600/g, to: 'shadow-trion-600' },
    { from: /shadow-electric-400/g, to: 'shadow-trion-400' },
    
    // Gradient classes
    { from: /bg-electric-gradient/g, to: 'bg-trion-gradient' },
    
    // Opacity classes
    { from: /electric-500\/20/g, to: 'trion-500/20' },
    { from: /electric-500\/30/g, to: 'trion-500/30' },
    { from: /electric-500\/10/g, to: 'trion-500/10' },
    { from: /electric-500\/5/g, to: 'trion-500/5' },
    { from: /electric-500\/25/g, to: 'trion-500/25' },
    { from: /electric-600\/20/g, to: 'trion-600/20' },
    { from: /electric-600\/30/g, to: 'trion-600/30' },
    { from: /electric-600\/10/g, to: 'trion-600/10' },
    { from: /electric-600\/15/g, to: 'trion-600/15' },
    { from: /electric-600\/5/g, to: 'trion-600/5' },
    { from: /electric-400\/50/g, to: 'trion-400/50' },
    { from: /electric-400\/30/g, to: 'trion-400/30' },
    { from: /electric-400\/20/g, to: 'trion-400/20' },
  ];

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const files = getAllFiles(srcDir);

console.log(`Found ${files.length} files to process...`);

files.forEach(file => {
  try {
    replaceElectricReferences(file);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('Done! All electric references have been updated to trion.');
