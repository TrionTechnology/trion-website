const fs = require('fs');
const path = require('path');

// Create SVG images for better visual appeal
const createSVG = (width, height, content, filename) => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#C9A227;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#E6C66B;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0F0F0F;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1A1A1A;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#darkGradient)"/>
    ${content}
  </svg>`;
  
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'images', filename), svg);
};

// Create hero background
createSVG(1920, 1080, `
  <circle cx="200" cy="200" r="100" fill="url(#goldGradient)" opacity="0.1"/>
  <circle cx="800" cy="400" r="150" fill="url(#goldGradient)" opacity="0.05"/>
  <circle cx="1200" cy="200" r="80" fill="url(#goldGradient)" opacity="0.08"/>
  <rect x="100" y="300" width="200" height="2" fill="url(#goldGradient)" opacity="0.3"/>
  <rect x="600" y="100" width="300" height="1" fill="url(#goldGradient)" opacity="0.2"/>
`, 'hero/background.svg');

// Create project images
const projects = [
  { name: 'cartonflow-erp', title: 'CartonFlow ERP', desc: 'Manufacturing ERP System' },
  { name: 'redbox-ktv', title: 'RedBox KTV', desc: 'Mobile Booking App' },
  { name: 'ebooster-health', title: 'EBooster Health', desc: 'AI Health Platform' }
];

projects.forEach(project => {
  createSVG(400, 300, `
    <rect x="20" y="20" width="360" height="260" rx="20" fill="url(#darkGradient)" stroke="url(#goldGradient)" stroke-width="2"/>
    <text x="200" y="120" text-anchor="middle" fill="url(#goldGradient)" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${project.title}</text>
    <text x="200" y="150" text-anchor="middle" fill="#94A3B8" font-family="Arial, sans-serif" font-size="14">${project.desc}</text>
    <circle cx="200" cy="200" r="30" fill="url(#goldGradient)" opacity="0.3"/>
    <rect x="50" y="220" width="300" height="2" fill="url(#goldGradient)" opacity="0.5"/>
  `, `projects/${project.name}.svg`);
});

console.log('✅ Created enhanced SVG images');
