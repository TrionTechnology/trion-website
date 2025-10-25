const fs = require('fs');
const path = require('path');

function removeFramerMotionFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove framer-motion imports
    content = content.replace(/import\s*{\s*[^}]*motion[^}]*}\s*from\s*["']framer-motion["'];?\s*\n/g, '');
    content = content.replace(/import\s*{\s*AnimatePresence[^}]*}\s*from\s*["']framer-motion["'];?\s*\n/g, '');
    
    // Replace motion.div with div
    content = content.replace(/motion\.div/g, 'div');
    content = content.replace(/motion\.section/g, 'section');
    content = content.replace(/motion\.h1/g, 'h1');
    content = content.replace(/motion\.h2/g, 'h2');
    content = content.replace(/motion\.h3/g, 'h3');
    content = content.replace(/motion\.p/g, 'p');
    content = content.replace(/motion\.span/g, 'span');
    content = content.replace(/motion\.button/g, 'button');
    content = content.replace(/motion\.a/g, 'a');
    content = content.replace(/motion\.ul/g, 'ul');
    content = content.replace(/motion\.li/g, 'li');
    content = content.replace(/motion\.article/g, 'article');
    content = content.replace(/motion\.header/g, 'header');
    content = content.replace(/motion\.footer/g, 'footer');
    content = content.replace(/motion\.nav/g, 'nav');
    content = content.replace(/motion\.main/g, 'main');
    content = content.replace(/motion\.aside/g, 'aside');
    
    // Remove motion props
    content = content.replace(/\s*initial={[^}]*}/g, '');
    content = content.replace(/\s*animate={[^}]*}/g, '');
    content = content.replace(/\s*whileInView={[^}]*}/g, '');
    content = content.replace(/\s*whileHover={[^}]*}/g, '');
    content = content.replace(/\s*whileTap={[^}]*}/g, '');
    content = content.replace(/\s*transition={[^}]*}/g, '');
    content = content.replace(/\s*viewport={[^}]*}/g, '');
    content = content.replace(/\s*exit={[^}]*}/g, '');
    content = content.replace(/\s*key={[^}]*}/g, '');
    
    // Remove AnimatePresence
    content = content.replace(/<AnimatePresence[^>]*>/g, '');
    content = content.replace(/<\/AnimatePresence>/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      removeFramerMotionFromFile(filePath);
    }
  }
}

// Process the src directory
processDirectory('./src');
console.log('Framer Motion removal completed!');
