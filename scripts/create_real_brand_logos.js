const fs = require('fs');
const path = require('path');

const techLogos = [
  // Frontend
  { 
    name: 'React', 
    bgColor: '#20232A', 
    logo: `
      <circle cx="12" cy="12" r="3" fill="#61DAFB"/>
      <circle cx="12" cy="12" r="8" fill="none" stroke="#61DAFB" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="12" fill="none" stroke="#61DAFB" stroke-width="1"/>
      <circle cx="12" cy="12" r="16" fill="none" stroke="#61DAFB" stroke-width="0.8"/>
      <circle cx="12" cy="12" r="20" fill="none" stroke="#61DAFB" stroke-width="0.6"/>
    `,
    textColor: '#61DAFB'
  },
  { 
    name: 'Next.js', 
    bgColor: '#000000', 
    logo: `
      <rect x="4" y="4" width="16" height="16" rx="2" fill="white"/>
      <path d="M8 8h8v8H8z" fill="black"/>
      <path d="M10 10h4v4h-4z" fill="white"/>
    `,
    textColor: '#000000'
  },
  { 
    name: 'TypeScript', 
    bgColor: '#3178C6', 
    logo: `
      <rect x="4" y="4" width="16" height="16" rx="2" fill="white"/>
      <path d="M8 8h8v8H8z" fill="#3178C6"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white" text-anchor="middle">TS</text>
    `,
    textColor: '#3178C6'
  },
  { 
    name: 'Tailwind CSS', 
    bgColor: '#06B6D4', 
    logo: `
      <path d="M12 4l-2 2-2-2 2-2 2 2zm0 16l-2-2-2 2 2 2 2-2zm8-8l2-2-2-2-2 2 2 2zm-16 0l-2-2 2-2 2 2-2 2z" fill="white"/>
      <path d="M12 8l-1 1-1-1 1-1 1 1zm0 8l-1-1-1 1 1 1 1-1zm4-4l1-1-1-1-1 1 1 1zm-8 0l-1-1 1-1 1 1-1 1z" fill="#06B6D4"/>
    `,
    textColor: '#06B6D4'
  },
  { 
    name: 'Flutter', 
    bgColor: '#02569B', 
    logo: `
      <path d="M8 6l8 8-8 8V6z" fill="#42A5F5"/>
      <path d="M8 6l4 4-4 4V6z" fill="white"/>
      <path d="M12 10l4 4-4 4V10z" fill="#42A5F5"/>
    `,
    textColor: '#02569B'
  },
  
  // Backend
  { 
    name: 'Node.js', 
    bgColor: '#339933', 
    logo: `
      <circle cx="12" cy="12" r="8" fill="white"/>
      <path d="M8 8h8v8H8z" fill="#339933"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="white" text-anchor="middle">Node</text>
    `,
    textColor: '#339933'
  },
  { 
    name: 'Python', 
    bgColor: '#3776AB', 
    logo: `
      <path d="M8 6c0-2 2-2 4-2s4 0 4 2v4c0 2-2 2-4 2s-4 0-4-2V6z" fill="#FFD43B"/>
      <path d="M8 14c0 2 2 2 4 2s4 0 4-2v-4c0-2-2-2-4-2s-4 0-4 2v4z" fill="#3776AB"/>
      <circle cx="10" cy="8" r="1" fill="#3776AB"/>
      <circle cx="14" cy="16" r="1" fill="#FFD43B"/>
    `,
    textColor: '#3776AB'
  },
  { 
    name: 'PostgreSQL', 
    bgColor: '#336791', 
    logo: `
      <path d="M8 6h8v12H8z" fill="white"/>
      <path d="M10 8h4v8h-4z" fill="#336791"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="white" text-anchor="middle">SQL</text>
    `,
    textColor: '#336791'
  },
  { 
    name: 'MongoDB', 
    bgColor: '#47A248', 
    logo: `
      <path d="M12 4l-2 4-2-4 2-2 2 2z" fill="white"/>
      <path d="M12 4l2 4 2-4-2-2-2 2z" fill="#47A248"/>
      <path d="M8 8h8v8H8z" fill="white"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#47A248" text-anchor="middle">M</text>
    `,
    textColor: '#47A248'
  },
  { 
    name: 'Redis', 
    bgColor: '#DC382D', 
    logo: `
      <circle cx="12" cy="12" r="6" fill="white"/>
      <circle cx="12" cy="12" r="4" fill="#DC382D"/>
      <text x="12" y="15" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="white" text-anchor="middle">R</text>
    `,
    textColor: '#DC382D'
  },
  
  // Cloud & DevOps
  { 
    name: 'AWS', 
    bgColor: '#FF9900', 
    logo: `
      <path d="M8 6h8v12H8z" fill="white"/>
      <path d="M10 8h4v8h-4z" fill="#FF9900"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="white" text-anchor="middle">AWS</text>
    `,
    textColor: '#FF9900'
  },
  { 
    name: 'Docker', 
    bgColor: '#2496ED', 
    logo: `
      <rect x="6" y="8" width="4" height="4" fill="white"/>
      <rect x="10" y="8" width="4" height="4" fill="white"/>
      <rect x="14" y="8" width="4" height="4" fill="white"/>
      <rect x="8" y="6" width="4" height="4" fill="white"/>
      <rect x="12" y="6" width="4" height="4" fill="white"/>
      <rect x="10" y="4" width="4" height="4" fill="white"/>
    `,
    textColor: '#2496ED'
  },
  { 
    name: 'Kubernetes', 
    bgColor: '#326CE5', 
    logo: `
      <circle cx="12" cy="12" r="6" fill="white"/>
      <path d="M8 8h8v8H8z" fill="#326CE5"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
      <path d="M10 10h4v4h-4z" fill="#326CE5"/>
    `,
    textColor: '#326CE5'
  },
  { 
    name: 'Vercel', 
    bgColor: '#000000', 
    logo: `
      <path d="M8 6l8 8-8 8V6z" fill="white"/>
    `,
    textColor: '#000000'
  },
  { 
    name: 'Alibaba Cloud', 
    bgColor: '#FF6A00', 
    logo: `
      <path d="M8 6h8v12H8z" fill="white"/>
      <path d="M10 8h4v8h-4z" fill="#FF6A00"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="white" text-anchor="middle">AC</text>
    `,
    textColor: '#FF6A00'
  },
  
  // AI & Data
  { 
    name: 'OpenAI', 
    bgColor: '#43B581', 
    logo: `
      <circle cx="12" cy="12" r="6" fill="white"/>
      <path d="M8 8h8v8H8z" fill="#43B581"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="white" text-anchor="middle">AI</text>
    `,
    textColor: '#43B581'
  },
  { 
    name: 'TensorFlow', 
    bgColor: '#FF6F00', 
    logo: `
      <path d="M8 6h8v12H8z" fill="white"/>
      <path d="M10 8h4v8h-4z" fill="#FF6F00"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="white" text-anchor="middle">TF</text>
    `,
    textColor: '#FF6F00'
  },
  { 
    name: 'Pandas', 
    bgColor: '#150458', 
    logo: `
      <path d="M8 6h8v12H8z" fill="white"/>
      <path d="M10 8h4v8h-4z" fill="#150458"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="white" text-anchor="middle">P</text>
    `,
    textColor: '#150458'
  },
  { 
    name: 'Scikit-learn', 
    bgColor: '#F7931E', 
    logo: `
      <path d="M8 6h8v12H8z" fill="white"/>
      <path d="M10 8h4v8h-4z" fill="#F7931E"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="white" text-anchor="middle">SK</text>
    `,
    textColor: '#F7931E'
  },
  { 
    name: 'Jupyter', 
    bgColor: '#F37626', 
    logo: `
      <path d="M8 6h8v12H8z" fill="white"/>
      <path d="M10 8h4v8h-4z" fill="#F37626"/>
      <text x="12" y="14" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="white" text-anchor="middle">J</text>
    `,
    textColor: '#F37626'
  },
];

const outputDir = path.join(__dirname, '../public/images/tech');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

techLogos.forEach(tech => {
  const svgContent = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient-${tech.name.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${tech.bgColor}" />
          <stop offset="100%" stop-color="${tech.bgColor}CC" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#gradient-${tech.name.replace(/\s+/g, '')})" rx="15" ry="15"/>
      <g transform="translate(20, 20) scale(3, 3)">
        ${tech.logo}
      </g>
    </svg>
  `;
  fs.writeFileSync(path.join(outputDir, `${tech.name.toLowerCase().replace(/\s+/g, '')}.svg`), svgContent);
});

console.log('✅ Created real brand logos for all technologies');
