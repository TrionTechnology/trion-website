const fs = require('fs');
const path = require('path');

// Create background images for different sections
const backgroundImages = [
  {
    name: 'team-collaboration-bg',
    description: 'Modern team collaboration workspace with people working together on computers, warm lighting, glass office environment',
    filename: 'team-collaboration-bg.svg'
  },
  {
    name: 'cloud-infrastructure-bg', 
    description: 'Futuristic cloud computing infrastructure with server racks, data centers, network connections, blue tech theme',
    filename: 'cloud-infrastructure-bg.svg'
  },
  {
    name: 'services-hero-bg',
    description: 'Abstract tech background with geometric shapes, circuit patterns, and modern gradient design in teal and blue',
    filename: 'services-hero-bg.svg'
  },
  {
    name: 'about-hero-bg',
    description: 'Professional office environment with modern workspace, team meeting, collaborative atmosphere',
    filename: 'about-hero-bg.svg'
  },
  {
    name: 'contact-hero-bg',
    description: 'Communication and contact theme with phone icons, email symbols, and connection lines in teal colors',
    filename: 'contact-hero-bg.svg'
  },
  {
    name: 'work-hero-bg',
    description: 'Portfolio and project showcase background with code snippets, design elements, and creative workspace',
    filename: 'work-hero-bg.svg'
  },
  {
    name: 'blog-hero-bg',
    description: 'Content creation and blogging theme with writing tools, articles, and knowledge sharing elements',
    filename: 'blog-hero-bg.svg'
  },
  {
    name: 'careers-hero-bg',
    description: 'Career and job opportunities background with professional growth, team building, and success elements',
    filename: 'careers-hero-bg.svg'
  }
];

function createSVGImage(name, description, filename) {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="600" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A0A0A;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0A0A0A;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#14b8a6;stop-opacity:0.3" />
      <stop offset="50%" style="stop-color:#2dd4bf;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:0.3" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#14b8a6" stroke-width="0.5" opacity="0.1"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="600" fill="url(#bg-gradient)"/>
  
  <!-- Grid Pattern -->
  <rect width="1200" height="600" fill="url(#grid)"/>
  
  <!-- Abstract Shapes -->
  <circle cx="200" cy="150" r="80" fill="url(#accent-gradient)" opacity="0.4"/>
  <circle cx="1000" cy="450" r="120" fill="url(#accent-gradient)" opacity="0.3"/>
  <rect x="800" y="100" width="200" height="200" rx="20" fill="url(#accent-gradient)" opacity="0.2" transform="rotate(45 900 200)"/>
  
  <!-- Connection Lines -->
  <path d="M 100 300 Q 300 200 500 300 T 900 300" stroke="#14b8a6" stroke-width="2" fill="none" opacity="0.3"/>
  <path d="M 200 100 Q 400 300 600 100 T 1000 100" stroke="#2dd4bf" stroke-width="1.5" fill="none" opacity="0.4"/>
  
  <!-- Tech Elements -->
  <g opacity="0.2">
    <rect x="50" y="50" width="60" height="40" rx="5" fill="#14b8a6"/>
    <rect x="130" y="50" width="60" height="40" rx="5" fill="#2dd4bf"/>
    <rect x="210" y="50" width="60" height="40" rx="5" fill="#14b8a6"/>
    
    <rect x="900" y="500" width="60" height="40" rx="5" fill="#2dd4bf"/>
    <rect x="980" y="500" width="60" height="40" rx="5" fill="#14b8a6"/>
    <rect x="1060" y="500" width="60" height="40" rx="5" fill="#2dd4bf"/>
  </g>
  
  <!-- Floating Elements -->
  <circle cx="150" cy="450" r="20" fill="#14b8a6" opacity="0.6"/>
  <circle cx="1050" cy="150" r="15" fill="#2dd4bf" opacity="0.7"/>
  <circle cx="600" cy="500" r="25" fill="#14b8a6" opacity="0.5"/>
  
  <!-- Data Streams -->
  <g opacity="0.3">
    <path d="M 0 200 L 200 180 L 400 220 L 600 200 L 800 240 L 1000 200 L 1200 220" stroke="#14b8a6" stroke-width="3" fill="none"/>
    <path d="M 0 400 L 200 420 L 400 380 L 600 400 L 800 360 L 1000 400 L 1200 380" stroke="#2dd4bf" stroke-width="2" fill="none"/>
  </g>
</svg>`;

  const filePath = path.join(__dirname, '..', 'public', 'images', 'backgrounds', filename);
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created: ${filename}`);
}

// Create all background images
console.log('Creating background images...');
backgroundImages.forEach(img => {
  createSVGImage(img.name, img.description, img.filename);
});

console.log('Background images created successfully!');
