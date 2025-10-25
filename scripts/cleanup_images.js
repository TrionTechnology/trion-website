const fs = require('fs');
const path = require('path');

// Clean up unused SVG files and organize images
const cleanupImages = () => {
  console.log('🧹 Cleaning up unused images...');
  
  // Remove old SVG project files that are no longer used
  const unusedSvgs = [
    '/public/images/projects/cartonflow-erp.svg',
    '/public/images/projects/redbox-ktv.svg', 
    '/public/images/projects/ebooster-health.svg'
  ];
  
  unusedSvgs.forEach(svgPath => {
    const fullPath = path.join(__dirname, '..', svgPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✅ Removed ${svgPath}`);
    }
  });
  
  // Create organized directories for better structure
  const directories = [
    '/public/images/hero',
    '/public/images/team',
    '/public/images/technology',
    '/public/images/development'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created ${dir}`);
    }
  });
  
  // Move images to appropriate directories
  const imageMoves = [
    { from: '/public/images/hero-bg.jpg', to: '/public/images/hero/background.jpg' },
    { from: '/public/images/malaysia-skyline.jpg', to: '/public/images/hero/malaysia-skyline.jpg' },
    { from: '/public/images/coding-session.jpg', to: '/public/images/team/coding-session.jpg' },
    { from: '/public/images/team-working.jpg', to: '/public/images/team/team-working.jpg' },
    { from: '/public/images/cloud-computing.jpg', to: '/public/images/technology/cloud-computing.jpg' },
    { from: '/public/images/ai-brain.jpg', to: '/public/images/technology/ai-brain.jpg' },
    { from: '/public/images/mobile-devices.jpg', to: '/public/images/technology/mobile-devices.jpg' }
  ];
  
  imageMoves.forEach(move => {
    const fromPath = path.join(__dirname, '..', move.from);
    const toPath = path.join(__dirname, '..', move.to);
    
    if (fs.existsSync(fromPath)) {
      // Ensure destination directory exists
      const toDir = path.dirname(toPath);
      if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, { recursive: true });
      }
      
      fs.renameSync(fromPath, toPath);
      console.log(`📦 Moved ${move.from} → ${move.to}`);
    }
  });
  
  console.log('🎉 Image cleanup complete!');
};

cleanupImages();
