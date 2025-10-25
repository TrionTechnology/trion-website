const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx files
function findTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(findTsxFiles(filePath));
      }
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to replace electric references with trion
function fixElectricReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace text-electric-300 with text-trion-300
    if (content.includes('text-electric-300')) {
      content = content.replace(/text-electric-300/g, 'text-trion-300');
      modified = true;
    }
    
    // Replace shadow-electric with shadow-trion
    if (content.includes('shadow-electric')) {
      content = content.replace(/shadow-electric/g, 'shadow-trion');
      modified = true;
    }
    
    // Replace focus:ring-electric-500 with focus:ring-trion-500
    if (content.includes('focus:ring-electric-500')) {
      content = content.replace(/focus:ring-electric-500/g, 'focus:ring-trion-500');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed electric references in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('Fixing electric references to trion...');

const srcDir = path.join(__dirname, '../src');
const tsxFiles = findTsxFiles(srcDir);

let fixedCount = 0;
tsxFiles.forEach(file => {
  if (fixElectricReferences(file)) {
    fixedCount++;
  }
});

console.log(`Fixed ${fixedCount} files with electric references`);
console.log('All electric references have been updated to trion!');
